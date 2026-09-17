export type Role = 'cliente' | 'instructor' | 'admin';

export type Profile = {
  accent: string;
  clientName: string;
  swimmerName: string;
  swimmerAge: string;
  level: string;
  coach: string;
  classTime: string;
  pool: string;
  lane: string;
  plan: string;
  price: string;
  role: Role;
};

export const defaultProfile: Profile = {
  accent: '#FF6A3D',
  clientName: 'Ana',
  swimmerName: 'Lucas',
  swimmerAge: '8',
  level: 'Tiburón 2',
  coach: 'Diana',
  classTime: '5:00 PM',
  pool: 'Alberca A',
  lane: '3',
  plan: 'Plan Olas Premium',
  price: '$1,200',
  role: 'cliente',
};

export type ScheduleClass = { title: string; subtitle: string; status: 'Reservado' | 'Disponible' | 'Especial'; color: string };
export type ScheduleDay = { day: string; isToday: boolean; classes: ScheduleClass[] };

export function getWeekSchedule(p: Profile): ScheduleDay[] {
  return [
    {
      day: 'Martes 16',
      isToday: true,
      classes: [
        { title: `${p.level} · Crol`, subtitle: `${p.classTime} · Coach ${p.coach} · Carril ${p.lane}`, status: 'Reservado', color: '#16B5F7' },
      ],
    },
    {
      day: 'Miércoles 17',
      isToday: false,
      classes: [{ title: 'Acondicionamiento', subtitle: '9:00 AM · Coach Mario', status: 'Disponible', color: '#18B57A' }],
    },
    {
      day: 'Jueves 18',
      isToday: false,
      classes: [
        { title: `${p.level} · Espalda`, subtitle: `${p.classTime} · Coach ${p.coach} · Carril ${p.lane}`, status: 'Reservado', color: '#16B5F7' },
        { title: 'Evaluación de nivel', subtitle: `6:30 PM · Coach ${p.coach}`, status: 'Especial', color: '#F5A623' },
      ],
    },
  ];
}

export type Slot = { id: string; time: string; period: string; title: string; subtitle: string; state: 'default' | 'free' | 'full' };

export function getBookingSlots(p: Profile): Slot[] {
  return [
    { id: 'a', time: '9:00', period: 'AM', title: `${p.level} · Crol`, subtitle: `Coach ${p.coach} · 4 lugares`, state: 'default' },
    { id: 'b', time: '11:00', period: 'AM', title: `${p.level} · Respiración`, subtitle: 'Coach Mario · 2 lugares', state: 'free' },
    { id: 'c', time: '5:00', period: 'PM', title: `${p.level} · Espalda`, subtitle: `Coach ${p.coach}`, state: 'full' },
  ];
}

export const badges = [
  { label: 'Flotación', earned: true, colors: ['#FFE9A8', '#F5A623'] },
  { label: 'Respiración', earned: true, colors: ['#A8E6FF', '#16B5F7'] },
  { label: 'Crol 25m', earned: true, colors: ['#C9F5DF', '#18B57A'] },
  { label: 'Espalda', earned: false, colors: ['#EEF3F8', '#EEF3F8'] },
];

export const skills = [
  { label: 'Respiración', value: 90 },
  { label: 'Crol', value: 75 },
  { label: 'Espalda', value: 45 },
];

export const paymentHistory = [
  { label: 'Mensualidad junio', date: '8 jun 2026' },
  { label: 'Mensualidad mayo', date: '8 may 2026' },
];

export type Conversation = {
  id: string;
  name: string;
  time: string;
  preview: string;
  unread: number;
  color: string;
  initial?: string;
  thread: { from: 'me' | 'them'; text: string }[];
};

export function getConversations(p: Profile): Conversation[] {
  return [
    {
      id: 'coach',
      name: `Coach ${p.coach}`,
      time: '10:24',
      preview: `¡${p.swimmerName} avanzó mucho en crol hoy! 👏`,
      unread: 2,
      color: '#FF8A65',
      initial: p.coach.charAt(0).toUpperCase(),
      thread: [
        { from: 'them', text: `${p.swimmerName} avanzó mucho en crol hoy 👏` },
        { from: 'them', text: 'Ya está listo para la evaluación del jueves.' },
      ],
    },
    { id: 'recepcion', name: 'Recepción Shark', time: 'Ayer', preview: 'Tu pago de junio fue recibido ✅', unread: 0, color: '#0073CC', thread: [{ from: 'them', text: 'Tu pago de junio fue recibido. ¡Gracias!' }] },
    { id: 'grupo', name: 'Grupo Tiburones 2', time: 'Lun', preview: 'Mario: Recuerden traer gorra y goggles', unread: 0, color: '#18B57A', thread: [{ from: 'them', text: 'Mario: Recuerden traer gorra y goggles' }] },
    { id: 'admin', name: 'Administración', time: '12 jun', preview: 'Horario especial por mantenimiento', unread: 0, color: '#6F4AE0', thread: [{ from: 'them', text: 'Horario especial por mantenimiento esta semana.' }] },
  ];
}

export type Notice = { title: string; body: string; icon: 'clock' | 'star' | 'credit-card' | 'calendar'; unread: boolean };
export type NoticeGroup = { group: string; items: Notice[] };

export function getNotices(p: Profile): NoticeGroup[] {
  return [
    {
      group: 'Hoy',
      items: [
        { title: 'Recordatorio de clase', body: `${p.swimmerName} tiene clase hoy a las ${p.classTime} en ${p.pool}.`, icon: 'clock', unread: true },
        { title: '¡Nueva insignia!', body: `${p.swimmerName} completó "Crol 25m". ¡Felicidades!`, icon: 'star', unread: true },
      ],
    },
    {
      group: 'Esta semana',
      items: [
        { title: 'Pago confirmado', body: 'Tu mensualidad de junio se procesó correctamente.', icon: 'credit-card', unread: false },
        { title: 'Cambio de horario', body: 'La clase del viernes se mueve a las 6:00 PM.', icon: 'calendar', unread: false },
      ],
    },
  ];
}
