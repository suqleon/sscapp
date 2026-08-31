import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../context/AppState';
import { useToast } from '../components/Toast';
import BottomNav from '../components/BottomNav';
import { IconShieldCheck, IconLock, IconFingerprint, IconChevronRight, IconCard } from '../components/Icons';

function Toggle({ on, onChange }) {
  return (
    <button
      onClick={onChange}
      style={{
        width: 42,
        height: 24,
        borderRadius: 999,
        background: on ? 'var(--success)' : '#D7E3EF',
        position: 'relative',
        border: 'none',
        cursor: 'pointer',
        flex: 'none',
        transition: 'background 0.15s',
      }}
      role="switch"
      aria-checked={on}
    >
      <div style={{ position: 'absolute', top: 2, left: on ? 20 : 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 0.15s' }} />
    </button>
  );
}

function Row({ icon, label, right, onClick }) {
  const content = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 15px' }}>
      {icon}
      <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: 'var(--navy)', textAlign: 'left' }}>{label}</span>
      {right}
    </div>
  );
  if (!onClick) return content;
  return (
    <button onClick={onClick} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
      {content}
    </button>
  );
}

export default function Profile() {
  const { profile, logout } = useAppState();
  const navigate = useNavigate();
  const showToast = useToast();
  const [twoFA, setTwoFA] = useState(true);
  const [biometric, setBiometric] = useState(true);

  return (
    <div className="app-shell" style={{ '--accent-color': profile.accent }}>
      <div className="screen">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 58, height: 58, borderRadius: 18, background: 'linear-gradient(135deg, var(--cyan), var(--blue))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 22 }}>
            {profile.clientName.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 19, color: 'var(--navy)' }}>{profile.clientName}</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 4 }}>
              <IconShieldCheck style={{ color: 'var(--success)' }} width={13} height={13} />
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--success)' }}>Cuenta verificada</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14, background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: '12px 14px' }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: 'linear-gradient(135deg,#ffd0c0,#FF6A3D)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 15, flex: 'none' }}>
            {profile.swimmerName.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--navy)' }}>{profile.swimmerName} · {profile.swimmerAge} años</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>Nadador · Nivel {profile.level}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 7, margin: '18px 0 10px' }}>
          <IconShieldCheck style={{ color: 'var(--accent-color)' }} width={15} height={15} />
          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--navy)', fontFamily: 'Outfit,sans-serif' }}>Seguridad</span>
        </div>
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden' }}>
          <Row icon={<IconLock style={{ color: 'var(--blue)' }} />} label="Verificación en dos pasos" right={<Toggle on={twoFA} onChange={() => setTwoFA((v) => !v)} />} />
          <div style={{ height: 1, background: '#EAF1F8', margin: '0 15px' }} />
          <Row icon={<IconFingerprint style={{ color: 'var(--blue)' }} />} label="Acceso con Face ID / huella" right={<Toggle on={biometric} onChange={() => setBiometric((v) => !v)} />} />
          <div style={{ height: 1, background: '#EAF1F8', margin: '0 15px' }} />
          <Row
            icon={<IconShieldCheck style={{ color: 'var(--success)' }} />}
            label="Datos cifrados extremo a extremo"
            right={<span style={{ fontSize: 11, fontWeight: 700, color: 'var(--success)', background: 'var(--success-bg)', padding: '4px 9px', borderRadius: 999 }}>Activo</span>}
          />
        </div>

        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--navy)', fontFamily: 'Outfit,sans-serif', margin: '16px 0 10px' }}>Datos del nadador</div>
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden' }}>
          <Row
            icon={<IconCard style={{ color: 'var(--accent-color)' }} />}
            label="Información médica"
            right={<IconChevronRight style={{ color: 'var(--faint)' }} />}
            onClick={() => showToast('Sección en desarrollo')}
          />
          <div style={{ height: 1, background: '#EAF1F8', margin: '0 15px' }} />
          <Row
            icon={<IconCard style={{ color: 'var(--blue)' }} />}
            label="Contactos de emergencia"
            right={<IconChevronRight style={{ color: 'var(--faint)' }} />}
            onClick={() => showToast('Sección en desarrollo')}
          />
          <div style={{ height: 1, background: '#EAF1F8', margin: '0 15px' }} />
          <Row
            icon={<IconCard style={{ color: 'var(--success)' }} />}
            label="Autorizados para recoger"
            right={<IconChevronRight style={{ color: 'var(--faint)' }} />}
            onClick={() => showToast('Sección en desarrollo')}
          />
        </div>

        <button
          className="btn-outline"
          style={{ marginTop: 20, color: '#c0392b', borderColor: '#f3d4d0' }}
          onClick={() => {
            logout();
            navigate('/login', { replace: true });
          }}
        >
          Cerrar sesión
        </button>
      </div>
      <BottomNav />
    </div>
  );
}
