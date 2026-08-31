import { useAppState } from '../context/AppState';
import BottomNav from '../components/BottomNav';
import { badges, skills } from '../data/mockData';
import { IconStar, IconLock } from '../components/Icons';

export default function Progress() {
  const { profile } = useAppState();

  return (
    <div className="app-shell" style={{ '--accent-color': profile.accent }}>
      <div className="screen">
        <div className="screen-title">Progreso de {profile.swimmerName}</div>

        <div style={{ position: 'relative', marginTop: 16, borderRadius: 24, overflow: 'hidden', background: 'linear-gradient(135deg, #07336b, var(--blue) 75%, var(--cyan))', padding: 20, display: 'flex', alignItems: 'center', gap: 18 }}>
          <img src="/shark-fin.png" alt="" style={{ position: 'absolute', right: -16, top: -8, width: 120, opacity: 0.18 }} />
          <div style={{ position: 'relative', width: 86, height: 86, borderRadius: '50%', background: 'conic-gradient(var(--cyan) 0% 75%, rgba(255,255,255,0.22) 75% 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
            <div style={{ width: 70, height: 70, borderRadius: '50%', background: '#07336b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 22 }}>75%</div>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: '#bfe6ff', textTransform: 'uppercase' }}>Nivel actual</div>
            <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 22, color: '#fff', marginTop: 4 }}>{profile.level}</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8, background: 'rgba(255,255,255,0.16)', padding: '5px 11px', borderRadius: 999 }}>
              <IconStar width={13} height={13} style={{ color: '#FFD23F' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>1,240 pts</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '18px 0 10px' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)' }}>Insignias</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--blue)' }}>Ver todas</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {badges.map((b) => (
            <div key={b.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div
                style={{
                  width: '100%',
                  aspectRatio: '1',
                  borderRadius: 16,
                  background: b.earned ? b.gradient : '#EEF3F8',
                  border: b.earned ? 'none' : '1.5px dashed #cdd9e6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {b.earned ? <IconStar style={{ color: '#fff' }} /> : <IconLock style={{ color: '#9fb3c8' }} />}
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: b.earned ? 'var(--navy)' : 'var(--faint)' }}>{b.label}</span>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)', margin: '20px 0 12px' }}>Habilidades</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
          {skills.map((s) => (
            <div key={s.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 600, color: 'var(--navy)', marginBottom: 6 }}>
                <span>{s.label}</span>
                <span style={{ color: 'var(--muted)' }}>{s.value}%</span>
              </div>
              <div style={{ height: 8, borderRadius: 999, background: '#E8F0F8' }}>
                <div style={{ width: `${s.value}%`, height: '100%', borderRadius: 999, background: 'linear-gradient(90deg,var(--blue),var(--cyan))' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
