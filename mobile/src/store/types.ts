export type ID = string;
export type Role = 'cliente' | 'instructor' | 'admin';

export type Coach = { id: ID; name: string; phone?: string };

export type Plan = { id: ID; name: string; price: number; classesPerMonth: number };

export type Skill = { label: string; value: number }; // 0–100

export type Student = {
  id: ID;
  name: string;
  age?: number;
  level: string;
  parentName: string;
  parentPhone?: string;
  parentEmail?: string;
  planId?: ID;
  points: number;
  skills: Skill[];
  badges: string[];
  medical?: string;
  emergencyContact?: string;
  authorizedPickup?: string;
  createdAt: string;
};

export type ClassItem = {
  id: ID;
  title: string;
  level: string;
  coachId: ID;
  pool: string;
  lane?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm (24h)
  capacity: number;
  special?: boolean;
};

export type Booking = { id: ID; studentId: ID; classId: ID; createdAt: string };

export type AttendanceRecord = { classId: ID; studentId: ID; present: boolean; markedAt: string };

export type PaymentMethod = 'efectivo' | 'transferencia' | 'tarjeta';
export type Payment = { id: ID; studentId: ID; amount: number; concept: string; date: string; method: PaymentMethod };

export type Notice = { id: ID; title: string; body: string; createdAt: string; read: boolean; kind: 'clase' | 'insignia' | 'pago' | 'horario' | 'general' };

export type Settings = {
  clubName: string;
  accent: string;
  /** Who the phone's current user is pretending to be (demo/local mode). */
  viewAs: Role;
  /** Which student the "cliente" view follows. */
  currentStudentId?: ID;
  levels: string[];
  pools: string[];
};

export type DB = {
  version: 1;
  coaches: Coach[];
  plans: Plan[];
  students: Student[];
  classes: ClassItem[];
  bookings: Booking[];
  attendance: AttendanceRecord[];
  payments: Payment[];
  notices: Notice[];
  settings: Settings;
};
