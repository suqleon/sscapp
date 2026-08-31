import { NavLink } from 'react-router-dom';
import { IconHome, IconCalendar, IconTrophy, IconMessage, IconUser } from './Icons';

const items = [
  { to: '/', label: 'Inicio', Icon: IconHome, end: true },
  { to: '/reservar', label: 'Reservar', Icon: IconCalendar },
  { to: '/progreso', label: 'Progreso', Icon: IconTrophy },
  { to: '/mensajes', label: 'Mensajes', Icon: IconMessage },
  { to: '/perfil', label: 'Perfil', Icon: IconUser },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {items.map(({ to, label, Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
        >
          <Icon />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
