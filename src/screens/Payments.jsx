import { useAppState } from '../context/AppState';
import { useToast } from '../components/Toast';
import BottomNav from '../components/BottomNav';
import { paymentHistory } from '../data/mockData';
import { IconCheck, IconChevronRight } from '../components/Icons';

export default function Payments() {
  const { profile } = useAppState();
  const showToast = useToast();

  return (
    <div className="app-shell" style={{ '--accent-color': profile.accent }}>
      <div className="screen">
        <div className="screen-title">Membresía</div>

        <div style={{ position: 'relative', marginTop: 16, borderRadius: 22, overflow: 'hidden', background: 'linear-gradient(135deg, #07336b, var(--blue-deep) 55%, var(--blue))', padding: 20, minHeight: 150, boxShadow: '0 18px 30px -16px rgba(7,51,107,0.7)' }}>
          <img src="/shark-fin.png" alt="" style={{ position: 'absolute', right: -20, bottom: -16, width: 150, opacity: 0.16 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: '#bfe6ff', textTransform: 'uppercase' }}>{profile.plan}</div>
              <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 19, color: '#fff', marginTop: 4 }}>Shark Club</div>
            </div>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--navy)', background: 'var(--cyan)', padding: '5px 11px', borderRadius: 999 }}>ACTIVA</span>
          </div>
          <div style={{ position: 'relative', marginTop: 34, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontSize: 10, color: '#9cc6ee', fontWeight: 600 }}>TITULAR</div>
              <div style={{ fontSize: 14.5, color: '#fff', fontWeight: 700, marginTop: 2 }}>{profile.clientName}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: '#9cc6ee', fontWeight: 600 }}>VÁLIDA HASTA</div>
              <div style={{ fontSize: 14.5, color: '#fff', fontWeight: 700, marginTop: 2 }}>08 / 26</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 16, background: '#fff', border: '1px solid var(--border)', borderRadius: 18, padding: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--navy)' }}>{profile.price} / mes</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Renueva el 8 de julio · 8 clases</div>
          </div>
          <button onClick={() => showToast('Cambio de plan próximamente')} style={{ fontSize: 12, fontWeight: 700, color: 'var(--blue)', background: 'none', border: 'none', cursor: 'pointer' }}>
            Cambiar
          </button>
        </div>

        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)', margin: '18px 0 10px' }}>Método de pago</div>
        <button
          onClick={() => showToast('Gestión de método de pago próximamente')}
          style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: '14px 16px', width: '100%', cursor: 'pointer' }}
        >
          <div style={{ width: 42, height: 30, borderRadius: 6, background: 'linear-gradient(135deg,#1a1f71,#2b3a9e)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 11 }}>VISA</div>
          <div style={{ flex: 1, fontSize: 13.5, color: 'var(--navy)', fontWeight: 600, textAlign: 'left' }}>•••• 4821</div>
          <IconChevronRight style={{ color: 'var(--faint)' }} />
        </button>

        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)', margin: '18px 0 10px' }}>Historial</div>
        {paymentHistory.map((p, i) => (
          <div key={p.label}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 2px' }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                <IconCheck style={{ color: 'var(--success)' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--navy)' }}>{p.label}</div>
                <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{p.date}</div>
              </div>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--navy)' }}>{profile.price}</span>
            </div>
            {i < paymentHistory.length - 1 && <div style={{ height: 1, background: '#EAF1F8' }} />}
          </div>
        ))}
      </div>
      <BottomNav />
    </div>
  );
}
