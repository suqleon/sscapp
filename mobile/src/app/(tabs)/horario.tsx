import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card, Pill, Screen, ScreenHeader, Txt } from '@/components/ui';
import { colors, head } from '@/constants/theme';
import { useAppState } from '@/context/AppState';
import { getWeekSchedule } from '@/data/mockData';

const statusStyle = {
  Reservado: { color: colors.blue, bg: '#E8F2FD' },
  Disponible: { color: colors.success, bg: colors.successBg },
  Especial: { color: '#C77A0A', bg: colors.warnBg },
} as const;

export default function ScheduleScreen() {
  const { profile } = useAppState();
  const router = useRouter();
  const [view, setView] = useState<'semana' | 'mes'>('semana');
  const days = getWeekSchedule(profile);

  return (
    <Screen>
      <ScreenHeader
        title="Horario"
        onBack={() => router.back()}
        right={
          <View style={styles.segment}>
            {(['semana', 'mes'] as const).map((v) => (
              <Pressable key={v} onPress={() => setView(v)} style={[styles.segmentBtn, view === v && { backgroundColor: colors.blue }]}>
                <Txt size={12} w={700} color={view === v ? '#fff' : colors.muted}>{v === 'semana' ? 'Semana' : 'Mes'}</Txt>
              </Pressable>
            ))}
          </View>
        }
      />

      {view === 'mes' ? (
        <Card style={{ marginTop: 8, alignItems: 'center' }}>
          <Txt size={13.5} color={colors.muted}>La vista mensual llega en una próxima versión.</Txt>
        </Card>
      ) : (
        days.map((day) => (
          <View key={day.day}>
            <View style={styles.dayRow}>
              <Text style={[head(800), { fontSize: 14, color: colors.navy }]}>{day.day}</Text>
              {day.isToday && <Pill color={profile.accent} bg="rgba(255,106,61,0.12)">HOY</Pill>}
              <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
            </View>
            <View style={{ gap: 9 }}>
              {day.classes.map((c) => (
                <Card key={c.title} style={{ flexDirection: 'row', gap: 12, borderRadius: 16, padding: 14 }}>
                  <View style={{ width: 4, borderRadius: 4, backgroundColor: c.color }} />
                  <View style={{ flex: 1 }}>
                    <Text style={[head(700), { fontSize: 14, color: colors.navy }]}>{c.title}</Text>
                    <Txt size={12} color={colors.muted} style={{ marginTop: 3 }}>{c.subtitle}</Txt>
                  </View>
                  <View style={{ justifyContent: 'center' }}>
                    <Pill color={statusStyle[c.status].color} bg={statusStyle[c.status].bg}>{c.status}</Pill>
                  </View>
                </Card>
              ))}
            </View>
          </View>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  segment: { flexDirection: 'row', backgroundColor: '#E8F0F8', borderRadius: 12, padding: 3 },
  segmentBtn: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 9 },
  dayRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 16, marginBottom: 10 },
});
