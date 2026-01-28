
import React, { useState } from 'react';
import { Card, Button, Input, StatsCard, Badge } from '../components/Shared';
import { User, Student, Class, FinancialRecord, InventoryItem } from '../types';

interface StaffDashboardProps {
  user: User;
  onLogout: () => void;
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  classes: Class[];
  finances: FinancialRecord[];
  setFinances: React.Dispatch<React.SetStateAction<FinancialRecord[]>>;
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
}

const StaffDashboard: React.FC<StaffDashboardProps> = ({ 
  user, onLogout, students, setStudents, classes, finances, setFinances, inventory, setInventory 
}) => {
  const [activeTab, setActiveTab] = useState<'finance' | 'inventory' | 'students'>('finance');
  const [isFinanceModalOpen, setIsFinanceModalOpen] = useState(false);
  const [newRecord, setNewRecord] = useState<Partial<FinancialRecord>>({ type: 'income', category: 'Propina' });

  const handleSaveFinance = () => {
    if (!newRecord.amount || !newRecord.description) return;
    const record: FinancialRecord = {
      ...newRecord,
      id: `f-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    } as FinancialRecord;
    
    setFinances(prev => [...prev, record]);
    setIsFinanceModalOpen(false);
    setNewRecord({ type: 'income', category: 'Propina' });
  };

  const handleUpdateStock = (id: string, delta: number) => {
    setInventory(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white border-b p-6 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg">SEC</div>
          <div>
            <h1 className="font-black text-indigo-950">Secretaria & Administrativo</h1>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{user.name}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <nav className="flex bg-gray-100 p-1 rounded-xl">
             {['finance', 'inventory', 'students'].map(t => (
               <button key={t} onClick={() => setActiveTab(t as any)} className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-white text-indigo-950 shadow-sm' : 'text-gray-400 hover:text-indigo-600'}`}>
                 {t === 'finance' ? 'Finanças' : t === 'inventory' ? 'Estoque' : 'Matrículas'}
               </button>
             ))}
          </nav>
          <Button variant="outline" className="text-xs py-2" onClick={onLogout}>Sair</Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 md:p-12 w-full space-y-8">
        
        {/* ABA FINANÇAS: ENTRADAS E SAÍDAS */}
        {activeTab === 'finance' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex justify-between items-end">
              <h2 className="text-3xl font-black text-indigo-950">Movimentação de Caixa</h2>
              <Button variant="secondary" onClick={() => setIsFinanceModalOpen(true)}>+ Registrar Lançamento</Button>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6">
              <StatsCard title="Receitas Mês" value={`${finances.filter(f => f.type === 'income').reduce((a,b)=>a+b.amount,0).toLocaleString()} AKZ`} color="bg-white border-b-4 border-emerald-500" icon="💹" />
              <StatsCard title="Despesas Mês" value={`${finances.filter(f => f.type === 'expense').reduce((a,b)=>a+b.amount,0).toLocaleString()} AKZ`} color="bg-white border-b-4 border-rose-500" icon="📉" />
            </div>

            <Card className="overflow-hidden border-none shadow-2xl">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="p-5 text-[10px] font-black uppercase text-gray-400">Data</th>
                    <th className="p-5 text-[10px] font-black uppercase text-gray-400">Descrição</th>
                    <th className="p-5 text-[10px] font-black uppercase text-gray-400">Categoria</th>
                    <th className="p-5 text-right text-[10px] font-black uppercase text-gray-400">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {finances.slice().reverse().map(f => (
                    <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-5 text-sm font-bold text-gray-500">{f.date}</td>
                      <td className="p-5 font-black text-indigo-950">{f.description}</td>
                      <td className="p-5"><Badge color={f.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}>{f.category}</Badge></td>
                      <td className={`p-5 text-right font-black ${f.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {f.type === 'income' ? '+' : '-'} {f.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}

        {/* ABA ESTOQUE: CONSUMÍVEIS E MATERIAIS */}
        {activeTab === 'inventory' && (
          <div className="space-y-8 animate-fadeIn">
            <h2 className="text-3xl font-black text-indigo-950">Gestão de Inventário</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {inventory.map(item => (
                <Card key={item.id} className={`p-8 border-none shadow-xl transition-all ${item.quantity <= item.minQuantity ? 'bg-rose-50 ring-2 ring-rose-200' : 'bg-white'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{item.category}</span>
                    {item.quantity <= item.minQuantity && <Badge color="bg-rose-500 text-white animate-pulse">Estoque Baixo</Badge>}
                  </div>
                  <h3 className="text-xl font-black text-indigo-950 mb-6">{item.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black text-indigo-600">{item.quantity}</span>
                    <div className="flex gap-2">
                      <button onClick={() => handleUpdateStock(item.id, -1)} className="w-10 h-10 bg-gray-100 rounded-xl hover:bg-rose-100 text-rose-500 font-bold transition-all">－</button>
                      <button onClick={() => handleUpdateStock(item.id, 1)} className="w-10 h-10 bg-gray-100 rounded-xl hover:bg-emerald-100 text-emerald-500 font-bold transition-all">＋</button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ABA MATRÍCULAS: ALUNOS */}
        {activeTab === 'students' && (
           <div className="space-y-8 animate-fadeIn">
              <div className="flex justify-between items-end">
                <h2 className="text-3xl font-black text-indigo-950">Base de Alunos</h2>
                <Button>Nova Matrícula</Button>
              </div>
              <Card className="overflow-hidden border-none shadow-xl">
                 <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="p-5 text-[10px] font-black uppercase text-gray-400">Aluno</th>
                        <th className="p-5 text-[10px] font-black uppercase text-gray-400">Responsável</th>
                        <th className="p-5 text-[10px] font-black uppercase text-gray-400">Turma</th>
                        <th className="p-5 text-right text-[10px] font-black uppercase text-gray-400">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {students.map(s => (
                        <tr key={s.id} className="hover:bg-indigo-50/20 transition-colors">
                          <td className="p-5 font-black text-indigo-950">{s.name}<br/><span className="text-xs font-normal text-gray-400">{s.age} anos</span></td>
                          <td className="p-5 text-sm text-gray-600 font-bold">{s.parentName}</td>
                          <td className="p-5 text-sm font-bold text-indigo-600">{classes.find(c => c.id === s.classId)?.name}</td>
                          <td className="p-5 text-right"><Badge color={s.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}>{s.status}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
              </Card>
           </div>
        )}
      </main>

      {/* MODAL LANÇAMENTO FINANCEIRO */}
      {isFinanceModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-indigo-950/60 backdrop-blur-sm" onClick={() => setIsFinanceModalOpen(false)}></div>
          <Card className="relative w-full max-w-lg p-8 space-y-6 shadow-2xl animate-fadeIn">
            <h2 className="text-2xl font-black text-indigo-950">Novo Lançamento</h2>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setNewRecord({...newRecord, type: 'income'})} className={`p-4 rounded-2xl font-black uppercase text-xs tracking-widest border-2 transition-all ${newRecord.type === 'income' ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg' : 'border-gray-100 text-gray-400'}`}>Entrada (+)</button>
              <button onClick={() => setNewRecord({...newRecord, type: 'expense'})} className={`p-4 rounded-2xl font-black uppercase text-xs tracking-widest border-2 transition-all ${newRecord.type === 'expense' ? 'bg-rose-500 text-white border-rose-500 shadow-lg' : 'border-gray-100 text-gray-400'}`}>Saída (-)</button>
            </div>
            <Input label="Valor (AKZ)" type="number" value={newRecord.amount || ''} onChange={e => setNewRecord({...newRecord, amount: parseFloat(e.target.value)})} />
            <Input label="Descrição do Lançamento" placeholder="Ex: Pagamento Propina Alice" value={newRecord.description || ''} onChange={e => setNewRecord({...newRecord, description: e.target.value})} />
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400">Categoria</label>
              <select className="w-full p-4 rounded-2xl border bg-gray-50 font-bold" value={newRecord.category} onChange={e => setNewRecord({...newRecord, category: e.target.value as any})}>
                <option value="Propina">Propina</option>
                <option value="Salário">Salário</option>
                <option value="Material">Material</option>
                <option value="Manutenção">Manutenção</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="ghost" className="flex-1" onClick={() => setIsFinanceModalOpen(false)}>Cancelar</Button>
              <Button className="flex-1" onClick={handleSaveFinance}>Confirmar Registro</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
