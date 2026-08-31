import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../context/AppState';
import { useToast } from '../components/Toast';
import BottomNav from '../components/BottomNav';
import { getBookingSlots } from '../data/mockData';
import { IconChevronLeft, IconCheck } from '../components/Icons';

const days = [
  { label: 'LUN', num: 15 },
  { label: 'MAR', num: 16 },
  { label: 'MIÉ', num: 17 },
  { label: 'JUE', num: 18 },
  { label: 'VIE', num: 19 },
];

export default function Book() {
  const { profile } = useAppState();
  const navigate = useNavigate();
  const showToast = useToast();
  const slots = getBookingSlots(profile);
  const [selectedDay, setSelectedDay] = useState(16);
  const [selectedSlot, setSelectedSlot] = useState(slots[0].id);

  const chosen = slots.find((s) => s.id === selectedSlot);

  function confirm() {
    if (!chosen || chosen.state === 'full') return;
    showToast(`Reserva confirmada · ${chosen.time} ${chosen.period}`);
    setTimeout(() => navigate('/horario'), 900);
  }

  return (
    <div className="app-shell" style={{ '--accent-color': profile.accent }}>
      <div className="screen">
        <div className="screen-header">
          <button className="back-btn" onClick={() => navigate(-1)} aria-label="Volver">
            <IconChevronLeft style={{ color: 'var(--navy)' }} />
          </button>
          <div className="screen-title">Reservar clase</div>
        </div>

        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)', margin: '10px 0' }}>Junio 2026</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {days.map((d) => {
            const active = d.num === selectedDay;
            return (
              <button
                key={d.num}
                onClick={() => setSelectedDay(d.num)}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: '11px 0',
                  borderRadius: 14,
                  border: active ? 'none' : '1px solid var(--border)',
                  background: active ? 'linear-gradient(135deg,var(--blue-deep),var(--blue))' : '#fff',
                  cursor: 'pointer',
                  boxShadow: active ? '0 10px 18px -8px rgba(0,115,204,0.6)' : 'none',
                }}
              >
                <div style={{ fontSize: 11, fontWeight: active ? 700 : 600, color: active ? '#bfe6ff' : 'var(--muted)' }}>{d.label}</div>
                <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 17, color: active ? '#fff' : 'var(--navy)', marginTop: 3 }}>{d.num}</div>
              </button>
            );
          })}
        </div>

        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)', margin: '20px 0 10px' }}>Horarios disponibles</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {slots.map((slot) => {
            const isSelected = slot.id === selectedSlot;
            const isFull = slot.state === 'full';
            return (
              <button
                key={slot.id}
                disabled={isFull}
                onClick={() => setSelectedSlot(slot.id)}
                style={{
                  border: isSelected ? '2px solid var(--blue)' : '1px solid var(--border)',
                  background: isSelected ? '#EAF4FE' : '#fff',
                  borderRadius: 18,
                  padding: 15,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  cursor: isFull ? 'default' : 'pointer',
                  opacity: isFull ? 0.55 : 1,
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                <div style={{ textAlign: 'center', flex: 'none' }}>
                  <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 18, color: isSelected ? 'var(--blue)' : 'var(--navy)' }}>{slot.time}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700 }}>{slot.period}</div>
                </div>
                <div style={{ width: 1, height: 38, background: '#EAF1F8' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 14.5, color: 'var(--navy)' }}>{slot.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{slot.subtitle}</div>
                </div>
                {isFull ? (
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--faint)', background: '#EEF3F8', padding: '5px 10px', borderRadius: 999 }}>Lleno</span>
                ) : isSelected ? (
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                    <IconCheck style={{ color: '#fff' }} />
                  </div>
                ) : (
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--success)', background: 'var(--success-bg)', padding: '5px 10px', borderRadius: 999 }}>Libre</span>
                )}
              </button>
            );
          })}
        </div>

        <button className="btn-accent" style={{ marginTop: 18 }} onClick={confirm} disabled={chosen?.state === 'full'}>
          Confirmar reserva · {chosen ? `${chosen.time} ${chosen.period}` : ''}
        </button>
      </div>
      <BottomNav />
    </div>
  );
}
