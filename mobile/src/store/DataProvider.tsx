import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { seedDB, uid } from './seed';
import { isBooked, spotsLeft, studentById, classById, coachName, time12 } from './selectors';
import type { Booking, ClassItem, Coach, DB, ID, Notice, Payment, Plan, Settings, Student } from './types';

const KEY = 'ssc-db-v1';

type Result = { ok: true } | { ok: false; reason: string };

type DataValue = {
  db: DB;
  ready: boolean;
  reset: () => void;
  updateSettings: (patch: Partial<Settings>) => void;
  addStudent: (s: Omit<Student, 'id' | 'createdAt' | 'points' | 'skills' | 'badges'> & Partial<Pick<Student, 'points' | 'skills' | 'badges'>>) => Student;
  updateStudent: (id: ID, patch: Partial<Student>) => void;
  removeStudent: (id: ID) => void;
  addCoach: (name: string, phone?: string) => Coach;
  updateCoach: (id: ID, patch: Partial<Coach>) => void;
  removeCoach: (id: ID) => void;
  addClass: (c: Omit<ClassItem, 'id'>) => ClassItem;
  updateClass: (id: ID, patch: Partial<ClassItem>) => void;
  removeClass: (id: ID) => void;
  book: (studentId: ID, classId: ID) => Result;
  cancelBooking: (studentId: ID, classId: ID) => void;
  setAttendance: (classId: ID, studentId: ID, present: boolean) => void;
  addPayment: (p: Omit<Payment, 'id'>) => Payment;
  removePayment: (id: ID) => void;
  addPlan: (p: Omit<Plan, 'id'>) => Plan;
  updatePlan: (id: ID, patch: Partial<Plan>) => void;
  removePlan: (id: ID) => void;
  addNotice: (n: Omit<Notice, 'id' | 'createdAt' | 'read'>) => void;
  markNoticesRead: () => void;
};

