import type { Booking, ClassItem, DB, ID, Payment, Student } from './types';

// ---------- formatting ----------

export const money = (n: number) => `$${n.toLocaleString('es-EC', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const DAYS_SHORT = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

export function parseISO(date: string): Date {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** "Martes 16" */
export function dayLabel(date: string): string {
  const d = parseISO(date);
  return `${DAYS[d.getDay()]} ${d.getDate()}`;
}
export function dayShort(date: string): string {
  return DAYS_SHORT[parseISO(date).getDay()];
}
/** "16 jun 2026" */
export function dateShort(date: string): string {
  const d = parseISO(date);
  return `${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`;
}
/** "Junio 2026" */
export function monthLabel(date: string): string {
  const d = parseISO(date);
  const m = MONTHS[d.getMonth()];
  return `${m.charAt(0).toUpperCase() + m.slice(1)} ${d.getFullYear()}`;
}
/** "17:00" -> "5:00 PM" */
export function time12(t: string): string {
  const [h, m] = t.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${String(m).padStart(2, '0')} ${suffix}`;
}
export function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
export function monthKey(date: string): string {
  return date.slice(0, 7);
}

// ---------- lookups ----------

export const coachName = (db: DB, id: ID) => db.coaches.find((c) => c.id === id)?.name ?? '—';
export const studentById = (db: DB, id?: ID) => db.students.find((s) => s.id === id);
export const classById = (db: DB, id?: ID) => db.classes.find((c) => c.id === id);
export const planFor = (db: DB, s?: Student) => db.plans.find((p) => p.id === s?.planId);

export function currentStudent(db: DB): Student | undefined {
  return studentById(db, db.settings.currentStudentId) ?? db.students[0];
}

export function classesOn(db: DB, date: string): ClassItem[] {
  return db.classes.filter((c) => c.date === date).sort((a, b) => a.time.localeCompare(b.time));
}

export function upcomingClasses(db: DB, days = 7): ClassItem[] {
  const from = todayISO();
  const to = new Date();
  to.setDate(to.getDate() + days);
  const toISO = `${to.getFullYear()}-${String(to.getMonth() + 1).padStart(2, '0')}-${String(to.getDate()).padStart(2, '0')}`;
  return db.classes.filter((c) => c.date >= from && c.date <= toISO).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
}

export function bookingsFor(db: DB, classId: ID): Booking[] {
  return db.bookings.filter((b) => b.classId === classId);
}
export function spotsLeft(db: DB, cls: ClassItem): number {
  return Math.max(0, cls.capacity - bookingsFor(db, cls.id).length);
}
export function isBooked(db: DB, studentId: ID, classId: ID): boolean {
  return db.bookings.some((b) => b.studentId === studentId && b.classId === classId);
}

/** The student's next class from now on (today's later classes count). */
export function nextClassFor(db: DB, studentId: ID): ClassItem | undefined {
  const today = todayISO();
  const nowTime = new Date().toTimeString().slice(0, 5);
  return db.bookings
    .filter((b) => b.studentId === studentId)
    .map((b) => classById(db, b.classId))
    .filter((c): c is ClassItem => !!c && (c.date > today || (c.date === today && c.time >= nowTime)))
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))[0];
}

export function studentBookedClasses(db: DB, studentId: ID): ClassItem[] {
  return db.bookings
    .filter((b) => b.studentId === studentId)
    .map((b) => classById(db, b.classId))
    .filter((c): c is ClassItem => !!c)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
}

export function paymentsFor(db: DB, studentId: ID): Payment[] {
  return db.payments.filter((p) => p.studentId === studentId).sort((a, b) => b.date.localeCompare(a.date));
}

/** Students with a plan who have no payment registered this month. */
export function pendingThisMonth(db: DB): Student[] {
  const mk = monthKey(todayISO());
  return db.students.filter((s) => s.planId && !db.payments.some((p) => p.studentId === s.id && monthKey(p.date) === mk));
}

export function revenueForMonth(db: DB, mk = monthKey(todayISO())): number {
  return db.payments.filter((p) => monthKey(p.date) === mk).reduce((sum, p) => sum + p.amount, 0);
}

export function attendanceRate(db: DB, studentId: ID): number | null {
  const recs = db.attendance.filter((a) => a.studentId === studentId);
  if (!recs.length) return null;
  return Math.round((recs.filter((r) => r.present).length / recs.length) * 100);
}

/** Bookings this week vs attended — the "3 de 4 clases esta semana" line. */
export function weekProgress(db: DB, studentId: ID): { done: number; total: number } {
  const today = parseISO(todayISO());
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const inWeek = (d: string) => {
    const x = parseISO(d);
    return x >= monday && x <= sunday;
  };
  const classes = studentBookedClasses(db, studentId).filter((c) => inWeek(c.date));
  const done = classes.filter((c) => c.date < todayISO() || db.attendance.some((a) => a.classId === c.id && a.studentId === studentId && a.present)).length;
  return { done, total: classes.length };
}
