import { useNavigate } from 'react-router-dom';
import { useAppState } from '../context/AppState';
import BottomNav from '../components/BottomNav';
import { IconBell, IconCalendar, IconCard, IconCheck, IconMessage, IconClock, IconMapPin, IconChevronRight } from '../components/Icons';

export default function Home() {
  const { profile } = useAppState();
  const navigate = useNavigate();

  const quickActions = [
    { label: 'Reservar', to: '/reservar', bg: 'var(--accent-color)', icon: <IconCalendar style={{ color: '#fff' }} /> },
    { label: 'Pagar', to: '/pagos', bg: '#fff', border: true, icon: <IconCard style={{ color: 'var(--blue)' }} /> },
    { label: 'Asistencia', to: '/horario', bg: '#fff', border: true, icon: <IconCheck style={{ color: 'var(--success)' }} /> },
    { label: 'Mensajes', to: '/mensajes', bg: '#fff', border: true, icon: <IconMessage style={{ color: 'var(--blue)' }} /> },
  ];

  return (
    <div className="app-shell" style={{ '--accent-color': profile.accent }}>
      <div className="screen" style={{ paddingBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 46, height: 46, borderRadius: 15, background: 'linear-gradient(135deg, var(--cyan), var(--blue))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 18 }}>
              {profile.clientName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>Hola,</div>
              <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 19, color: 'var(--navy)' }}>{profile.clientName}</div>
            </div>
          </div>
          <button
            onClick={() => navigate('/avisos')}
            style={{ position: 'relative', width: 44, height: 44, borderRadius: 14, background: '#fff', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <IconBell style={{ color: 'var(--navy)' }} />
            <span style={{ position: 'absolute', top: 9, right: 10, width: 9, height: 9, background: 'var(--accent-color)', borderRadius: '50%', border: '2px solid #fff' }} />
          </button>
        </div>

        <button
          onClick={() => navigate('/horario')}
          style={{ position: 'relative', textAlign: 'left', width: '100%', border: 'none', cursor: 'pointer', marginTop: 18, borderRadius: 24, overflow: 'hidden', background: 'linear-gradient(135deg, #07336b 0%, var(--blue) 70%, var(--cyan) 130%)', padding: 20, boxShadow: '0 18px 30px -16px rgba(0,115,204,0.65)' }}
        >
          <img src="/shark-fin.png" alt="" style={{ position: 'absolute', right: -18, bottom: -10, width: 150, opacity: 0.16 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: '#bfe6ff', textTransform: 'uppercase' }}>Próxima clase</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--navy)', background: 'var(--cyan)', padding: '4px 10px', borderRadius: 999 }}>HOY</span>
          </div>
          <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 23, color: '#fff', marginTop: 12 }}>Nivel {profile.level}</div>
          <div style={{ fontSize: 13, color: '#cfe8ff', marginTop: 3 }}>Nadador: {profile.swimmerName} · Carril {profile.lane}</div>
          <div style={{ display: 'flex', gap: 18, marginTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <IconClock style={{ color: '#bfe6ff' }} />
              <span style={{ fontSize: 13.5, color: '#fff', fontWeight: 600 }}>{profile.classTime}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <IconMapPin style={{ color: '#bfe6ff' }} />
              <span style={{ fontSize: 13.5, color: '#fff', fontWeight: 600 }}>{profile.pool}</span>
            </div>
          </div>
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.14)', borderRadius: 13, padding: '10px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#ffd0c0,#FF6A3D)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 12, fontFamily: 'Outfit,sans-serif' }}>
                {profile.coach.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>Coach {profile.coach}</span>
            </div>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 2 }}>
              Ver detalles <IconChevronRight width={14} height={14} />
            </span>
          </div>
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 18 }}>
          {quickActions.map((a) => (
            <button
              key={a.label}
              onClick={() => navigate(a.to)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <div style={{ width: '100%', aspectRatio: '1', borderRadius: 17, background: a.bg, border: a.border ? '1px solid var(--border)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: a.border ? 'none' : '0 10px 16px -8px rgba(255,106,61,0.5)' }}>
                {a.icon}
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--navy)' }}>{a.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => navigate('/progreso')}
          style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 18, background: '#fff', border: '1px solid var(--border)', borderRadius: 20, padding: 16, width: '100%', cursor: 'pointer', textAlign: 'left' }}
        >
          <div style={{ position: 'relative', width: 58, height: 58, borderRadius: '50%', background: 'conic-gradient(var(--accent-color) 0% 75%, #EAF1F8 75% 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 14, color: 'var(--navy)' }}>75%</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--navy)' }}>Progreso de {profile.swimmerName}</div>
            <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 2 }}>3 de 4 clases esta semana</div>
          </div>
          <IconChevronRight style={{ color: 'var(--faint)' }} />
        </button>
      </div>
      <BottomNav />
    </div>
  );
}
