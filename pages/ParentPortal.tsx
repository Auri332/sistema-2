
import React, { useState } from 'react';
import { Card, Button, Badge, StatsCard, Input } from '../components/Shared';
import { User, Student } from '../types';
import { MOCK_STUDENTS } from '../constants';

interface ParentPortalProps {
  user: User;
  onLogout: () => void;
}

const ParentPortal: React.FC<ParentPortalProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'grades' | 'chat'>('grades');
  const student = MOCK_STUDENTS.find(s => s.id === user.studentId);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Prof. Ricardo', text: 'Olá! Como vai o desempenho da Alice em casa?', time: '09:30' }
  ]);

  if (!student) return <div className="p-20 text-center font-bold">Erro: Aluno não vinculado.</div>;

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-rose-50/20 font-sans">
      {/* NAVEGAÇÃO MOBILE */}
      <div className="lg:hidden bg-white border-b px-6 py-4 flex justify-between items-center z-50 sticky top-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center text-white font-black text-xs">AS</div>
          <span className="font-bold text-gray-800 text-sm">{student.name}</span>
        </div>
        <button onClick={onLogout} className="text-rose-500 text-xl">🚪</button>
      </div>

      {/* SIDEBAR DESKTOP */}
      <aside className="hidden lg:flex w-80 bg-white border-r p-8 flex-col gap-10 shadow-sm z-20">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-4 border-rose-100 shadow-2xl">
            <img src={user.avatar || 'https://i.pravatar.cc/150?u=parent'} className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="font-black text-indigo-950 text-xl">{user.name}</h2>
            <Badge color="bg-rose-100 text-rose-600 uppercase text-[10px]">Encarregado</Badge>
          </div>
        </div>

        <nav className="space-y-3">
          <button onClick={() => setActiveTab('grades')} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${activeTab === 'grades' ? 'bg-rose-500 text-white shadow-xl scale-105' : 'text-gray-400 hover:bg-rose-50'}`}>📖 Boletim</button>
          <button onClick={() => setActiveTab('chat')} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${activeTab === 'chat' ? 'bg-rose-500 text-white shadow-xl scale-105' : 'text-gray-400 hover:bg-rose-50'}`}>💬 Chat</button>
        </nav>

        <button onClick={onLogout} className="mt-auto p-4 font-black text-rose-400 hover:bg-rose-50 rounded-2xl text-sm transition-colors text-center">Encerrar Sessão</button>
      </aside>

      {/* MENU INFERIOR MOBILE */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[80%] bg-indigo-950 text-white rounded-full p-2 flex justify-around items-center shadow-2xl z-[100] border border-white/10">
        <button onClick={() => setActiveTab('grades')} className={`p-4 rounded-full transition-all ${activeTab === 'grades' ? 'bg-rose-500 scale-110 shadow-lg' : 'opacity-40'}`}>📖</button>
        <button onClick={() => setActiveTab('chat')} className={`p-4 rounded-full transition-all ${activeTab === 'chat' ? 'bg-rose-500 scale-110 shadow-lg' : 'opacity-40'}`}>💬</button>
      </div>

      {/* CONTEÚDO PRINCIPAL RESPONSIVO */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto pb-24 md:pb-12">
        <div className="max-w-4xl mx-auto animate-fadeIn">
          
          {activeTab === 'grades' && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                  <h1 className="text-3xl md:text-5xl font-black text-indigo-950 tracking-tight">Boletim Escolar</h1>
                  <p className="text-gray-500 text-sm md:text-base font-medium">Situação Acadêmica do Trimestre.</p>
                </div>
                <Button variant="outline" className="w-full md:w-auto">📥 Baixar Boletim</Button>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <StatsCard title="Média Q1" value={student.grades.q1} color="bg-white border-b-4 border-emerald-500" />
                <StatsCard title="Média Q2" value={student.grades.q2} color="bg-white border-b-4 border-indigo-500" />
                <StatsCard title="Média Q3" value="--" color="bg-white border-b-4 border-amber-500" />
                <StatsCard title="Faltas" value={student.grades.absences} color="bg-white border-b-4 border-rose-500" />
              </div>

              <Card className="overflow-hidden shadow-2xl border-none">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="p-4 md:p-8 text-[10px] font-black uppercase text-gray-400">Trimestre</th>
                        <th className="p-4 md:p-8 text-center text-[10px] font-black uppercase text-gray-400">Nota</th>
                        <th className="p-4 md:p-8 text-right text-[10px] font-black uppercase text-gray-400">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-bold">
                      {[
                        { id: '1', name: '1º Trimestre', grade: student.grades.q1, status: 'Concluído' },
                        { id: '2', name: '2º Trimestre', grade: student.grades.q2, status: 'Em curso' },
                        { id: '3', name: '3º Trimestre', grade: '--', status: 'Agendado' },
                        { id: '4', name: 'Exame Final', grade: '--', status: 'Bloqueado' }
                      ].map(row => (
                        <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4 md:p-8 font-black text-indigo-950 text-sm md:text-lg">{row.name}</td>
                          <td className="p-4 md:p-8 text-center text-gray-700">{row.grade}</td>
                          <td className="p-4 md:p-8 text-right">
                            <Badge color={row.status === 'Concluído' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}>{row.status}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="space-y-6 md:space-y-8">
              <h1 className="text-3xl md:text-5xl font-black text-indigo-950 tracking-tight">Erasmus Chat</h1>
              
              <Card className="h-[70vh] md:h-[650px] flex flex-col border-none shadow-2xl overflow-hidden bg-white/70 backdrop-blur-md">
                <div className="p-4 md:p-6 border-b flex items-center justify-between bg-white/80">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-rose-200">R</div>
                    <div>
                      <p className="font-black text-indigo-950 text-sm md:text-base">Coordenação Erasmus</p>
                      <p className="text-[10px] text-emerald-500 font-black uppercase animate-pulse">Online</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-4 md:p-8 overflow-y-auto space-y-4 md:space-y-6 flex flex-col">
                  {messages.map(msg => (
                    <div key={msg.id} className={`max-w-[85%] p-4 rounded-[1.5rem] shadow-sm text-sm ${msg.sender === 'Você' ? 'bg-rose-500 text-white self-end rounded-tr-none' : 'bg-white text-gray-800 self-start rounded-tl-none'}`}>
                      <p className="font-medium">{msg.text}</p>
                      <p className={`text-[9px] font-bold mt-1 opacity-50`}>{msg.time}</p>
                    </div>
                  ))}
                </div>

                <div className="p-4 md:p-6 bg-white border-t flex gap-2 md:gap-4 items-center">
                  <Input placeholder="Escreva..." value={chatInput} onChange={e => setChatInput(e.target.value)} />
                  <Button className="h-12 w-12 md:h-14 md:w-14 rounded-2xl flex items-center justify-center" onClick={() => {
                    if(!chatInput) return;
                    setMessages([...messages, { id: Date.now(), sender: 'Você', text: chatInput, time: 'Agora' }]);
                    setChatInput('');
                  }}>🚀</Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ParentPortal;
