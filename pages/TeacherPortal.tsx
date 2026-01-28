
import React, { useState, useMemo } from 'react';
import { Card, Button, Input, Badge } from '../components/Shared';
import { User, Student, Class } from '../types';
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
  const [activeSubTab, setActiveSubTab] = useState<'classes' | 'attendance' | 'grades' | 'docs'>('attendance');

  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [documents, setDocuments] = useState<{id: number, name: string, date: string, type: string}[]>([
    { id: 1, name: 'Plano Pedagógico Semanal - Março.pdf', date: '01/03/2024', type: 'PDF' },
    { id: 2, name: 'Atividades Lúdicas de Motricidade.docx', date: '05/03/2024', type: 'DOC' }
  ]);

  const [selectedStudentForAI, setSelectedStudentForAI] = useState<Student | null>(null);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);

  const currentClassStudents = useMemo(() => 
    students.filter(s => s.classId === selectedClassId), 
  [students, selectedClassId]);

  const handleAttendanceToggle = (studentId: string) => {
    setAttendance(prev => ({ ...prev, [studentId]: !prev[studentId] }));
  };

  const handleUpdateGrade = (studentId: string, field: 'q1' | 'q2' | 'q3', value: string) => {
    const numValue = parseFloat(value) || 0;
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          grades: { ...s.grades, [field]: numValue }
        };
      }
      return s;
    }));
  };

  const handleAiConsult = async (student: Student) => {
    setSelectedStudentForAI(student);
    setLoadingAi(true);
    setAiInsight('');
    const insight = await generateEducationalInsights(student);
    setAiInsight(insight);
    setLoadingAi(false);
  };

  const handleAddDoc = () => {
    const name = prompt("Nome do documento:");
    if (name) {
      setDocuments(prev => [{ id: Date.now(), name, date: new Date().toLocaleDateString('pt-BR'), type: 'PDF' }, ...prev]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg shadow-rose-100">PB</div>
          <div>
            <h1 className="font-black text-indigo-950">Portal do Professor</h1>
            <p className="text-xs text-rose-500 font-bold uppercase tracking-widest">{user.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={selectedClassId} 
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="px-4 py-2 rounded-xl border-none bg-indigo-50 text-sm font-black text-indigo-900 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
          >
            {teacherClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <Button variant="outline" className="text-xs py-2" onClick={onLogout}>Sair</Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid lg:grid-cols-12 gap-6 w-full flex-grow">
        <div className="lg:col-span-8 space-y-6">
          <div className="flex gap-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
            {[
              { id: 'attendance', label: 'Chamada', icon: '📝' },
              { id: 'grades', label: 'Lançar Notas', icon: '📊' },
              { id: 'docs', label: 'Material Didático', icon: '📁' },
              { id: 'classes', label: 'Turmas', icon: '🏫' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex-1 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeSubTab === tab.id ? 'bg-rose-500 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>

          {/* ABA: CHAMADA */}
          {activeSubTab === 'attendance' && (
            <Card className="animate-fadeIn border-none shadow-xl">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="font-black text-indigo-950 uppercase tracking-widest text-sm">Frequência Diária</h2>
                <Badge color="bg-rose-50 text-rose-500">{new Date().toLocaleDateString('pt-BR')}</Badge>
              </div>
              <div className="divide-y divide-gray-50">
                {currentClassStudents.map(s => (
                  <div key={s.id} className="p-5 flex items-center justify-between hover:bg-indigo-50/20 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-bold">{s.name[0]}</div>
                      <div>
                        <p className="font-bold text-indigo-950">{s.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Resp: {s.parentName}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleAttendanceToggle(s.id)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${attendance[s.id] !== false ? 'bg-emerald-500 text-white shadow-lg' : 'bg-rose-100 text-rose-500'}`}
                      >
                        {attendance[s.id] !== false ? 'PRESENTE' : 'AUSENTE'}
                      </button>
                      <button 
                        onClick={() => handleAiConsult(s)} 
                        className="p-2 text-indigo-600 bg-white border border-indigo-100 rounded-xl hover:shadow-lg transition-all"
                      >
                        ✨
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* ABA: LANÇAMENTO DE NOTAS */}
          {activeSubTab === 'grades' && (
            <Card className="animate-fadeIn border-none shadow-xl overflow-hidden">
               <div className="p-6 border-b flex justify-between items-center">
                <h2 className="font-black text-indigo-950 uppercase tracking-widest text-sm">Boletim de Notas</h2>
                <Button variant="secondary" className="text-xs" onClick={() => alert("Notas salvas no sistema!")}>Salvar Tudo</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-5 text-[10px] font-black uppercase text-gray-400">Aluno</th>
                      <th className="p-5 text-[10px] font-black uppercase text-gray-400 text-center">Q1</th>
                      <th className="p-5 text-[10px] font-black uppercase text-gray-400 text-center">Q2</th>
                      <th className="p-5 text-[10px] font-black uppercase text-gray-400 text-center">Q3</th>
                      <th className="p-5 text-[10px] font-black uppercase text-gray-400 text-right">Média</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentClassStudents.map(s => {
                      const avg = ((s.grades.q1 + s.grades.q2 + s.grades.q3) / (s.grades.q3 ? 3 : 2)).toFixed(1);
                      return (
                        <tr key={s.id} className="hover:bg-indigo-50/10">
                          <td className="p-5 font-bold text-indigo-950">{s.name}</td>
                          <td className="p-5">
                            <input 
                              type="number" 
                              className="w-16 mx-auto p-2 bg-gray-50 rounded-lg text-center font-bold text-indigo-600 border-none focus:ring-2 focus:ring-rose-500"
                              value={s.grades.q1}
                              onChange={e => handleUpdateGrade(s.id, 'q1', e.target.value)}
                            />
                          </td>
                          <td className="p-5">
                            <input 
                              type="number" 
                              className="w-16 mx-auto p-2 bg-gray-50 rounded-lg text-center font-bold text-indigo-600 border-none focus:ring-2 focus:ring-rose-500"
                              value={s.grades.q2}
                              onChange={e => handleUpdateGrade(s.id, 'q2', e.target.value)}
                            />
                          </td>
                          <td className="p-5">
                            <input 
                              type="number" 
                              className="w-16 mx-auto p-2 bg-gray-50 rounded-lg text-center font-bold text-indigo-600 border-none focus:ring-2 focus:ring-rose-500"
                              value={s.grades.q3}
                              onChange={e => handleUpdateGrade(s.id, 'q3', e.target.value)}
                            />
                          </td>
                          <td className="p-5 text-right font-black text-rose-500">{avg}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* ABA: DOCUMENTOS */}
          {activeSubTab === 'docs' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex justify-between items-center">
                <h3 className="font-black text-indigo-950 uppercase tracking-widest text-sm">Biblioteca Pedagógica</h3>
                <Button variant="outline" onClick={handleAddDoc}>+ Adicionar Arquivo</Button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {documents.map(doc => (
                  <Card key={doc.id} className="p-5 flex items-center justify-between group hover:border-indigo-300 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl">📄</div>
                      <div>
                        <p className="font-bold text-indigo-950 text-sm">{doc.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold">{doc.date} • {doc.type}</p>
                      </div>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 p-2 text-indigo-600 transition-opacity">📥</button>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SIDEBAR IA */}
        <div className="lg:col-span-4">
          <Card className="p-8 bg-indigo-950 text-white border-none shadow-2xl relative overflow-hidden h-full min-h-[400px]">
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <h3 className="text-xl font-black mb-6 flex items-center gap-3 relative z-10">
              <span className="text-2xl animate-pulse">✨</span> Mentor IA
            </h3>
            
            {selectedStudentForAI ? (
              <div className="space-y-6 animate-fadeIn relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center font-black">{selectedStudentForAI.name[0]}</div>
                  <div>
                    <p className="font-black text-indigo-100">{selectedStudentForAI.name}</p>
                    <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Relatório Pedagógico</p>
                  </div>
                </div>
                
                <div className="p-5 bg-white/5 rounded-2xl text-xs leading-relaxed text-indigo-50 border border-white/10 backdrop-blur-md max-h-[400px] overflow-y-auto">
                  {loadingAi ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
                       <div className="w-12 h-12 border-4 border-indigo-400 border-t-white rounded-full animate-spin"></div>
                       <p className="animate-pulse text-indigo-300 font-black uppercase tracking-tighter">O Gemini está analisando o desempenho pedagógico...</p>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap font-medium">
                      {aiInsight}
                    </div>
                  )}
                </div>
                
                {!loadingAi && (
                  <Button 
                    variant="secondary" 
                    className="w-full py-4 text-xs font-black uppercase tracking-widest" 
                    onClick={() => { setSelectedStudentForAI(null); setAiInsight(''); }}
                  >
                    Nova Análise
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-20 px-6 space-y-6 relative z-10">
                <div className="text-6xl filter grayscale opacity-50">🤖</div>
                <p className="text-xs text-indigo-300 font-medium leading-relaxed uppercase tracking-widest">
                  Selecione um aluno na chamada para gerar um diagnóstico pedagógico inteligente.
                </p>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TeacherPortal;
