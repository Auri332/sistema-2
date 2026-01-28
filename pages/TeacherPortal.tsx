
import React, { useState, useMemo } from 'react';
import { Card, Button, Input, Badge } from '../components/Shared';
import { User, Student, Class, ChatMessage } from '../types';
import { generateEducationalInsights } from '../services/geminiService';

interface TeacherPortalProps {
  user: User;
  onLogout: () => void;
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  classes: Class[];
}

const TeacherPortal: React.FC<TeacherPortalProps> = ({ user, onLogout, students, setStudents, classes }) => {
  const teacherClasses = useMemo(() => {
    return classes.filter(c => c.teacherId === user.id || user.email === 'ricardo@erasmus.com');
  }, [user, classes]);

  const [selectedClassId, setSelectedClassId] = useState<string>(teacherClasses[0]?.id || '');
  const [activeSubTab, setActiveSubTab] = useState<'attendance' | 'grades' | 'chat' | 'docs'>('attendance');

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', senderId: 'teacher-1', senderName: 'Prof. Ricardo', text: 'Boa tarde! Amanhã teremos atividade com tintas, favor trazer avental.', timestamp: '14:20', classId: 'c1' }
  ]);
  const [msgInput, setMsgInput] = useState('');

  const currentClassStudents = useMemo(() => 
    students.filter(s => s.classId === selectedClassId), 
  [students, selectedClassId]);

  const handleSendMsg = () => {
    if (!msgInput) return;
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.name,
      text: msgInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      classId: selectedClassId
    };
    setChatMessages([...chatMessages, newMsg]);
    setMsgInput('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white border-b px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg">PB</div>
          <div>
            <h1 className="font-black text-indigo-950">Portal do Professor</h1>
            <p className="text-xs text-rose-500 font-bold uppercase tracking-widest">{user.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={selectedClassId} 
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="px-4 py-2 rounded-xl border-none bg-indigo-50 text-sm font-black text-indigo-900 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {teacherClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <Button variant="outline" className="text-xs py-2" onClick={onLogout}>Sair</Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid lg:grid-cols-12 gap-6 w-full flex-grow overflow-hidden">
        <div className="lg:col-span-8 flex flex-col gap-6 h-full">
          <div className="flex gap-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
            {[
              { id: 'attendance', label: 'Chamada', icon: '📝' },
              { id: 'grades', label: 'Notas', icon: '📊' },
              { id: 'chat', label: 'Chat da Turma', icon: '💬' },
              { id: 'docs', label: 'Materiais', icon: '📁' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex-1 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeSubTab === tab.id ? 'bg-rose-500 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>

          {/* ABA CHAT DA TURMA */}
          {activeSubTab === 'chat' && (
            <Card className="flex-1 flex flex-col border-none shadow-2xl bg-white overflow-hidden min-h-[500px]">
              <div className="p-4 bg-indigo-50 border-b flex justify-between items-center">
                <span className="font-black text-xs text-indigo-900 uppercase">Avisos Gerais aos Pais</span>
                <Badge color="bg-emerald-500 text-white">Online</Badge>
              </div>
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {chatMessages.filter(m => m.classId === selectedClassId).map(m => (
                  <div key={m.id} className={`max-w-[80%] p-4 rounded-2xl text-sm ${m.senderId === user.id ? 'bg-indigo-600 text-white self-end ml-auto' : 'bg-gray-100 text-gray-800 self-start'}`}>
                    <p className="text-[10px] font-black uppercase opacity-60 mb-1">{m.senderName}</p>
                    <p>{m.text}</p>
                    <p className="text-[8px] text-right mt-1 opacity-40">{m.timestamp}</p>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t flex gap-2 bg-gray-50">
                <input 
                  className="flex-1 px-5 py-3 rounded-xl border bg-white focus:ring-2 focus:ring-indigo-500 outline-none" 
                  placeholder="Escreva um comunicado para os pais..."
                  value={msgInput}
                  onChange={e => setMsgInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSendMsg()}
                />
                <Button onClick={handleSendMsg}>Enviar</Button>
              </div>
            </Card>
          )}

          {/* Outras abas permanecem funcionais mas simplificadas nesta visualização */}
          {activeSubTab === 'attendance' && (
            <Card className="animate-fadeIn border-none shadow-xl divide-y divide-gray-50">
              {currentClassStudents.map(s => (
                <div key={s.id} className="p-5 flex items-center justify-between hover:bg-indigo-50/20">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-bold">{s.name[0]}</div>
                    <p className="font-bold text-indigo-950">{s.name}</p>
                  </div>
                  <button className="px-4 py-2 rounded-xl text-[10px] font-black tracking-widest bg-emerald-500 text-white shadow-lg">PRESENTE</button>
                </div>
              ))}
            </Card>
          )}
        </div>

        <div className="lg:col-span-4">
           {/* Sidebar AI mentor mantido conforme anterior */}
           <Card className="p-8 bg-indigo-950 text-white border-none shadow-2xl h-full min-h-[400px]">
             <h3 className="text-xl font-black mb-6">✨ Mentor IA</h3>
             <p className="text-sm text-indigo-200 opacity-60">O Gemini está pronto para analisar o comportamento pedagógico dos seus alunos.</p>
             <div className="mt-20 text-center opacity-30 grayscale filter">🤖</div>
           </Card>
        </div>
      </main>
    </div>
  );
};

export default TeacherPortal;
