import { useState } from 'react';
import { useAppState } from '../context/AppState';
import BottomNav from '../components/BottomNav';
import { getConversations } from '../data/mockData';
import { IconSearch, IconPlus, IconChevronLeft, IconSend } from '../components/Icons';

function Avatar({ conv }) {
  if (conv.avatar.type === 'initial') {
    return (
      <div style={{ width: 50, height: 50, borderRadius: '50%', background: conv.avatar.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 17, flex: 'none' }}>
        {conv.name.replace('Coach ', '').charAt(0)}
      </div>
    );
  }
  return <div style={{ width: 50, height: 50, borderRadius: '50%', background: conv.avatar.gradient, flex: 'none' }} />;
}

export default function Messages() {
  const { profile } = useAppState();
  const conversations = getConversations(profile);
  const [openId, setOpenId] = useState(null);
  const [draft, setDraft] = useState('');
  const [extraMessages, setExtraMessages] = useState({});

  const open = conversations.find((c) => c.id === openId);

  function send() {
    if (!draft.trim() || !open) return;
    setExtraMessages((prev) => ({
      ...prev,
      [open.id]: [...(prev[open.id] || []), { from: 'me', text: draft.trim() }],
    }));
    setDraft('');
  }

  if (open) {
    const thread = [...open.thread, ...(extraMessages[open.id] || [])];
    return (
      <div className="app-shell" style={{ '--accent-color': profile.accent }}>
        <div className="screen" style={{ display: 'flex', flexDirection: 'column', paddingBottom: 12 }}>
          <div className="screen-header">
            <button className="back-btn" onClick={() => setOpenId(null)} aria-label="Volver">
              <IconChevronLeft style={{ color: 'var(--navy)' }} />
            </button>
            <div className="screen-title">{open.name}</div>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
            {thread.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.from === 'me' ? 'flex-end' : 'flex-start',
                  background: m.from === 'me' ? 'var(--blue)' : '#fff',
                  color: m.from === 'me' ? '#fff' : 'var(--navy)',
                  border: m.from === 'me' ? 'none' : '1px solid var(--border)',
                  borderRadius: 16,
                  padding: '10px 14px',
                  maxWidth: '80%',
                  fontSize: 13.5,
                }}
              >
                {m.text}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <div className="input-field" style={{ flex: 1 }}>
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Escribe un mensaje…"
              />
            </div>
            <button onClick={send} style={{ width: 46, height: 46, borderRadius: 14, background: 'var(--accent-color)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flex: 'none' }}>
              <IconSend style={{ color: '#fff' }} />
            </button>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="app-shell" style={{ '--accent-color': profile.accent }}>
      <div className="screen">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="screen-title">Mensajes</div>
          <div style={{ width: 40, height: 40, borderRadius: 13, background: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconPlus style={{ color: '#fff' }} />
          </div>
        </div>
        <div className="input-field" style={{ marginTop: 14, marginBottom: 6 }}>
          <IconSearch style={{ color: 'var(--faint)' }} />
          <input placeholder="Buscar conversación" readOnly />
        </div>

        {conversations.map((c, i) => (
          <div key={c.id}>
            <button
              onClick={() => setOpenId(c.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '12px 4px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
            >
              <Avatar conv={c} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 14.5, color: 'var(--navy)' }}>{c.name}</span>
                  <span style={{ fontSize: 11, color: 'var(--faint)' }}>{c.time}</span>
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.preview}</div>
              </div>
              {c.unread > 0 && (
                <span style={{ width: 21, height: 21, borderRadius: '50%', background: 'var(--accent-color)', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                  {c.unread}
                </span>
              )}
            </button>
            {i < conversations.length - 1 && <div style={{ height: 1, background: '#EAF1F8', marginLeft: 63 }} />}
          </div>
        ))}
      </div>
      <BottomNav />
    </div>
  );
}
