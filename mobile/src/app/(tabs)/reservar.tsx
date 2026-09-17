import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AccentButton, Card, Pill, Screen, ScreenHeader, SectionLabel, Txt, useToast } from '@/components/ui';
import { colors, head } from '@/constants/theme';
import { useData } from '@/store/DataProvider';
import { isoDate } from '@/store/seed';
import { classesOn, coachName, currentStudent, dayShort, isBooked, monthLabel, parseISO, spotsLeft, time12 } from '@/store/selectors';

export default function BookScreen() {
  const { db, book } = useData();
  const router = useRouter();
  const showToast = useToast();
  const accent = db.settings.accent;
  const st = currentStudent(db);
  const days = Array.from({ length: 7 }, (_, i) => isoDate(i));
  const [selectedDay, setSelectedDay] = useState(days[0]);
  const slots = classesOn(db, selectedDay);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const chosen = slots.find((c) => c.id === selectedId) ?? slots.find((c) => st && !isBooked(db, st.id, c.id) && spotsLeft(db, c) > 0);

  function confirm() {
    if (!st || !chosen) return;
    const r = book(st.id, chosen.id);
    if (!r.ok) return showToast(r.reason);
    showToast(`Reserva confirmada · ${time12(chosen.time)}`);
    setTimeout(() => router.push('/horario'), 900);
  }

  return (
    <Screen>
      <ScreenHeader title="Reservar clase" />
      <Txt w={700} size={13} style={{ marginBottom: 10 }}>{monthLabel(selectedDay)}</Txt>
      <View style={{ flexDirection: 'row', gap: 6 }}>
        {days.map((d) => {
          const active = d === selectedDay;
          const has = classesOn(db, d).length > 0;
          return (
            <Pressable key={d} onPress={() => { setSelectedDay(d); setSelectedId(null); }} style={[styles.day, active ? styles.dayActive : styles.dayIdle]}>
              <Txt size={10} w={active ? 700 : 600} color={active ? '#bfe6ff' : colors.muted}>{dayShort(d)}</Txt>
              <Text style={[head(800), { fontSize: 16, color: active ? '#fff' : colors.navy, marginTop: 2 }]}>{parseISO(d).getDate()}</Text>
              <View style={{ width: 5, height: 5, borderRadius: 3, marginTop: 4, backgroundColor: has ? (active ? '#fff' : accent) : 'transparent' }} />
            </Pressable>
          );
        })}
      </View>

      <SectionLabel>Horarios disponibles{st ? ` · ${st.name}` : ''}</SectionLabel>
      {slots.length === 0 && (
        <Card style={{ alignItems: 'center' }}>
          <Txt size={13.5} color={colors.muted}>No hay clases programadas este día.</Txt>
        </Card>
      )}
      <View style={{ gap: 10 }}>
        {slots.map((cls) => {
          const booked = st ? isBooked(db, st.id, cls.id) : false;
          const left = spotsLeft(db, cls);
          const full = left <= 0 && !booked;
          const isSelected = chosen?.id === cls.id && !booked && !full;
          return (
            <Pressable key={cls.id} disabled={full || booked} onPress={() => setSelectedId(cls.id)} style={[styles.slot, isSelected ? styles.slotSelected : styles.slotIdle, full && { opacity: 0.55 }]}>
              <View style={{ alignItems: 'center', minWidth: 52 }}>
                <Text style={[head(800), { fontSize: 17, color: isSelected ? colors.blue : colors.navy }]}>{time12(cls.time).split(' ')[0]}</Text>
                <Txt size={10} w={700} color={colors.muted}>{time12(cls.time).split(' ')[1]}</Txt>
              </View>
              <View style={{ width: 1, height: 38, backgroundColor: '#EAF1F8' }} />
              <View style={{ flex: 1 }}>
                <Text style={[head(700), { fontSize: 14.5, color: colors.navy }]}>{cls.title}</Text>
                <Txt size={12} color={colors.muted} style={{ marginTop: 2 }}>Coach {coachName(db, cls.coachId)} · {left} {left === 1 ? 'lugar' : 'lugares'}{cls.level !== st?.level ? ` · ${cls.level}` : ''}</Txt>
              </View>
              {booked ? (
                <Pill color={colors.blue} bg="#E8F2FD">Reservado</Pill>
              ) : full ? (
                <Pill color={colors.faint} bg="#EEF3F8">Lleno</Pill>
              ) : isSelected ? (
                <View style={styles.check}><Feather name="check" size={15} color="#fff" /></View>
              ) : (
                <Pill color={colors.success} bg={colors.successBg}>Libre</Pill>
              )}
            </Pressable>
          );
        })}
      </View>

      {chosen && st && (
        <AccentButton label={`Confirmar reserva · ${time12(chosen.time)}`} onPress={confirm} style={{ marginTop: 18 }} />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  day: { flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: 13 },
  dayIdle: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  dayActive: { backgroundColor: colors.blue },
  slot: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 18, padding: 14 },
  slotIdle: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  slotSelected: { backgroundColor: '#EAF4FE', borderWidth: 2, borderColor: colors.blue },
  check: { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.blue, alignItems: 'center', justifyContent: 'center' },
});