const Ctx = createContext<DataValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<DB>(seedDB);
  const [ready, setReady] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (cancelled) return;
        if (raw) {
          try {
            const parsed = JSON.parse(raw) as DB;
            if (parsed && parsed.version === 1) setDb(parsed);
          } catch {
            /* corrupt → keep seed */
          }
        }
      })
      .catch(() => {})
      .finally(() => !cancelled && setReady(true));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      AsyncStorage.setItem(KEY, JSON.stringify(db)).catch(() => {});
    }, 250);
  }, [db, ready]);

  const patch = useCallback((fn: (prev: DB) => DB) => setDb((prev) => fn(prev)), []);

  const pushNotice = (prev: DB, n: Omit<Notice, 'id' | 'createdAt' | 'read'>): DB => ({
    ...prev,
    notices: [{ ...n, id: uid(), createdAt: new Date().toISOString(), read: false }, ...prev.notices],
  });

  const value = useMemo<DataValue>(
    () => ({
      db,
      ready,
      reset: () => setDb(seedDB()),
      updateSettings: (p) => patch((prev) => ({ ...prev, settings: { ...prev.settings, ...p } })),

      addStudent: (s) => {
        const student: Student = { points: 0, skills: [], badges: [], ...s, id: uid(), createdAt: new Date().toISOString() };
        patch((prev) => ({ ...prev, students: [...prev.students, student] }));
        return student;
      },
      updateStudent: (id, p) => patch((prev) => ({ ...prev, students: prev.students.map((s) => (s.id === id ? { ...s, ...p } : s)) })),
      removeStudent: (id) =>
        patch((prev) => ({
          ...prev,
          students: prev.students.filter((s) => s.id !== id),
          bookings: prev.bookings.filter((b) => b.studentId !== id),
          attendance: prev.attendance.filter((a) => a.studentId !== id),
          settings: prev.settings.currentStudentId === id ? { ...prev.settings, currentStudentId: prev.students.find((s) => s.id !== id)?.id } : prev.settings,
        })),

      addCoach: (name, phone) => {
        const coach: Coach = { id: uid(), name, phone };
        patch((prev) => ({ ...prev, coaches: [...prev.coaches, coach] }));
        return coach;
      },
      updateCoach: (id, p) => patch((prev) => ({ ...prev, coaches: prev.coaches.map((c) => (c.id === id ? { ...c, ...p } : c)) })),
      removeCoach: (id) => patch((prev) => ({ ...prev, coaches: prev.coaches.filter((c) => c.id !== id) })),

      addClass: (c) => {
        const cls: ClassItem = { ...c, id: uid() };
        patch((prev) => ({ ...prev, classes: [...prev.classes, cls] }));
        return cls;
      },
      updateClass: (id, p) => patch((prev) => ({ ...prev, classes: prev.classes.map((c) => (c.id === id ? { ...c, ...p } : c)) })),
      removeClass: (id) =>
        patch((prev) => ({
          ...prev,
          classes: prev.classes.filter((c) => c.id !== id),
          bookings: prev.bookings.filter((b) => b.classId !== id),
          attendance: prev.attendance.filter((a) => a.classId !== id),
        })),

      book: (studentId, classId) => {
        const cls = classById(db, classId);
        const student = studentById(db, studentId);
        if (!cls || !student) return { ok: false, reason: 'Clase o alumno no encontrado.' };
        if (isBooked(db, studentId, classId)) return { ok: false, reason: `${student.name} ya está en esta clase.` };
        if (spotsLeft(db, cls) <= 0) return { ok: false, reason: 'Esta clase ya está llena.' };
        const booking: Booking = { id: uid(), studentId, classId, createdAt: new Date().toISOString() };
        patch((prev) =>
          pushNotice(
            { ...prev, bookings: [...prev.bookings, booking] },
            { title: 'Reserva confirmada', body: `${student.name}: ${cls.title} · ${time12(cls.time)} con Coach ${coachName(prev, cls.coachId)}.`, kind: 'clase' }
          )
        );
        return { ok: true };
      },
      cancelBooking: (studentId, classId) =>
        patch((prev) => ({ ...prev, bookings: prev.bookings.filter((b) => !(b.studentId === studentId && b.classId === classId)) })),

      setAttendance: (classId, studentId, present) =>
        patch((prev) => ({
          ...prev,
          attendance: [
            ...prev.attendance.filter((a) => !(a.classId === classId && a.studentId === studentId)),
            { classId, studentId, present, markedAt: new Date().toISOString() },
          ],
        })),

      addPayment: (p) => {
        const payment: Payment = { ...p, id: uid() };
        patch((prev) => {
          const s = studentById(prev, p.studentId);
          return pushNotice({ ...prev, payments: [payment, ...prev.payments] }, { title: 'Pago registrado', body: `${s?.name ?? 'Alumno'}: ${p.concept} · $${p.amount}.`, kind: 'pago' });
        });
        return payment;
      },
      removePayment: (id) => patch((prev) => ({ ...prev, payments: prev.payments.filter((p) => p.id !== id) })),

      addPlan: (p) => {
        const plan: Plan = { ...p, id: uid() };
        patch((prev) => ({ ...prev, plans: [...prev.plans, plan] }));
        return plan;
      },
      updatePlan: (id, p) => patch((prev) => ({ ...prev, plans: prev.plans.map((x) => (x.id === id ? { ...x, ...p } : x)) })),
      removePlan: (id) => patch((prev) => ({ ...prev, plans: prev.plans.filter((x) => x.id !== id) })),

      addNotice: (n) => patch((prev) => pushNotice(prev, n)),
      markNoticesRead: () => patch((prev) => ({ ...prev, notices: prev.notices.map((n) => ({ ...n, read: true })) })),
    }),
    [db, ready, patch]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useData(): DataValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useData must be used inside DataProvider');
  return v;
}
