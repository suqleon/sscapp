import { useState } from 'react';
import { useAppState } from '../context/AppState';
import BottomNav from '../components/BottomNav';
import { getWeekSchedule } from '../data/mockData';

export default function Schedule() {
  const { profile } = useAppState();
  const [view, setView] = useState('semana');
  const days = getWeekSchedule(profile);

  return (
    <div className="app-shell" style={{ '--accent-color': profile.accent }}>
      <div className="screen">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="screen-title">Horario</div>
          <div style={{ display: 'flex', background: '#E8F0F8', borderRadius: 12, padding: 3 }}>
            {['semana', 'mes'].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: view === v ? '#fff' : 'var(--muted)',
                  background: view === v ? 'var(--blue)' : 'none',
                  border: 'none',
                  padding: '6px 14px',
                  borderRadius: 9,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {view === 'mes' ? (
          <div className="card" style={{ marginTop: 20, textAlign: 'center', color: 'var(--muted)', fontSize: 13.5 }}>
            La vista mensual llega en una próxima versión.
          </div>
        ) : (
          days.map((day) => (
            <div key={day.day}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '18px 0 10px' }}>
                <span style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 14, color: 'var(--navy)' }}>{day.day}</span>
                {day.isToday && (
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent-color)', background: 'rgba(255,106,61,0.12)', padding: '3px 9px', borderRadius: 999 }}>HOY</span>
                )}
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {day.classes.map((c) => (
                  <div key={c.title} style={{ display: 'flex', gap: 12, background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: 14 }}>
                    <div style={{ width: 4, borderRadius: 4, background: c.color }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--navy)' }}>{c.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>{c.subtitle}</div>
                    </div>
                    <span
                      style={{
                        alignSelf: 'center',
                        fontSize: 10.5,
                        fontWeight: 700,
                        padding: '5px 9px',
                        borderRadius: 999,
                        color: c.status === 'Reservado' ? 'var(--blue)' : c.status === 'Disponible' ? 'var(--success)' : '#C77A0A',
                        background: c.status === 'Reservado' ? '#E8F2FD' : c.status === 'Disponible' ? 'var(--success-bg)' : '#FDF1DD',
                      }}
                    >
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
      <BottomNav />
    </div>
  );
}
