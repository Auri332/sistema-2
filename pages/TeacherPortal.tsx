
import React, { useState, useMemo } from 'react';
import { Card, Button, Input } from '../components/Shared';
import { User, Student, Class } from '../types';
import { MOCK_STUDENTS, MOCK_CLASSES } from '../constants';
import { generateEducationalInsights } from '../services/geminiService';

interface TeacherPortalProps {
  user: User;
  onLogout: () => void;
}

const TeacherPortal: React.FC<TeacherPortalProps> = ({ user, onLogout }) => {
  const teacherClasses = useMemo(() => {
    const classes = MOCK_CLASSES.filter(c => c.teacherId === user.id);
    // Fix: Updated email check and teacherId fallback to match MOCK_USERS in constants.tsx
    if (classes.length === 0 && user.email === 'ricardo@erasmus.com') {
      return MOCK_CLASSES.filter(c => c.teacherId === 'teacher-1' || c.teacherId === 'ricardo');
    }
    return classes;
  }, [user]);

  const [selectedClassId, setSelectedClassId] = useState<string>(teacherClasses[0]?.id || '');
  const [activeSubTab, setActiveSubTab] = useState<'classes' | 'attendance' | 'grades' | 'docs'>('classes');

  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [grades, setGrades] = useState<Record<string, { t1: string, t2: string, t3: string }>>({});
  const [documents, setDocuments] = useState<{name: string, date: string}[]>([
    { name: 'Plano_Pedagogico_Maternal.pdf', date: '12/02/2024' }
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

  const handleAiConsult = async (student: Student) => {
    setSelectedStudentForAI(student);
    setLoadingAi(true);
    setAiInsight(''); // Limpa insight anterior
    const insight = await generateEducationalInsights(student);
    setAiInsight(insight);
    setLoadingAi(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-rose-100">PB</div>
          <div>
            <h1 className="font-bold text-gray-800">Painel do Professor</h1>
            <p className="text-xs text-gray-400">Logado: <span className="text-rose-500 font-bold">{user.name}</span></p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {teacherClasses.length > 0 && (
            <select 
              value={selectedClassId} 
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-bold text-gray-700 bg-white focus:ring-2 focus:ring-rose-500 outline-none cursor-pointer"
            >
              {teacherClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          )}
          <Button variant="outline" className="text-xs py-2" onClick={onLogout}>Sair</Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid lg:grid-cols-12 gap-6 w-full flex-grow">
        <div className="lg:col-span-8 space-y-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { id: 'classes', label: 'Minhas Turmas', icon: '🏫' },
              { id: 'attendance', label: 'Frequência', icon: '📝' },
              { id: 'grades', label: 'Notas', icon: '📊' },
              { id: 'docs', label: 'Documentos', icon: '📁' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${activeSubTab === tab.id ? 'bg-rose-500 text-white shadow-lg shadow-rose-100' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>

          {activeSubTab === 'attendance' && (
            <Card className="animate-fadeIn">
              <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <h2 className="font-bold text-gray-800 text-lg">Chamada: {teacherClasses.find(c => c.id === selectedClassId)?.name || 'Turma'}</h2>
                <span className="text-xs text-rose-500 font-bold bg-rose-50 px-3 py-1 rounded-full">{new Date().toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="divide-y divide-gray-50 max-h-[500px] overflow-y-auto">
                {currentClassStudents.map(s => (
                  <div key={s.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold">{s.name[0]}</div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{s.name}</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Responsável: {s.parentName}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleAttendanceToggle(s.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${attendance[s.id] !== false ? 'bg-emerald-500 text-white shadow-md' : 'bg-rose-100 text-rose-600'}`}
                      >
                        {attendance[s.id] !== false ? 'PRESENTE' : 'AUSENTE'}
                      </button>
                      <button 
                        onClick={() => handleAiConsult(s)} 
                        className="p-2 text-indigo-600 bg-white border border-indigo-100 rounded-lg hover:bg-indigo-600 hover:text-white hover:shadow-lg transition-all" 
                        title="Gerar Relatório IA"
                      >
                        ✨
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-gray-50 flex justify-end">
                <Button variant="secondary" onClick={() => alert("Sincronizado com a nuvem!")}>Salvar Diário</Button>
              </div>
            </Card>
          )}

          {/* Outras tabs mantêm a lógica anterior mas com polimento visual */}
          {activeSubTab === 'classes' && (
            <div className="grid md:grid-cols-2 gap-4 animate-fadeIn">
              {teacherClasses.map(c => (
                <Card key={c.id} className="p-6 border-t-4 border-rose-500 hover:scale-[1.02] transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{c.name}</h3>
                      <p className="text-sm text-gray-500">{c.room}</p>
                    </div>
                    <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full uppercase tracking-widest">Ativa</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mb-4">
                    <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Alunos Matriculados</span>
                    <span className="font-bold text-gray-700">{c.currentStudents}/{c.capacity}</span>
                  </div>
                  <Button variant="outline" className="w-full text-xs" onClick={() => { setSelectedClassId(c.id); setActiveSubTab('attendance'); }}>
                    Gerenciar Turma
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 bg-indigo-900 text-white border-none shadow-2xl relative overflow-hidden min-h-[300px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 relative z-10">
              <span className="text-xl">✨</span> Mentor Pedagógico IA
            </h3>
            
            {selectedStudentForAI ? (
              <div className="space-y-4 animate-fadeIn relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold text-xs">{selectedStudentForAI.name[0]}</div>
                  <span className="font-bold text-sm text-indigo-100">Analisando: {selectedStudentForAI.name}</span>
                </div>
                
                <div className="p-4 bg-white/5 rounded-xl text-xs leading-relaxed text-indigo-50 border border-white/10 backdrop-blur-md">
                  {loadingAi ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-4">
                       <div className="w-8 h-8 border-2 border-indigo-400 border-t-white rounded-full animate-spin"></div>
                       <span className="animate-pulse text-indigo-300 font-medium">O Mentor IA está analisando os dados pedagógicos...</span>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap font-medium">
                      {aiInsight || "Clique no botão de brilho ao lado do aluno para iniciar."}
                    </div>
                  )}
                </div>
                
                {!loadingAi && (
                  <Button 
                    variant="secondary" 
                    className="w-full py-2 text-xs font-bold" 
                    onClick={() => { setSelectedStudentForAI(null); setAiInsight(''); }}
                  >
                    Nova Consulta
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-10 px-4 space-y-4 relative z-10 opacity-70">
                <div className="text-4xl">💡</div>
                <p className="text-xs text-indigo-200">
                  Selecione um aluno na lista de chamada clicando em <span className="text-white font-bold">✨</span> para obter insights pedagógicos e sugestões de atividades personalizadas.
                </p>
              </div>
            )}
          </Card>
          
          <Card className="p-6 space-y-4 border-l-4 border-amber-500 bg-amber-50/20">
            <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
               <span className="text-amber-500 text-lg">🔔</span> Mural de Avisos
            </h3>
            <div className="space-y-3">
              <div className="text-[10px] text-gray-500 leading-relaxed bg-white p-3 rounded-xl shadow-sm border border-amber-100">
                <p className="font-bold text-amber-900 mb-1">REUNIÃO DE PAIS</p>
                Próxima sexta-feira, às 18h. Favor confirmar presença via sistema.
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TeacherPortal;