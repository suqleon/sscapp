import type { DB } from './types';

export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/** YYYY-MM-DD for today + offset days, in local time. */
export function isoDate(offsetDays = 0, from = new Date()): string {
  const d = new Date(from);
  d.setDate(d.getDate() + offsetDays);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export const LEVELS = ['Renacuajo', 'Tiburón 1', 'Tiburón 2', 'Tiburón 3', 'Adultos'];

export function seedDB(): DB {
  const now = new Date().toISOString();
  const coaches = [
    { id: 'c-diana', name: 'Diana' },
    { id: 'c-mario', name: 'Mario' },
  ];
  const plans = [
    { id: 'p-mensual', name: 'Plan Mensual', price: 60, classesPerMonth: 8 },
    { id: 'p-intensivo', name: 'Plan Intensivo', price: 90, classesPerMonth: 12 },
    { id: 'p-suelta', name: 'Clase suelta', price: 10, classesPerMonth: 1 },
  ];
  const students = [
    {
      id: 's-lucas', name: 'Lucas', age: 8, level: 'Tiburón 2', parentName: 'Ana Torres', parentPhone: '099 123 4567', parentEmail: 'ana.torres@email.com',
      planId: 'p-mensual', points: 1240, badges: ['Flotación', 'Respiración', 'Crol 25m'],
      skills: [{ label: 'Respiración', value: 90 }, { label: 'Crol', value: 75 }, { label: 'Espalda', value: 45 }],
      medical: 'Sin alergias conocidas.', emergencyContact: 'Ana Torres · 099 123 4567', authorizedPickup: 'Ana Torres, Pedro Torres (abuelo)', createdAt: now,
    },
    {
      id: 's-sofia', name: 'Sofía', age: 6, level: 'Tiburón 1', parentName: 'Ana Torres', parentPhone: '099 123 4567', parentEmail: 'ana.torres@email.com',
      planId: 'p-mensual', points: 420, badges: ['Flotación'],
      skills: [{ label: 'Respiración', value: 55 }, { label: 'Crol', value: 30 }, { label: 'Espalda', value: 15 }], createdAt: now,
    },
    {
      id: 's-valentina', name: 'Valentina', age: 7, level: 'Tiburón 1', parentName: 'Carla Mena', parentPhone: '098 555 1212',
      planId: 'p-intensivo', points: 610, badges: ['Flotación', 'Respiración'],
      skills: [{ label: 'Respiración', value: 70 }, { label: 'Crol', value: 40 }, { label: 'Espalda', value: 20 }], createdAt: now,
    },
    {
      id: 's-mateo', name: 'Mateo', age: 10, level: 'Tiburón 3', parentName: 'Jorge Paz', parentPhone: '097 222 3344',
      planId: 'p-mensual', points: 2100, badges: ['Flotación', 'Respiración', 'Crol 25m', 'Espalda', 'Pecho'],
      skills: [{ label: 'Respiración', value: 95 }, { label: 'Crol', value: 90 }, { label: 'Espalda', value: 80 }], createdAt: now,
    },
  ];

  // A realistic week around today so "HOY" and bookings make sense on first run.
  const classes = [
    { id: 'k1', title: 'Tiburón 2 · Crol', level: 'Tiburón 2', coachId: 'c-diana', pool: 'Alberca A', lane: '3', date: isoDate(0), time: '17:00', capacity: 6 },
    { id: 'k2', title: 'Tiburón 1 · Flotación', level: 'Tiburón 1', coachId: 'c-mario', pool: 'Alberca A', lane: '1', date: isoDate(0), time: '09:00', capacity: 6 },
    { id: 'k3', title: 'Acondicionamiento', level: 'Adultos', coachId: 'c-mario', pool: 'Alberca A', lane: '2', date: isoDate(1), time: '09:00', capacity: 8 },
    { id: 'k4', title: 'Tiburón 2 · Respiración', level: 'Tiburón 2', coachId: 'c-mario', pool: 'Alberca A', lane: '2', date: isoDate(1), time: '11:00', capacity: 4 },
    { id: 'k5', title: 'Tiburón 2 · Espalda', level: 'Tiburón 2', coachId: 'c-diana', pool: 'Alberca A', lane: '3', date: isoDate(2), time: '17:00', capacity: 6 },
    { id: 'k6', title: 'Evaluación de nivel', level: 'Tiburón 2', coachId: 'c-diana', pool: 'Alberca A', date: isoDate(2), time: '18:30', capacity: 10, special: true },
    { id: 'k7', title: 'Tiburón 3 · Técnica', level: 'Tiburón 3', coachId: 'c-diana', pool: 'Alberca B', lane: '4', date: isoDate(3), time: '17:00', capacity: 6 },
    { id: 'k8', title: 'Tiburón 1 · Respiración', level: 'Tiburón 1', coachId: 'c-mario', pool: 'Alberca A', lane: '1', date: isoDate(3), time: '09:00', capacity: 6 },
  ];

  const bookings = [
    { id: 'b1', studentId: 's-lucas', classId: 'k1', createdAt: now },
    { id: 'b2', studentId: 's-lucas', classId: 'k5', createdAt: now },
    { id: 'b3', studentId: 's-sofia', classId: 'k2', createdAt: now },
    { id: 'b4', studentId: 's-valentina', classId: 'k2', createdAt: now },
    { id: 'b5', studentId: 's-mateo', classId: 'k7', createdAt: now },
  ];

  const payments = [
    { id: 'pay1', studentId: 's-lucas', amount: 60, concept: 'Mensualidad', date: isoDate(-8), method: 'transferencia' as const },
    { id: 'pay2', studentId: 's-lucas', amount: 60, concept: 'Mensualidad', date: isoDate(-38), method: 'efectivo' as const },
    { id: 'pay3', studentId: 's-valentina', amount: 90, concept: 'Mensualidad', date: isoDate(-3), method: 'efectivo' as const },
    { id: 'pay4', studentId: 's-mateo', amount: 60, concept: 'Mensualidad', date: isoDate(-40), method: 'tarjeta' as const },
  ];

  const notices = [
    { id: 'n1', title: 'Recordatorio de clase', body: 'Lucas tiene clase hoy a las 5:00 PM en Alberca A.', createdAt: now, read: false, kind: 'clase' as const },
    { id: 'n2', title: '¡Nueva insignia!', body: 'Lucas completó "Crol 25m". ¡Felicidades!', createdAt: now, read: false, kind: 'insignia' as const },
    { id: 'n3', title: 'Pago confirmado', body: 'Tu mensualidad se registró correctamente.', createdAt: new Date(Date.now() - 3 * 864e5).toISOString(), read: true, kind: 'pago' as const },
    { id: 'n4', title: 'Cambio de horario', body: 'La clase del viernes se mueve a las 6:00 PM.', createdAt: new Date(Date.now() - 4 * 864e5).toISOString(), read: true, kind: 'horario' as const },
  ];

  return {
    version: 1,
    coaches,
    plans,
    students,
    classes,
    bookings,
    attendance: [],
    payments,
    notices,
    settings: {
      clubName: 'Shark Swimming Club',
      accent: '#FF6A3D',
      viewAs: 'admin',
      currentStudentId: 's-lucas',
      levels: LEVELS,
      pools: ['Alberca A', 'Alberca B'],
    },
  };
}
