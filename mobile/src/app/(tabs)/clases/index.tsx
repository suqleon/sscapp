import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card, Pill, Screen, ScreenHeader, Txt } from '@/components/ui';
import { colors, head } from '@/constants/theme';
import { useData } from '@/store/DataProvider';
import { isoDate } from '@/store/seed';
import { bookingsFor, classesOn, coachName, dayShort, monthLabel, parseISO, time12, todayISO } from '@/store/selectors';

export default function ClassesScreen() {
  const { db } = useData();
  const router = useRouter();
  const accent = db.settings.accent;
  const days = Array.from({ length: 7 }, (_, i) => isoDate(i));
  const [selectedDay, setSelectedDay] = useState(days[0]);
  const list = classesOn(db, selectedDay);

  return (
    <Screen>
      <ScreenHeader
        title="Clases"
        right={
          <Pressable onPress={() => router.push({ pathname: '/clases/[id]', params: { id: 'nuevo' } })} style={[styles.addBtn, { backgroundColor: accent }]} accessibilityLabel="Nueva clase">
            <Feather name="plus" size={18} color="#fff" />
            <Txt w={700} size={12.5} color="#fff">Nueva</Txt>
          </Pressable>
        }
      />
      <Txt w={700} size={13} style={{ marginBottom: 10 }}>{monthLabel(selectedDay)}</Txt>
      <View style={{ flexDirection: 'row', gap: 6 }}>
        {days.map((d) => {
          const active = d === selectedDay;
          const n = classesOn(db, d).length;
          return (
            <Pressable key={d} onPress={() => setSelectedDay(d)} style={[styles.day, active ? styles.dayActive : styles.dayIdle]}>
              <Txt size={10} w={active ? 700 : 600} color={active ? '#bfe6ff' : colors.muted}>{dayShort(d)}</Txt>
              <Text style={[head(800), { fontSize: 16, color: active ? '#fff' : colors.navy, marginTop: 2 }]}>{parseISO(d).getDate()}</Text>
              <Txt size={9} w={700} color={active ? '#fff' : n ? accent : 'transparent'}>{n || '·'}</Txt>
            </Pressable>
          );
        })}
      </View>

      <View style={{ gap: 10, marginTop: 18 }}>
        {list.length === 0 && (
          <Card style={{ alignItems: 'center', gap: 6 }}>
            <Txt size={13.5} color={colors.muted}>{selectedDay === todayISO() ? 'Hoy no hay clases.' : 'No hay clases este día.'}</Txt>
            <Pressable onPress={() => router.push({ pathname: '/clases/[id]', params: { id: 'nuevo', date: selectedDay } })}><Txt w={700} size={13} color={colors.blue}>Crear clase para este día</Txt></Pressable>
          </Card>
        )}
        {list.map((c) => {
          const booked = bookingsFor(db, c.id).length;
          return (
            <Card key={c.id} onPress={() => router.push({ pathname: '/clases/[id]', params: { id: c.id } })} style={{ gap: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ alignItems: 'center', minWidth: 52 }}>
                  <Text style={[head(800), { fontSize: 17, color: colors.navy }]}>{time12(c.time).split(' ')[0]}</Text>
                  <Txt size={10} w={700} color={colors.muted}>{time12(c.time).split(' ')[1]}</Txt>
                </View>
                <View style={{ width: 1, height: 38, backgroundColor: '#EAF1F8' }} />
                <View style={{ flex: 1 }}>
                  <Text style={[head(700), { fontSize: 14.5, color: colors.navy }]}>{c.title}</Text>
                  <Txt size={12} color={colors.muted}>Coach {coachName(db, c.coachId)} · {c.pool}{c.lane ? ` · Carril ${c.lane}` : ''}</Txt>
                </View>
                {c.special ? <Pill color="#C77A0A" bg={colors.warnBg}>Especial</Pill> : <Pill color={booked >= c.capacity ? colors.faint : colors.success} bg={booked >= c.capacity ? '#EEF3F8' : colors.successBg}>{booked}/{c.capacity}</Pill>}
              </View>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Pressable onPress={() => router.push({ pathname: '/clases/asistencia/[id]', params: { id: c.id } })} style={styles.miniBtn}>
                  <Feather name="check-square" size={14} color={colors.navy} />
                  <Txt w={700} size={12}>Pase de lista</Txt>
                </Pressable>
                <Pressable onPress={() => router.push({ pathname: '/clases/[id]', params: { id: c.id } })} style={styles.miniBtn}>
                  <Feather name="edit-2" size={14} color={colors.navy} />
                  <Txt w={700} size={12}>Editar</Txt>
                </Pressable>
              </View>
            </Card>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 9, paddingHorizontal: 13, borderRadius: 12, marginRight: 96 },
  day: { flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: 13 },
  dayIdle: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  dayActive: { backgroundColor: colors.blue },
  miniBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#EAF1F8', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
});
