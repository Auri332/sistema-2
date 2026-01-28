
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
  const [activeTab, setActiveTab] = useState<'finance' | 'inventory' | 'students'>('students');
  
  // Modais
  const [isFinanceModalOpen, setIsFinanceModalOpen] = useState(false);
  const [newRecord, setNewRecord] = useState<Partial<FinancialRecord>>({ type: 'income', category: 'Propina' });
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Partial<Student> | null>(null);

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

  const handleSaveStudent = () => {
    if (!editingStudent?.name || !editingStudent?.classId) {
      alert("Preencha o nome e a turma.");
      return;
    }
    if (editingStudent.id) {
      setStudents(prev => prev.map(s => s.id === editingStudent.id ? (editingStudent as Student) : s));
    } else {
      const student: Student = {
        ...editingStudent,
        id: `s-${Date.now()}`,
        status: 'active',
        grades: { q1: 0, q2: 0, q3: 0, exam: 0, absences: 0 },
        balance: 0,
        performance: 100,
        attendance: 100
      } as Student;
      setStudents(prev => [...prev, student]);
    }
    setIsStudentModalOpen(false);
    setEditingStudent(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white border-b p-6 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg">SEC</div>
          <div>
            <h1 className="font-black text-indigo-950">Secretaria Erasmus</h1>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Portal Administrativo</p>
          </div>
        </div>
        <nav className="flex bg-gray-100 p-1 rounded-xl">
           {['students', 'finance', 'inventory'].map(t => (
             <button key={t} onClick={() => setActiveTab(t as any)} className={`px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-white text-indigo-950 shadow-sm' : 'text-gray-400 hover:text-indigo-600'}`}>
               {t === 'finance' ? 'Caixa' : t === 'inventory' ? 'Estoque' : 'Matrículas'}
             </button>
           ))}
        </nav>
        <Button variant="outline" className="text-xs" onClick={onLogout}>Sair</Button>
      </header>

      <main className="max-w-7xl mx-auto p-6 md:p-12 w-full space-y-8">
        
        {/* ABA MATRÍCULAS (ALUNOS) */}
        {activeTab === 'students' && (
           <div className="space-y-8 animate-fadeIn">
              <div className="flex justify-between items-end">
                <h2 className="text-3xl font-black text-indigo-950">Base de Alunos</h2>
                <Button onClick={() => { setEditingStudent({ classId: classes[0]?.id }); setIsStudentModalOpen(true); }}>+ Nova Matrícula</Button>
              </div>
              <Card className="overflow-hidden border-none shadow-xl">
                 <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="p-5 text-[10px] font-black uppercase text-gray-400">Aluno</th>
                        <th className="p-5 text-[10px] font-black uppercase text-gray-400">Encarregado</th>
                        <th className="p-5 text-[10px] font-black uppercase text-gray-400">Turma</th>
                        <th className="p-5 text-right text-[10px] font-black uppercase text-gray-400">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {students.map(s => (
                        <tr key={s.id} className="hover:bg-indigo-50/20 transition-colors">
                          <td className="p-5">
                            <p className="font-black text-indigo-950">{s.name}</p>
                            <p className="text-xs text-gray-400">{s.age} anos</p>
                          </td>
                          <td className="p-5 text-sm font-bold text-gray-600">{s.parentName}</td>
                          <td className="p-5"><Badge color="bg-indigo-50 text-indigo-600">{classes.find(c => c.id === s.classId)?.name}</Badge></td>
                          <td className="p-5 text-right">
                             <button onClick={() => { setEditingStudent(s); setIsStudentModalOpen(true); }} className="text-indigo-600 font-bold text-xs hover:underline">Editar</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
              </Card>
           </div>
        )}

        {/* ABA FINANCEIRO (Lançamentos de Propinas e Gastos) */}
        {activeTab === 'finance' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex justify-between items-end">
              <h2 className="text-3xl font-black text-indigo-950">Fluxo de Caixa</h2>
              <Button variant="secondary" onClick={() => setIsFinanceModalOpen(true)}>+ Registrar Entrada/Saída</Button>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6">
              <StatsCard title="Receitas" value={`${finances.filter(f=>f.type==='income').reduce((a,b)=>a+b.amount,0).toLocaleString()} AKZ`} color="bg-emerald-50 text-emerald-700" icon="💹" />
              <StatsCard title="Despesas" value={`${finances.filter(f=>f.type==='expense').reduce((a,b)=>a+b.amount,0).toLocaleString()} AKZ`} color="bg-rose-50 text-rose-700" icon="📉" />
            </div>

            <Card className="overflow-hidden border-none shadow-xl">
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
                      <td className="p-5 text-sm text-gray-400">{f.date}</td>
                      <td className="p-5 font-bold text-indigo-950">{f.description}</td>
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

        {/* ABA ESTOQUE (Materiais) */}
        {activeTab === 'inventory' && (
          <div className="space-y-8 animate-fadeIn">
            <h2 className="text-3xl font-black text-indigo-950">Estoque de Materiais</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {inventory.map(item => (
                <Card key={item.id} className="p-8 border-none shadow-xl bg-white">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{item.category}</span>
                    {item.quantity <= item.minQuantity && <Badge color="bg-rose-500 text-white animate-pulse">Comprar Urgente</Badge>}
                  </div>
                  <h3 className="text-xl font-black text-indigo-950 mb-6">{item.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black text-indigo-600">{item.quantity}</span>
                    <div className="flex gap-2">
                      <button onClick={() => setInventory(prev => prev.map(i => i.id === item.id ? {...i, quantity: Math.max(0, i.quantity - 1)} : i))} className="w-10 h-10 bg-gray-50 rounded-xl hover:bg-rose-100 text-rose-500 font-bold">－</button>
                      <button onClick={() => setInventory(prev => prev.map(i => i.id === item.id ? {...i, quantity: i.quantity + 1} : i))} className="w-10 h-10 bg-gray-50 rounded-xl hover:bg-emerald-100 text-emerald-500 font-bold">＋</button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MODAL MATRÍCULA */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-indigo-950/60 backdrop-blur-sm" onClick={() => setIsStudentModalOpen(false)}></div>
          <Card className="relative w-full max-w-lg p-8 space-y-6 shadow-2xl animate-fadeIn">
            <h2 className="text-2xl font-black text-indigo-950">Dados da Matrícula</h2>
            <Input label="Nome do Aluno" value={editingStudent?.name || ''} onChange={e => setEditingStudent({...editingStudent, name: e.target.value})} />
            <Input label="Idade" type="number" value={editingStudent?.age || ''} onChange={e => setEditingStudent({...editingStudent, age: parseInt(e.target.value)})} />
            <Input label="Encarregado de Educação" value={editingStudent?.parentName || ''} onChange={e => setEditingStudent({...editingStudent, parentName: e.target.value})} />
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400">Turma Designada</label>
              <select className="w-full p-4 rounded-2xl border bg-gray-50 font-bold" value={editingStudent?.classId || ''} onChange={e => setEditingStudent({...editingStudent, classId: e.target.value})}>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="ghost" className="flex-1" onClick={() => setIsStudentModalOpen(false)}>Cancelar</Button>
              <Button className="flex-1" onClick={handleSaveStudent}>Confirmar Matrícula</Button>
            </div>
          </Card>
        </div>
      )}

      {/* MODAL FINANCEIRO */}
      {isFinanceModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-indigo-950/60 backdrop-blur-sm" onClick={() => setIsFinanceModalOpen(false)}></div>
          <Card className="relative w-full max-w-lg p-8 space-y-6 shadow-2xl animate-fadeIn">
            <h2 className="text-2xl font-black text-indigo-950">Novo Lançamento</h2>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setNewRecord({...newRecord, type: 'income'})} className={`p-4 rounded-2xl font-black text-xs border-2 transition-all ${newRecord.type === 'income' ? 'bg-emerald-500 text-white border-emerald-500' : 'border-gray-100 text-gray-400'}`}>Entrada (+)</button>
              <button onClick={() => setNewRecord({...newRecord, type: 'expense'})} className={`p-4 rounded-2xl font-black text-xs border-2 transition-all ${newRecord.type === 'expense' ? 'bg-rose-500 text-white border-rose-500' : 'border-gray-100 text-gray-400'}`}>Saída (-)</button>
            </div>
            <Input label="Valor (AKZ)" type="number" value={newRecord.amount || ''} onChange={e => setNewRecord({...newRecord, amount: parseFloat(e.target.value)})} />
            <Input label="Descrição" placeholder="Ex: Pagamento Propina Alice" value={newRecord.description || ''} onChange={e => setNewRecord({...newRecord, description: e.target.value})} />
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
              <Button className="flex-1" onClick={handleSaveFinance}>Gravar Movimento</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
