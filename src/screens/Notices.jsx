import { useState } from 'react';
import { useAppState } from '../context/AppState';
import BottomNav from '../components/BottomNav';
import { getNotices } from '../data/mockData';
import { IconClock, IconStar, IconCard, IconCalendar } from '../components/Icons';

const iconMap = {
  clock: { Icon: IconClock, bg: '#EAF4FE', color: 'var(--blue)' },
  star: { Icon: IconStar, bg: '#FDF1DD', color: 'var(--warn)' },
  card: { Icon: IconCard, bg: 'var(--success-bg)', color: 'var(--success)' },
  calendar: { Icon: IconCalendar, bg: '#F0EBFE', color: '#6F4AE0' },
};

export default function Notices() {
  const { profile } = useAppState();
  const [groups, setGroups] = useState(() => getNotices(profile));

  function markAllRead() {
    setGroups((prev) => prev.map((g) => ({ ...g, items: g.items.map((it) => ({ ...it, unread: false })) })));
  }

  return (
    <div className="app-shell" style={{ '--accent-color': profile.accent }}>
      <div className="screen">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="screen-title">Avisos</div>
          <button onClick={markAllRead} style={{ fontSize: 12, fontWeight: 700, color: 'var(--blue)', background: 'none', border: 'none', cursor: 'pointer' }}>
            Marcar leídas
          </button>
        </div>

        {groups.map((group) => (
          <div key={group.group}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--faint)', textTransform: 'uppercase', margin: '16px 0 8px' }}>{group.group}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {group.items.map((item) => {
                const { Icon, bg, color } = iconMap[item.icon];
                return (
                  <div key={item.title} style={{ display: 'flex', gap: 13, background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                      <Icon style={{ color }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 13.5, color: 'var(--navy)' }}>{item.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3, lineHeight: 1.4 }}>{item.body}</div>
                    </div>
                    {item.unread && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-color)', flex: 'none', marginTop: 4 }} />}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <BottomNav />
    </div>
  );
}
