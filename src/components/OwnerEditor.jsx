import { useAppState } from '../context/AppState';
import { IconEdit, IconX } from './Icons';

const fields = [
  { key: 'clientName', label: 'Nombre del cliente', group: 'Cliente' },
  { key: 'swimmerName', label: 'Nombre del nadador', group: 'Nadador' },
  { key: 'swimmerAge', label: 'Edad', group: 'Nadador' },
  { key: 'level', label: 'Nivel', group: 'Nadador' },
  { key: 'coach', label: 'Instructor / coach', group: 'Próxima clase' },
  { key: 'classTime', label: 'Hora', group: 'Próxima clase' },
  { key: 'lane', label: 'Carril', group: 'Próxima clase' },
  { key: 'pool', label: 'Alberca', group: 'Próxima clase' },
  { key: 'plan', label: 'Plan', group: 'Membresía' },
  { key: 'price', label: 'Precio mensual', group: 'Membresía' },
];

export default function OwnerEditor() {
  const { profile, updateProfile, resetProfile, editorOpen, setEditorOpen } = useAppState();

  const groups = [...new Set(fields.map((f) => f.group))];

  return (
    <>
      <button
        onClick={() => setEditorOpen(true)}
        style={{
          position: 'fixed',
          top: 'max(16px, env(safe-area-inset-top))',
          right: 16,
          zIndex: 60,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: '#07254F',
          color: '#fff',
          border: 'none',
          padding: '10px 15px',
          borderRadius: 999,
          fontFamily: 'Outfit, sans-serif',
          fontWeight: 700,
          fontSize: 12.5,
          cursor: 'pointer',
          boxShadow: '0 10px 22px -8px rgba(7,37,79,0.6)',
        }}
      >
        <IconEdit width={14} height={14} /> Editor
      </button>

      {editorOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 70,
            background: 'rgba(6,24,47,0.35)',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
          onClick={() => setEditorOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 'min(340px, 88vw)',
              height: '100%',
              background: '#fff',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-12px 0 40px -10px rgba(7,37,79,0.25)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 20px', borderBottom: '1px solid #EAF1F8' }}>
              <div>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 16, color: '#07254F' }}>Editor del dueño</div>
                <div style={{ fontSize: 11, color: '#9fb3c8', fontWeight: 600 }}>Los cambios se guardan en este dispositivo</div>
              </div>
              <button onClick={() => setEditorOpen(false)} style={{ width: 32, height: 32, borderRadius: 9, background: '#F2F8FD', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <IconX />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 20 }}>
                <input
                  type="color"
                  value={profile.accent}
                  onChange={(e) => updateProfile({ accent: e.target.value })}
                  style={{ width: 44, height: 44, border: 'none', borderRadius: 12, padding: 0, cursor: 'pointer' }}
                />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#07254F' }}>Color de acento</div>
                  <div style={{ fontSize: 11, color: '#9fb3c8' }}>Botones y resaltados</div>
                </div>
              </div>

              {groups.map((group) => (
                <div key={group}>
                  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: profile.accent, margin: '18px 0 10px' }}>{group}</div>
                  {fields.filter((f) => f.group === group).map((f) => (
                    <div key={f.key} style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#486a8c', marginBottom: 5 }}>{f.label}</div>
                      <input
                        type="text"
                        value={profile[f.key]}
                        onChange={(e) => updateProfile({ [f.key]: e.target.value })}
                        style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', border: '1.5px solid #dce6f0', borderRadius: 11, fontSize: 14, color: '#07254F', fontFamily: 'inherit' }}
                      />
                    </div>
                  ))}
                </div>
              ))}

              <button
                onClick={resetProfile}
                style={{ marginTop: 16, width: '100%', textAlign: 'center', padding: 12, border: '1.5px solid #E1ECF6', borderRadius: 12, fontWeight: 700, fontSize: 13, color: '#486a8c', background: 'none', cursor: 'pointer' }}
              >
                Restablecer valores
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
