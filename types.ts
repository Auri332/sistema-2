
export enum UserRole {
  ADMIN = 'ADMIN',
  DIRECTOR = 'DIRECTOR',
  TEACHER = 'TEACHER',
  STAFF = 'STAFF',
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

export interface SiteSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
}

export interface SiteTeacher {
  id: string;
  name: string;
  role: string;
  photo: string;
}

export interface SiteContent {
  institutionName: string;
  logo: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  slides: SiteSlide[];
  gallery: string[];
  teachers: SiteTeacher[];
  pages: SitePage[]; // Nova funcionalidade: Páginas adicionais
  contact: {
    address: string;
    phone: string;
    email: string;
    mapUrl?: string;
  };
  footer: {
    text: string;
    socials: { facebook?: string; instagram?: string; linkedin?: string };
  };
}

export interface FinancialRecord {
  id: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  date: string;
}

export interface GradeRecord {
  q1: number;
  q2: number;
  q3: number;
  exam: number;
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
  attendance?: number;
  performance?: number;
}

export interface Class {
  id: string;
  name: string;
  teacherId: string;
  room: string;
  capacity: number;
  currentStudents: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
}
