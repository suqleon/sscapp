export const defaultProfile = {
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
};

export function getWeekSchedule(profile) {
  return [
    {
      day: 'Martes 16',
      isToday: true,
      classes: [
        { title: `${profile.level} · Crol`, subtitle: `${profile.classTime} · Coach ${profile.coach} · Carril ${profile.lane}`, status: 'Reservado', color: '#16B5F7' },
      ],
    },
    {
      day: 'Miércoles 17',
      isToday: false,
      classes: [
        { title: 'Acondicionamiento', subtitle: '9:00 AM · Coach Mario', status: 'Disponible', color: '#18B57A' },
      ],
    },
    {
      day: 'Jueves 18',
      isToday: false,
      classes: [
        { title: `${profile.level} · Espalda`, subtitle: `${profile.classTime} · Coach ${profile.coach} · Carril ${profile.lane}`, status: 'Reservado', color: '#16B5F7' },
        { title: 'Evaluación de nivel', subtitle: `6:30 PM · Coach ${profile.coach}`, status: 'Especial', color: '#F5A623' },
      ],
    },
  ];
}

export function getBookingSlots(profile) {
  return [
    { id: 'a', time: '9:00', period: 'AM', title: `${profile.level} · Crol`, subtitle: `Coach ${profile.coach} · 4 lugares`, state: 'default' },
    { id: 'b', time: '11:00', period: 'AM', title: `${profile.level} · Respiración`, subtitle: 'Coach Mario · 2 lugares', state: 'free' },
    { id: 'c', time: '5:00', period: 'PM', title: `${profile.level} · Espalda`, subtitle: `Coach ${profile.coach}`, state: 'full' },
  ];
}

export const badges = [
  { label: 'Flotación', earned: true, gradient: 'linear-gradient(135deg,#FFE9A8,#F5A623)' },
  { label: 'Respiración', earned: true, gradient: 'linear-gradient(135deg,#A8E6FF,#16B5F7)' },
  { label: 'Crol 25m', earned: true, gradient: 'linear-gradient(135deg,#C9F5DF,#18B57A)' },
  { label: 'Espalda', earned: false, gradient: null },
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

export function getConversations(profile) {
  return [
  {
    id: 'coach',
    name: `Coach ${profile.coach}`,
    time: '10:24',
    preview: `¡${profile.swimmerName} avanzó mucho en crol hoy! 👏`,
    unread: 2,
    avatar: { type: 'initial', gradient: 'linear-gradient(135deg,#ffd0c0,#FF6A3D)' },
    thread: [
      { from: 'them', text: `${profile.swimmerName} avanzó mucho en crol hoy 👏` },
      { from: 'them', text: 'Ya está listo para la evaluación del jueves.' },
    ],
  },
  {
    id: 'recepcion',
    name: 'Recepción Shark',
    time: 'Ayer',
    preview: 'Tu pago de junio fue recibido ✅',
    unread: 0,
    avatar: { type: 'icon', gradient: 'linear-gradient(135deg,#16B5F7,#0073CC)' },
    thread: [{ from: 'them', text: 'Tu pago de junio fue recibido. ¡Gracias!' }],
  },
  {
    id: 'grupo',
    name: 'Grupo Tiburones 2',
    time: 'Lun',
    preview: 'Mario: Recuerden traer gorra y goggles',
    unread: 0,
    avatar: { type: 'icon', gradient: 'linear-gradient(135deg,#C9F5DF,#18B57A)' },
    thread: [{ from: 'them', text: 'Mario: Recuerden traer gorra y goggles' }],
  },
  {
    id: 'admin',
    name: 'Administración',
    time: '12 jun',
    preview: 'Horario especial por mantenimiento',
    unread: 0,
    avatar: { type: 'icon', gradient: 'linear-gradient(135deg,#C9B8FF,#6F4AE0)' },
    thread: [{ from: 'them', text: 'Horario especial por mantenimiento esta semana.' }],
  },
  ];
}

export function getNotices(profile) {
  return [
  {
    group: 'Hoy',
    items: [
      { title: 'Recordatorio de clase', body: `${profile.swimmerName} tiene clase hoy a las ${profile.classTime} en ${profile.pool}.`, icon: 'clock', unread: true },
      { title: '¡Nueva insignia!', body: `${profile.swimmerName} completó "Crol 25m". ¡Felicidades!`, icon: 'star', unread: true },
    ],
  },
  {
    group: 'Esta semana',
    items: [
      { title: 'Pago confirmado', body: 'Tu mensualidad de junio se procesó correctamente.', icon: 'card', unread: false },
      { title: 'Cambio de horario', body: 'La clase del viernes se mueve a las 6:00 PM.', icon: 'calendar', unread: false },
    ],
  },
  ];
}
