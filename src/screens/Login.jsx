import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../context/AppState';
import { IconMail, IconLock, IconEye, IconFingerprint, IconShieldCheck } from '../components/Icons';

export default function Login() {
  const { login, profile } = useAppState();
  const navigate = useNavigate();
  const [email, setEmail] = useState('ana.torres@email.com');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    login();
    navigate('/', { replace: true });
  }

  return (
    <div className="app-shell" style={{ '--accent-color': profile.accent }}>
      <div className="screen" style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 20 }}>
          <img src="/shark-logo.png" alt="Shark Swimming Club" style={{ width: 150, height: 'auto' }} />
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--navy)', textAlign: 'center', marginTop: 22 }}>
          Bienvenido de nuevo
        </h1>
        <p style={{ fontSize: 13.5, color: 'var(--muted)', textAlign: 'center', marginTop: 6 }}>
          Ingresa para gestionar tus clases
        </p>

        <form onSubmit={handleSubmit} style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--navy)' }}>Correo</label>
            <div className="input-field" style={{ marginTop: 7 }}>
              <IconMail style={{ color: 'var(--blue)' }} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--navy)' }}>Contraseña</label>
            <div className="input-field" style={{ marginTop: 7 }}>
              <IconLock style={{ color: 'var(--blue)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', display: 'flex' }}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <IconEye />
              </button>
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: 12.5, fontWeight: 700, color: 'var(--blue)' }}>
            ¿Olvidaste tu contraseña?
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: 8 }}>
            Iniciar sesión
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ fontSize: 12, color: 'var(--faint)', fontWeight: 600 }}>o continúa con</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        <button
          type="button"
          onClick={() => {
            login();
            navigate('/', { replace: true });
          }}
          className="btn-outline"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
        >
          <IconFingerprint style={{ color: 'var(--accent-color)' }} />
          Face ID / Huella
        </button>

        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '18px 0 8px', color: 'var(--muted)' }}>
          <IconShieldCheck style={{ color: 'var(--success)' }} />
          <span style={{ fontSize: 12, fontWeight: 600 }}>Conexión cifrada de extremo a extremo</span>
        </div>
      </div>
    </div>
  );
}
