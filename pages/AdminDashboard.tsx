
import React, { useState } from 'react';
import { Card, Button, Input, Badge, StatsCard } from '../components/Shared';
import { User, SiteContent, SitePage, FinancialRecord } from '../types';
import { MOCK_USERS, MOCK_FINANCE } from '../constants';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
  siteContent: SiteContent;
  onUpdateSite: (content: SiteContent) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout, siteContent, onUpdateSite }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'finance' | 'site' | 'pages'>('site');
  const [editContent, setEditContent] = useState(siteContent);
  const [editingPage, setEditingPage] = useState<SitePage | null>(null);

  const handleSaveSite = () => {
    onUpdateSite(editContent);
    alert("Alterações salvas com sucesso! O site público foi atualizado.");
  };

  const handleSavePage = () => {
    if (!editingPage) return;
    
    let newPages;
    if (editingPage.id) {
      newPages = editContent.pages.map(p => p.id === editingPage.id ? editingPage : p);
    } else {
      const newId = `page-${Date.now()}`;
      newPages = [...editContent.pages, { ...editingPage, id: newId }];
    }
    
    const updated = { ...editContent, pages: newPages };
    setEditContent(updated);
    onUpdateSite(updated);
    setEditingPage(null);
  };

  const handleDeletePage = (id: string) => {
    if (confirm("Deseja realmente excluir esta página?")) {
      const updated = { ...editContent, pages: editContent.pages.filter(p => p.id !== id) };
      setEditContent(updated);
      onUpdateSite(updated);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-indigo-950 text-white p-6 hidden lg:flex flex-col shadow-2xl">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black">PB</div>
          <span className="font-black text-xl tracking-tight">ADMIN</span>
        </div>
        
        <nav className="space-y-2 flex-1">
          {[
            { id: 'site', label: 'Editar Site', icon: '🌐' },
            { id: 'pages', label: 'Mais Páginas', icon: '📄' },
            { id: 'users', label: 'Usuários', icon: '👥' },
            { id: 'finance', label: 'Finanças', icon: '💰' }
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
          🚪 Sair
        </button>
      </aside>

      {/* CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-6 md:p-12">
        <div className="max-w-4xl mx-auto">
          
          {/* ABA: EDITAR SITE BASE */}
          {activeTab === 'site' && (
            <div className="space-y-8 animate-fadeIn">
              <header>
                <h1 className="text-3xl font-black text-indigo-950">Identidade Visual</h1>
                <p className="text-gray-500">Altere os textos principais do seu site.</p>
              </header>
              
              <Card className="p-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Input label="Nome da Instituição" value={editContent.institutionName} onChange={e => setEditContent({...editContent, institutionName: e.target.value})} />
                  <Input label="Sigla (Logo)" value={editContent.logo} onChange={e => setEditContent({...editContent, logo: e.target.value})} />
                </div>
                <Input label="Título de Boas-vindas (Hero)" value={editContent.heroTitle} onChange={e => setEditContent({...editContent, heroTitle: e.target.value})} />
                <Input label="Subtítulo Descritivo" multiline value={editContent.heroSubtitle} onChange={e => setEditContent({...editContent, heroSubtitle: e.target.value})} />
                <Input label="Texto 'Sobre Nós'" multiline value={editContent.aboutText} onChange={e => setEditContent({...editContent, aboutText: e.target.value})} />
                
                <div className="pt-4">
                  <Button className="w-full py-4 text-lg" onClick={handleSaveSite}>Publicar no Site</Button>
                </div>
              </Card>
            </div>
          )}

          {/* ABA: PÁGINAS ADICIONAIS */}
          {activeTab === 'pages' && (
            <div className="space-y-8 animate-fadeIn">
              <header className="flex justify-between items-end">
                <div>
                  <h1 className="text-3xl font-black text-indigo-950">Páginas Personalizadas</h1>
                  <p className="text-gray-500">Crie páginas como "Preçário", "Eventos" ou "Regulamento".</p>
                </div>
                <Button onClick={() => setEditingPage({ id: '', title: '', slug: '', content: '', active: true })}>
                  + Nova Página
                </Button>
              </header>

              <div className="grid gap-4">
                {editContent.pages.map(page => (
                  <Card key={page.id} className="p-5 flex justify-between items-center group hover:border-indigo-300 transition-all">
                    <div>
                      <h3 className="font-black text-indigo-900">{page.title}</h3>
                      <p className="text-xs text-gray-400 font-mono">Endereço: /{page.slug}</p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <Button variant="ghost" className="p-2" onClick={() => setEditingPage(page)}>✏️</Button>
                      <Button variant="danger" className="p-2" onClick={() => handleDeletePage(page.id)}>🗑️</Button>
                    </div>
                  </Card>
                ))}
                {editContent.pages.length === 0 && (
                  <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100 text-gray-400">
                    Nenhuma página extra foi criada ainda.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* OUTRAS ABAS (USUÁRIOS E FINANÇAS) */}
          {activeTab === 'users' && (
            <div className="space-y-6 animate-fadeIn">
              <h1 className="text-3xl font-black text-indigo-950">Equipe e Acessos</h1>
              <Card className="overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-indigo-50/50">
                    <tr className="border-b border-gray-100">
                      <th className="p-4 text-[10px] font-black uppercase text-gray-400">Membro</th>
                      <th className="p-4 text-[10px] font-black uppercase text-gray-400">Cargo</th>
                      <th className="p-4 text-[10px] font-black uppercase text-gray-400">Contacto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_USERS.map(u => (
                      <tr key={u.id} className="border-b border-gray-50 last:border-none hover:bg-gray-50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-xs">{u.name[0]}</div>
                            <span className="font-bold text-indigo-900">{u.name}</span>
                          </div>
                        </td>
                        <td className="p-4"><Badge>{u.role}</Badge></td>
                        <td className="p-4 text-xs text-gray-500">{u.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {activeTab === 'finance' && (
            <div className="space-y-6 animate-fadeIn">
              <h1 className="text-3xl font-black text-indigo-950">Saúde Financeira</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard title="Receita Prevista" value="1.500.000 AKZ" icon="📈" color="bg-emerald-50 text-emerald-600" />
                <StatsCard title="Saídas Mensais" value="900.000 AKZ" icon="📉" color="bg-rose-50 text-rose-600" />
                <StatsCard title="Caixa Atual" value="600.000 AKZ" icon="💰" color="bg-indigo-50 text-indigo-600" />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* MODAL EDITOR DE PÁGINA */}
      {editingPage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-indigo-950/80 backdrop-blur-sm" onClick={() => setEditingPage(null)}></div>
          <Card className="relative w-full max-w-2xl p-8 space-y-6 shadow-2xl animate-fadeIn">
            <h2 className="text-2xl font-black text-indigo-950">Criar/Editar Página</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <Input label="Título da Página" placeholder="Ex: Matrículas 2024" value={editingPage.title} onChange={e => setEditingPage({...editingPage, title: e.target.value})} />
              <Input label="Slug (Endereço URL)" placeholder="ex: matriculas" value={editingPage.slug} onChange={e => setEditingPage({...editingPage, slug: e.target.value})} />
            </div>
            
            <Input label="Conteúdo Rico" multiline placeholder="Escreva o texto da página aqui..." value={editingPage.content} onChange={e => setEditingPage({...editingPage, content: e.target.value})} />
            
            <div className="flex gap-4 pt-4">
              <Button variant="ghost" className="flex-1" onClick={() => setEditingPage(null)}>Cancelar</Button>
              <Button className="flex-1" onClick={handleSavePage}>Gravar Conteúdo</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
