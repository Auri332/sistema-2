
import React, { useState } from 'react';
import { Card, Button, Badge, StatsCard, Input } from '../components/Shared';
import { User, Student } from '../types';

interface ParentPortalProps {
  user: User;
  onLogout: () => void;
  students: Student[];
}

const ParentPortal: React.FC<ParentPortalProps> = ({ user, onLogout, students }) => {
  const [activeTab, setActiveTab] = useState<'grades' | 'chat'>('grades');
  const student = students.find(s => s.id === user.studentId);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Prof. Ricardo', text: 'Olá! A Alice teve um ótimo desempenho na atividade de hoje.', time: '09:30' }
  ]);

  if (!student) return (
    <div className="min-h-screen flex items-center justify-center bg-rose-50">
      <Card className="p-10 text-center space-y-4">
        <h2 className="text-2xl font-black text-rose-500">Acesso Restrito</h2>
        <p className="text-gray-500">Este perfil de Encarregado ainda não possui um aluno vinculado.</p>
        <Button onClick={onLogout}>Sair</Button>
      </Card>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-rose-50/20 font-sans overflow-hidden">
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden lg:flex w-80 bg-white border-r p-8 flex-col gap-10 shadow-sm z-20">
        <div className="flex flex-col items-center text-center gap-6">
          <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-4 border-rose-100 shadow-2xl bg-indigo-100 flex items-center justify-center text-3xl font-black text-indigo-600">
            {student.name[0]}
          </div>
          <div>
            <h2 className="font-black text-indigo-950 text-xl tracking-tighter">{student.name}</h2>
            <Badge color="bg-rose-100 text-rose-600 uppercase text-[10px] tracking-widest mt-2">Aluno(a) Ativo</Badge>
          </div>
        </div>

        <nav className="space-y-3">
          <button onClick={() => setActiveTab('grades')} className={`w-full flex items-center gap-4 p-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'grades' ? 'bg-rose-500 text-white shadow-xl scale-105' : 'text-gray-400 hover:bg-rose-50'}`}>📖 Boletim</button>
          <button onClick={() => setActiveTab('chat')} className={`w-full flex items-center gap-4 p-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'chat' ? 'bg-rose-500 text-white shadow-xl scale-105' : 'text-gray-400 hover:bg-rose-50'}`}>💬 Secretaria</button>
        </nav>

        <button onClick={onLogout} className="mt-auto p-5 font-black text-rose-400 hover:bg-rose-50 rounded-2xl text-[10px] uppercase tracking-widest transition-colors text-center">Encerrar Sessão</button>
      </aside>

      {/* CONTEÚDO */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto animate-fadeIn">
          
          {activeTab === 'grades' && (
            <div className="space-y-8">
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-4xl font-black text-indigo-950 tracking-tighter">Acompanhamento</h1>
                  <p className="text-gray-500 font-bold text-sm uppercase tracking-widest mt-1">Notas do Ano Letivo 2024</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <StatsCard title="1º Trim" value={student.grades.q1} color="bg-white border-b-4 border-emerald-500" />
                <StatsCard title="2º Trim" value={student.grades.q2} color="bg-white border-b-4 border-indigo-500" />
                <StatsCard title="3º Trim" value={student.grades.q3 || '—'} color="bg-white border-b-4 border-amber-500" />
                <StatsCard title="Faltas" value={student.grades.absences} color="bg-white border-b-4 border-rose-500" />
              </div>

              <Card className="overflow-hidden shadow-2xl border-none bg-white">
                <table className="w-full text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Disciplina</th>
                      <th className="p-6 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">Média Parcial</th>
                      <th className="p-6 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="p-6 font-black text-indigo-950">Desenvolvimento Global</td>
                      <td className="p-6 text-center font-bold text-gray-600">{((student.grades.q1 + student.grades.q2)/2).toFixed(1)}</td>
                      <td className="p-6 text-right">
                        <Badge color="bg-emerald-100 text-emerald-600">Aprovado</Badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="space-y-8 h-full">
              <h1 className="text-4xl font-black text-indigo-950 tracking-tighter">Mensagens</h1>
              <Card className="h-[600px] flex flex-col border-none shadow-2xl bg-white">
                <div className="p-6 border-b flex items-center gap-4">
                  <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white font-black">PB</div>
                  <p className="font-black text-indigo-950">Atendimento Escolar</p>
                </div>
                <div className="flex-1 p-8 overflow-y-auto space-y-4 flex flex-col">
                  {messages.map(msg => (
                    <div key={msg.id} className={`max-w-[80%] p-4 rounded-2xl text-sm ${msg.sender === 'Você' ? 'bg-rose-500 text-white self-end' : 'bg-gray-100 text-gray-800 self-start'}`}>
                      {msg.text}
                    </div>
                  ))}
                </div>
                <div className="p-6 border-t flex gap-4">
                  <Input placeholder="Dúvida ou aviso..." value={chatInput} onChange={e => setChatInput(e.target.value)} />
                  <Button onClick={() => {
                    if(!chatInput) return;
                    setMessages([...messages, { id: Date.now(), sender: 'Você', text: chatInput, time: 'Agora' }]);
                    setChatInput('');
                  }}>Enviar</Button>
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
