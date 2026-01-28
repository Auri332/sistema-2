
import { UserRole, Student, User, SiteContent, FinancialRecord, Class, InventoryItem } from './types';

export const INITIAL_SITE_CONTENT: SiteContent = {
  institutionName: "Complexo Erasmus",
  logo: "ERASMUS",
  heroTitle: "Educação que Constrói o Futuro",
  heroSubtitle: "Onde cada criança descobre o seu potencial máximo através do afeto e da tecnologia.",
  aboutText: "O Complexo Erasmus é referência em Luanda, oferecendo um currículo inovador focado no bilinguismo e competências do século XXI.",
  slides: [
    { id: '1', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1200', title: 'Espaço Criativo', subtitle: 'Ambientes desenhados para a imaginação.' },
    { id: '2', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200', title: 'Esporte e Lazer', subtitle: 'Desenvolvimento físico e social integral.' }
  ],
  pages: [
    { id: 'p1', title: 'Processo de Matrícula', slug: 'matricula', content: 'O processo de matrícula para o ano letivo 2024/25 está aberto. Documentos necessários: Cópia do boletim de nascimento, 2 fotos tipo passe, e atestado de vacina atualizado.', active: true },
    { id: 'p2', title: 'Políticas de Privacidade', slug: 'privacidade', content: 'Garantimos a segurança total dos dados dos nossos alunos e encarregados de educação.', active: true }
  ],
  gallery: [
    'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=600'
  ],
  teachers: [
    { id: 't1', name: 'Dra. Ana Paula', role: 'Diretora Pedagógica', photo: 'https://i.pravatar.cc/150?u=ana' },
    { id: 't2', name: 'Mestre Carlos', role: 'Inovação Tech', photo: 'https://i.pravatar.cc/150?u=carlos' },
    { id: 't3', name: 'Profª Julia', role: 'Artes e Cultura', photo: 'https://i.pravatar.cc/150?u=julia' }
  ],
  contact: {
    address: "Rua Comandante Gika, Luanda, Angola",
    phone: "+244 923 000 000",
    email: "secretaria@erasmus.ao",
  },
  footer: {
    text: "© 2024 Complexo Erasmus - Excelência em Educação Infantil.",
    socials: { facebook: '#', instagram: '#', linkedin: '#' }
  }
};

export const MOCK_FINANCE: FinancialRecord[] = [
  { id: 'f1', type: 'income', category: 'Propinas', description: 'Mensalidade Março - Alice S.', amount: 150000, date: '2024-03-01' },
  { id: 'f2', type: 'expense', category: 'Salários', description: 'Folha de Pagamento - Docentes', amount: 850000, date: '2024-03-05' },
  { id: 'f3', type: 'expense', category: 'Stock', description: 'Material de Limpeza e Papelaria', amount: 45000, date: '2024-03-10' }
];

export const MOCK_USERS: User[] = [
  { id: 'admin-1', name: 'Administrador Geral', email: 'admin@erasmus.com', role: UserRole.ADMIN, phone: '923111000' },
  { id: 'teacher-1', name: 'Prof. Ricardo', email: 'ricardo@erasmus.com', role: UserRole.TEACHER, phone: '923222000' },
  { id: 'parent-1', name: 'Sr. Silva', email: 'pai@email.com', role: UserRole.PARENT, studentId: 's1', phone: '923333000' }
];

export const MOCK_STUDENTS: Student[] = [
  { 
    id: 's1', 
    name: 'Alice Santos', 
    age: 6, 
    classId: 'c1', 
    parentName: 'Sr. Silva', 
    status: 'active', 
    grades: { q1: 18, q2: 15, q3: 0, exam: 0, absences: 1 },
    attendance: 98,
    performance: 92
  }
];

export const MOCK_CLASSES: Class[] = [
  { id: 'c1', name: 'Pré-Escolar A', teacherId: 'teacher-1', room: 'Sala 05', capacity: 20, currentStudents: 15 }
];

export const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'i1', name: 'Resmas de Papel A4', quantity: 45, category: 'Escritório' }
];
