import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { confirm } from '@/components/form';
import { Card, Pill, Screen, ScreenHeader, Txt, useToast } from '@/components/ui';
import { colors, head } from '@/constants/theme';
import { useData } from '@/store/DataProvider';
import { coachName, currentStudent, dayLabel, isBooked, spotsLeft, time12, todayISO, upcomingClasses } from '@/store/selectors';

export default function ScheduleScreen() {
  const { db, cancelBooking } = useData();
  const router = useRouter();
  const showToast = useToast();
  const accent = db.settings.accent;
  const st = currentStudent(db);
  const classes = upcomingClasses(db, 7);
  const days = [...new Set(classes.map((c) => c.date))];

  return (
    <Screen>
      <ScreenHeader title="Horario" onBack={() => router.back()} />
      {days.length === 0 && (
        <Card style={{ alignItems: 'center' }}><Txt size={13.5} color={colors.muted}>No hay clases programadas esta semana.</Txt></Card>
      )}
      {days.map((date) => (
        <View key={date}>
          <View style={styles.dayRow}>
            <Text style={[head(800), { fontSize: 14, color: colors.navy }]}>{dayLabel(date)}</Text>
            {date === todayISO() && <Pill color={accent} bg="rgba(255,106,61,0.12)">HOY</Pill>}
            <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
          </View>
          <View style={{ gap: 9 }}>
            {classes.filter((c) => c.date === date).map((c) => {
              const booked = st ? isBooked(db, st.id, c.id) : false;
              const left = spotsLeft(db, c);
              const status = booked ? 'Reservado' : c.special ? 'Especial' : left > 0 ? 'Disponible' : 'Lleno';
              const style = booked ? { color: colors.blue, bg: '#E8F2FD', bar: colors.cyan } : c.special ? { color: '#C77A0A', bg: colors.warnBg, bar: colors.warn } : left > 0 ? { color: colors.success, bg: colors.successBg, bar: colors.success } : { color: colors.faint, bg: '#EEF3F8', bar: '#cdd9e6' };
              return (
                <Pressable
                  key={c.id}
                  onPress={() => {
                    if (!st) return;
                    if (booked) confirm('Cancelar reserva', `¿Quitar a ${st.name} de "${c.title}" (${time12(c.time)})?`, () => { cancelBooking(st.id, c.id); showToast('Reserva cancelada'); });
                    else router.push('/reservar');
                  }}
                  style={({ pressed }) => pressed && { opacity: 0.8 }}>
                  <Card style={{ flexDirection: 'row', gap: 12, borderRadius: 16, padding: 14 }}>
                    <View style={{ width: 4, borderRadius: 4, backgroundColor: style.bar }} />
                    <View style={{ flex: 1 }}>
                      <Text style={[head(700), { fontSize: 14, color: colors.navy }]}>{c.title}</Text>
                      <Txt size={12} color={colors.muted} style={{ marginTop: 3 }}>{time12(c.time)} · Coach {coachName(db, c.coachId)}{c.lane ? ` · Carril ${c.lane}` : ''} · {c.pool}</Txt>
                    </View>
                    <View style={{ justifyContent: 'center' }}><Pill color={style.color} bg={style.bg}>{status}</Pill></View>
                  </Card>
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}
      {st && <Txt size={11.5} color={colors.faint} style={{ textAlign: 'center', marginTop: 18 }}>Toca una clase reservada para cancelarla.</Txt>}
    </Screen>
  );
}

const styles = StyleSheet.create({
  dayRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 16, marginBottom: 10 },
});
