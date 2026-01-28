
export enum UserRole {
  ADMIN = 'ADMIN',
  DIRECTOR = 'DIRECTOR',
  TEACHER = 'TEACHER',
  STAFF = 'STAFF', // Atuará como Secretaria/Administrativo
  PARENT = 'PARENT',
  PUBLIC = 'PUBLIC'
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  phone?: string;
  address?: string;
  avatar?: string;
  studentId?: string;
  position?: string;
}

export interface SitePage {
  id: string;
  title: string;
  slug: string;
  content: string;
  active: boolean;
}

export interface SiteContent {
  institutionName: string;
  logo: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  // Added slides, gallery, teachers, and footer to match INITIAL_SITE_CONTENT
  slides: { id: string; image: string; title: string; subtitle: string; }[];
  pages: SitePage[];
  gallery: string[];
  teachers: { id: string; name: string; role: string; photo: string; }[];
  contact: {
    address: string;
    phone: string;
    email: string;
  };
  footer: {
    text: string;
    socials: { facebook: string; instagram: string; linkedin: string; };
  };
}

export interface FinancialRecord {
  id: string;
  type: 'income' | 'expense';
  category: 'Propina' | 'Salário' | 'Material' | 'Manutenção' | 'Outros';
  description: string;
  amount: number;
  date: string;
  studentId?: string; // Para vincular propinas a alunos
}

export interface GradeRecord {
  q1: number;
  q2: number;
  q3: number;
  // Added exam as an optional property
  exam?: number;
  absences: number;
}

export interface Student {
  id: string;
  name: string;
  age: number;
  classId: string;
  parentName: string;
  status: 'active' | 'inactive';
  grades: GradeRecord;
  balance: number; // Saldo devedor ou crédito
  // Added attendance and performance to match MOCK_STUDENTS
  attendance?: number;
  performance?: number;
}

export interface Class {
  id: string;
  name: string;
  teacherId: string;
  room: string;
  capacity: number;
  // Added currentStudents to match MOCK_CLASSES
  currentStudents?: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  minQuantity: number;
  category: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  classId?: string;
}
