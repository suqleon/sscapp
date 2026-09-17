import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card, IconBox, Screen, ScreenHeader, Txt } from '@/components/ui';
import { colors, head } from '@/constants/theme';
import { useData } from '@/store/DataProvider';
import { todayISO } from '@/store/selectors';
import type { Notice } from '@/store/types';

const iconStyle: Record<Notice['kind'], { name: 'clock' | 'star' | 'credit-card' | 'calendar' | 'bell'; color: string; bg: string }> = {
  clase: { name: 'clock', color: colors.blue, bg: '#EAF4FE' },
  insignia: { name: 'star', color: colors.warn, bg: colors.warnBg },
  pago: { name: 'credit-card', color: colors.success, bg: colors.successBg },
  horario: { name: 'calendar', color: '#6F4AE0', bg: '#F0EBFE' },
  general: { name: 'bell', color: colors.navy, bg: '#EAF1F8' },
};

export default function NoticesScreen() {
  const { db, markNoticesRead } = useData();
  const router = useRouter();
  const accent = db.settings.accent;
  const today = todayISO();
  const groups = [
    { label: 'HOY', items: db.notices.filter((n) => n.createdAt.slice(0, 10) === today) },
    { label: 'ANTERIORES', items: db.notices.filter((n) => n.createdAt.slice(0, 10) !== today) },
  ].filter((g) => g.items.length > 0);

  return (
    <Screen>
      <ScreenHeader title="Avisos" onBack={() => router.back()} right={<Pressable onPress={markNoticesRead}><Txt size={12} w={700} color={colors.blue}>Marcar leídas</Txt></Pressable>} />
      {groups.length === 0 && <Txt color={colors.muted}>No hay avisos todavía.</Txt>}
      {groups.map((group) => (
        <View key={group.label}>
          <Txt size={11} w={700} color={colors.faint} style={{ letterSpacing: 0.8, marginTop: 14, marginBottom: 8 }}>{group.label}</Txt>
          <View style={{ gap: 9 }}>
            {group.items.map((item) => {
              const ic = iconStyle[item.kind];
              return (
                <Card key={item.id} style={{ flexDirection: 'row', gap: 13, borderRadius: 16, padding: 14 }}>
                  <IconBox name={ic.name} color={ic.color} bg={ic.bg} />
                  <View style={{ flex: 1 }}>
                    <Text style={[head(700), { fontSize: 13.5, color: colors.navy }]}>{item.title}</Text>
                    <Txt size={12} color={colors.muted} style={{ marginTop: 3, lineHeight: 17 }}>{item.body}</Txt>
                  </View>
                  {!item.read && <View style={[styles.dot, { backgroundColor: accent }]} />}
                </Card>
              );
            })}
          </View>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({ dot: { width: 8, height: 8, borderRadius: 4, marginTop: 4 } });
