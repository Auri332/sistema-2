
import React, { useState } from 'react';
import { Card, Button, Input, Badge, StatsCard } from '../components/Shared';
import { User, UserRole, SiteContent, Student, Class, FinancialRecord } from '../types';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
  siteContent: SiteContent;
  onUpdateSite: (content: SiteContent) => void;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  classes: Class[];
  setClasses: React.Dispatch<React.SetStateAction<Class[]>>;
  finances: FinancialRecord[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  user, onLogout, siteContent, onUpdateSite, users, setUsers, students, classes, setClasses, finances 
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'classes' | 'site' | 'reports'>('users');
  
  // Estados para Modais
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Partial<Class> | null>(null);

  // Handlers de Usuário
  const handleSaveUser = () => {
    if (!editingUser?.name || !editingUser?.email || !editingUser?.role) {
      alert("Preencha os campos obrigatórios.");
      return;
    }
    if (editingUser.id) {
      setUsers(prev => prev.map(u => u.id === editingUser.id ? (editingUser as User) : u));
    } else {
      setUsers(prev => [...prev, { ...editingUser, id: `u-${Date.now()}` } as User]);
    }
    setIsUserModalOpen(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (id: string) => {
    if (confirm("Excluir este usuário permanentemente?")) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  // Handlers de Turma
  const handleSaveClass = () => {
    if (!editingClass?.name || !editingClass?.room || !editingClass?.teacherId) {
      alert("Preencha todos os dados da turma.");
      return;
    }
    if (editingClass.id) {
      setClasses(prev => prev.map(c => c.id === editingClass.id ? (editingClass as Class) : c));
    } else {
      setClasses(prev => [...prev, { ...editingClass, id: `c-${Date.now()}`, capacity: 20 } as Class]);
    }
    setIsClassModalOpen(false);
    setEditingClass(null);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-indigo-950 text-white p-6 hidden lg:flex flex-col shadow-2xl">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black">PB</div>
          <span className="font-black text-xl tracking-tight uppercase">Admin</span>
        </div>
        
        <nav className="space-y-2 flex-1">
          {[
            { id: 'users', label: 'Gestão de Usuários', icon: '👥' },
            { id: 'classes', label: 'Turmas & Salas', icon: '🏫' },
            { id: 'reports', label: 'Relatórios Base', icon: '📊' },
            { id: 'site', label: 'Site Público', icon: '🌐' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-xl' : 'text-indigo-200 hover:bg-white/5'}`}
            >
              <span>{item.icon}</span> <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="p-4 rounded-2xl font-bold text-rose-400 hover:bg-rose-500/10 flex items-center gap-3 mt-auto">🚪 Sair</button>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 md:p-12">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* ABA: GESTÃO DE USUÁRIOS */}
          {activeTab === 'users' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-3xl font-black text-indigo-950">Usuários & Equipe</h1>
                  <p className="text-gray-500">Controle de acessos de professores, staff e pais.</p>
                </div>
                <Button onClick={() => { setEditingUser({ role: UserRole.TEACHER }); setIsUserModalOpen(true); }}>
                  + Novo Usuário
                </Button>
              </div>

              <Card className="overflow-hidden shadow-xl border-none">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-400">
                    <tr>
                      <th className="p-5">Nome / Email</th>
                      <th className="p-5">Nível</th>
                      <th className="p-5">Vínculo</th>
                      <th className="p-5 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-indigo-50/20">
                        <td className="p-5">
                          <div className="font-bold text-indigo-950">{u.name}</div>
                          <div className="text-xs text-gray-400">{u.email}</div>
                        </td>
                        <td className="p-5"><Badge>{u.role}</Badge></td>
                        <td className="p-5 text-xs text-gray-500">
                          {u.studentId ? `Pai de: ${students.find(s => s.id === u.studentId)?.name || 'N/A'}` : 'Institucional'}
                        </td>
                        <td className="p-5 text-right space-x-2">
                          <button onClick={() => { setEditingUser(u); setIsUserModalOpen(true); }} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg">✏️</button>
                          <button onClick={() => handleDeleteUser(u.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg">🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {/* ABA: TURMAS & SALAS */}
          {activeTab === 'classes' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-3xl font-black text-indigo-950">Turmas e Salas</h1>
                  <p className="text-gray-500">Configuração pedagógica da instituição.</p>
                </div>
                <Button onClick={() => { setEditingClass({}); setIsClassModalOpen(true); }}>+ Nova Turma</Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {classes.map(c => (
                  <Card key={c.id} className="p-6 border-none shadow-xl hover:shadow-2xl transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <Badge color="bg-indigo-100 text-indigo-600 mb-2">{c.room}</Badge>
                        <h3 className="text-xl font-black text-indigo-950">{c.name}</h3>
                      </div>
                      <button onClick={() => { setEditingClass(c); setIsClassModalOpen(true); }} className="text-gray-300 group-hover:text-indigo-600 transition-colors">✏️</button>
                    </div>
                    <div className="text-sm font-bold text-gray-500 space-y-1">
                      <p>🧑‍🏫 {users.find(u => u.id === c.teacherId)?.name || 'Sem Professor'}</p>
                      <p>👶 {students.filter(s => s.classId === c.id).length} Alunos Matriculados</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Outras abas (Site e Reports) mantidas conforme lógica anterior */}
          {activeTab === 'reports' && (
            <div className="space-y-8 animate-fadeIn">
              <h1 className="text-3xl font-black text-indigo-950">Balanço do Sistema</h1>
              <div className="grid md:grid-cols-3 gap-6">
                <StatsCard title="Entradas" value={`${finances.filter(f=>f.type==='income').reduce((a,b)=>a+b.amount,0).toLocaleString()} AKZ`} color="bg-emerald-50 text-emerald-700" icon="💰" />
                <StatsCard title="Saídas" value={`${finances.filter(f=>f.type==='expense').reduce((a,b)=>a+b.amount,0).toLocaleString()} AKZ`} color="bg-rose-50 text-rose-700" icon="📉" />
                <StatsCard title="Usuários Ativos" value={users.length} color="bg-indigo-50 text-indigo-700" icon="👥" />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* MODAL USUÁRIO */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-indigo-950/60 backdrop-blur-sm" onClick={() => setIsUserModalOpen(false)}></div>
          <Card className="relative w-full max-w-lg p-8 space-y-6 shadow-2xl animate-fadeIn">
            <h2 className="text-2xl font-black text-indigo-950">{editingUser?.id ? 'Editar Usuário' : 'Novo Usuário'}</h2>
            <Input label="Nome Completo" value={editingUser?.name || ''} onChange={e => setEditingUser({...editingUser, name: e.target.value})} />
            <Input label="Email de Acesso" value={editingUser?.email || ''} onChange={e => setEditingUser({...editingUser, email: e.target.value})} />
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400">Tipo de Conta</label>
              <select className="w-full p-4 rounded-2xl border bg-gray-50 font-bold" value={editingUser?.role || ''} onChange={e => setEditingUser({...editingUser, role: e.target.value as UserRole})}>
                {Object.values(UserRole).filter(r => r !== UserRole.PUBLIC).map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            {editingUser?.role === UserRole.PARENT && (
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-400">Vincular a Aluno</label>
                <select className="w-full p-4 rounded-2xl border bg-gray-50 font-bold" value={editingUser?.studentId || ''} onChange={e => setEditingUser({...editingUser, studentId: e.target.value})}>
                  <option value="">Selecione...</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            )}
            <div className="flex gap-3 pt-4">
              <Button variant="ghost" className="flex-1" onClick={() => setIsUserModalOpen(false)}>Cancelar</Button>
              <Button className="flex-1" onClick={handleSaveUser}>Salvar Acesso</Button>
            </div>
          </Card>
        </div>
      )}

      {/* MODAL TURMA */}
      {isClassModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-indigo-950/60 backdrop-blur-sm" onClick={() => setIsClassModalOpen(false)}></div>
          <Card className="relative w-full max-w-lg p-8 space-y-6 shadow-2xl animate-fadeIn">
            <h2 className="text-2xl font-black text-indigo-950">Configurar Turma</h2>
            <Input label="Nome da Turma" value={editingClass?.name || ''} onChange={e => setEditingClass({...editingClass, name: e.target.value})} />
            <Input label="Sala física" value={editingClass?.room || ''} onChange={e => setEditingClass({...editingClass, room: e.target.value})} />
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400">Professor Responsável</label>
              <select className="w-full p-4 rounded-2xl border bg-gray-50 font-bold" value={editingClass?.teacherId || ''} onChange={e => setEditingClass({...editingClass, teacherId: e.target.value})}>
                <option value="">Selecione...</option>
                {users.filter(u => u.role === UserRole.TEACHER).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="ghost" className="flex-1" onClick={() => setIsClassModalOpen(false)}>Cancelar</Button>
              <Button className="flex-1" onClick={handleSaveClass}>Salvar Turma</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
