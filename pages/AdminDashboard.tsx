
import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Badge, StatsCard } from '../components/Shared';
import { User, UserRole, SiteContent, SitePage, Student } from '../types';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
  siteContent: SiteContent;
  onUpdateSite: (content: SiteContent) => void;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  students: Student[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  user, onLogout, siteContent, onUpdateSite, users, setUsers, students 
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'finance' | 'site' | 'pages'>('users');
  const [editContent, setEditContent] = useState(siteContent);
  const [editingPage, setEditingPage] = useState<SitePage | null>(null);
  
  // Estados para Gestão de Usuários
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);

  const handleSaveUser = () => {
    if (!editingUser?.name || !editingUser?.email || !editingUser?.role) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (editingUser.id) {
      setUsers(prev => prev.map(u => u.id === editingUser.id ? (editingUser as User) : u));
    } else {
      const newUser: User = {
        ...editingUser as User,
        id: `u-${Date.now()}`,
      };
      setUsers(prev => [...prev, newUser]);
    }
    setIsUserModalOpen(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este usuário? Ele perderá o acesso imediatamente.")) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-indigo-950 text-white p-6 hidden lg:flex flex-col shadow-2xl">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black">PB</div>
          <span className="font-black text-xl tracking-tight uppercase">Admin Panel</span>
        </div>
        
        <nav className="space-y-2 flex-1">
          {[
            { id: 'users', label: 'Usuários & Equipe', icon: '👥' },
            { id: 'site', label: 'Editar Site', icon: '🌐' },
            { id: 'pages', label: 'Páginas Extras', icon: '📄' },
            { id: 'finance', label: 'Relatórios', icon: '💰' }
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
        
        <button onClick={onLogout} className="p-4 rounded-2xl font-bold text-rose-400 hover:bg-rose-500/10 transition-all flex items-center gap-3 mt-auto">
          🚪 Encerrar Sessão
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6 md:p-12">
          
          {/* ABA: GESTÃO DE USUÁRIOS */}
          {activeTab === 'users' && (
            <div className="space-y-8 animate-fadeIn">
              <header className="flex justify-between items-end">
                <div>
                  <h1 className="text-3xl font-black text-indigo-950 tracking-tight">Usuários do Sistema</h1>
                  <p className="text-gray-500">Gerencie quem pode acessar cada portal.</p>
                </div>
                <Button onClick={() => { setEditingUser({ role: UserRole.TEACHER }); setIsUserModalOpen(true); }}>
                  + Adicionar Usuário
                </Button>
              </header>

              <Card className="overflow-hidden border-none shadow-xl">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="p-5 text-[10px] font-black uppercase text-gray-400">Nome / Email</th>
                      <th className="p-5 text-[10px] font-black uppercase text-gray-400">Nível de Acesso</th>
                      <th className="p-5 text-[10px] font-black uppercase text-gray-400">Vínculo</th>
                      <th className="p-5 text-right text-[10px] font-black uppercase text-gray-400">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-indigo-50/30 transition-colors">
                        <td className="p-5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-bold">{u.name[0]}</div>
                            <div>
                              <p className="font-bold text-indigo-950">{u.name}</p>
                              <p className="text-xs text-gray-400">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-5">
                          <Badge color={u.role === UserRole.ADMIN ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600'}>
                            {u.role}
                          </Badge>
                        </td>
                        <td className="p-5">
                          {u.studentId ? (
                            <span className="text-xs font-bold text-gray-500">Aluno: {students.find(s => s.id === u.studentId)?.name || u.studentId}</span>
                          ) : (
                            <span className="text-xs text-gray-300">—</span>
                          )}
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

          {/* ABA: EDITAR SITE BASE */}
          {activeTab === 'site' && (
            <div className="space-y-8 animate-fadeIn">
              <header>
                <h1 className="text-3xl font-black text-indigo-950">Identidade do Site</h1>
                <p className="text-gray-500">Textos e imagens da página inicial.</p>
              </header>
              <Card className="p-8 space-y-6">
                <Input label="Nome da Creche" value={editContent.institutionName} onChange={e => setEditContent({...editContent, institutionName: e.target.value})} />
                <Input label="Chamada Principal (Hero)" value={editContent.heroTitle} onChange={e => setEditContent({...editContent, heroTitle: e.target.value})} />
                <Input label="Descrição Curta" multiline value={editContent.heroSubtitle} onChange={e => setEditContent({...editContent, heroSubtitle: e.target.value})} />
                <Button className="w-full" onClick={() => { onUpdateSite(editContent); alert("Site atualizado!"); }}>Publicar Alterações</Button>
              </Card>
            </div>
          )}

          {/* FINANCEIRO SIMULADO */}
          {activeTab === 'finance' && (
            <div className="space-y-8 animate-fadeIn">
              <h1 className="text-3xl font-black text-indigo-950">Saúde Financeira</h1>
              <div className="grid md:grid-cols-3 gap-6">
                <StatsCard title="Receita Prevista" value="1.250.000 AKZ" icon="📈" color="bg-emerald-50 text-emerald-600" />
                <StatsCard title="Inadimplência" value="15%" icon="⚠️" color="bg-rose-50 text-rose-600" />
                <StatsCard title="Salários" value="850.000 AKZ" icon="👥" color="bg-indigo-50 text-indigo-600" />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* MODAL USUÁRIO */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-indigo-950/60 backdrop-blur-sm" onClick={() => setIsUserModalOpen(false)}></div>
          <Card className="relative w-full max-w-lg p-8 space-y-6 animate-fadeIn shadow-2xl">
            <h2 className="text-2xl font-black text-indigo-950">{editingUser?.id ? 'Editar Usuário' : 'Novo Usuário'}</h2>
            
            <Input label="Nome Completo" value={editingUser?.name || ''} onChange={e => setEditingUser({...editingUser, name: e.target.value})} />
            <Input label="E-mail de Acesso" type="email" value={editingUser?.email || ''} onChange={e => setEditingUser({...editingUser, email: e.target.value})} />
            
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400">Tipo de Acesso</label>
              <select 
                className="w-full p-4 rounded-2xl border bg-gray-50 font-bold"
                value={editingUser?.role || ''}
                onChange={e => setEditingUser({...editingUser, role: e.target.value as UserRole})}
              >
                {Object.values(UserRole).filter(r => r !== UserRole.PUBLIC).map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            {editingUser?.role === UserRole.PARENT && (
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-400">Vincular ao Aluno</label>
                <select 
                  className="w-full p-4 rounded-2xl border bg-gray-50 font-bold"
                  value={editingUser?.studentId || ''}
                  onChange={e => setEditingUser({...editingUser, studentId: e.target.value})}
                >
                  <option value="">Selecione um aluno...</option>
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
    </div>
  );
};

export default AdminDashboard;
