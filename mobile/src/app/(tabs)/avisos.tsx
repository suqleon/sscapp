import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card, IconBox, Screen, ScreenHeader, Txt } from '@/components/ui';
import { colors, head } from '@/constants/theme';
import { useAppState } from '@/context/AppState';
import { getNotices, type Notice } from '@/data/mockData';

const iconStyle: Record<Notice['icon'], { color: string; bg: string }> = {
  clock: { color: colors.blue, bg: '#EAF4FE' },
  star: { color: colors.warn, bg: colors.warnBg },
  'credit-card': { color: colors.success, bg: colors.successBg },
  calendar: { color: '#6F4AE0', bg: '#F0EBFE' },
};

export default function NoticesScreen() {
  const { profile } = useAppState();
  const router = useRouter();
  const [groups, setGroups] = useState(() => getNotices(profile));

  function markAllRead() {
    setGroups((prev) => prev.map((g) => ({ ...g, items: g.items.map((it) => ({ ...it, unread: false })) })));
  }

  return (
    <Screen>
      <ScreenHeader
        title="Avisos"
        onBack={() => router.back()}
        right={
          <Pressable onPress={markAllRead}>
            <Txt size={12} w={700} color={colors.blue}>Marcar leídas</Txt>
          </Pressable>
        }
      />
      {groups.map((group) => (
        <View key={group.group}>
          <Txt size={11} w={700} color={colors.faint} style={{ letterSpacing: 0.8, marginTop: 14, marginBottom: 8 }}>{group.group.toUpperCase()}</Txt>
          <View style={{ gap: 9 }}>
            {group.items.map((item) => (
              <Card key={item.title} style={{ flexDirection: 'row', gap: 13, borderRadius: 16, padding: 14 }}>
                <IconBox name={item.icon} color={iconStyle[item.icon].color} bg={iconStyle[item.icon].bg} />
                <View style={{ flex: 1 }}>
                  <Text style={[head(700), { fontSize: 13.5, color: colors.navy }]}>{item.title}</Text>
                  <Txt size={12} color={colors.muted} style={{ marginTop: 3, lineHeight: 17 }}>{item.body}</Txt>
                </View>
                {item.unread && <View style={[styles.dot, { backgroundColor: profile.accent }]} />}
              </Card>
            ))}
          </View>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 4 },
});
