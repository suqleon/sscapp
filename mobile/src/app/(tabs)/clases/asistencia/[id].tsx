import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar, Card, Pill, Screen, ScreenHeader, SectionLabel, Txt, useToast } from '@/components/ui';
import { colors, head } from '@/constants/theme';
import { useData } from '@/store/DataProvider';
import { bookingsFor, classById, coachName, dayLabel, studentById, time12 } from '@/store/selectors';

export default function AttendanceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { db, setAttendance, book, cancelBooking } = useData();
  const router = useRouter();
  const showToast = useToast();
  const cls = classById(db, id);

  if (!cls) {
    return (
      <Screen><ScreenHeader title="Pase de lista" onBack={() => router.back()} /><Txt color={colors.muted}>Esta clase ya no existe.</Txt></Screen>
    );
  }

  const enrolled = bookingsFor(db, cls.id).map((b) => studentById(db, b.studentId)).filter((s): s is NonNullable<typeof s> => !!s);
  const others = db.students.filter((s) => !enrolled.some((e) => e.id === s.id));
  const record = (studentId: string) => db.attendance.find((a) => a.classId === cls.id && a.studentId === studentId);
  const present = enrolled.filter((s) => record(s.id)?.present).length;

  return (
    <Screen>
      <ScreenHeader title="Pase de lista" onBack={() => router.back()} />
      <Card style={{ gap: 4 }}>
        <Text style={[head(800), { fontSize: 17, color: colors.navy }]}>{cls.title}</Text>
        <Txt size={12.5} color={colors.muted}>{dayLabel(cls.date)} · {time12(cls.time)} · Coach {coachName(db, cls.coachId)} · {cls.pool}</Txt>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
          <Pill color={colors.blue} bg="#E8F2FD">{enrolled.length} inscritos</Pill>
          <Pill color={colors.success} bg={colors.successBg}>{present} presentes</Pill>
        </View>
      </Card>

      <SectionLabel>Alumnos inscritos</SectionLabel>
      {enrolled.length === 0 && <Txt size={13} color={colors.muted}>Nadie inscrito todavía. Agrega alumnos abajo.</Txt>}
      <View style={{ gap: 8 }}>
        {enrolled.map((s) => {
          const r = record(s.id);
          return (
            <Card key={s.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 }}>
              <Avatar initial={s.name.charAt(0)} colorsPair={['#ffd0c0', '#FF6A3D']} size={38} rounded={11} />
              <View style={{ flex: 1 }}>
                <Txt w={700} size={14}>{s.name}</Txt>
                <Txt size={11.5} color={colors.muted}>{s.level} · {s.parentName}</Txt>
              </View>
              <View style={styles.seg}>
                <Pressable onPress={() => setAttendance(cls.id, s.id, true)} style={[styles.segBtn, r?.present === true && { backgroundColor: colors.success }]} accessibilityLabel={`${s.name} presente`}>
                  <Feather name="check" size={16} color={r?.present === true ? '#fff' : colors.muted} />
                </Pressable>
                <Pressable onPress={() => setAttendance(cls.id, s.id, false)} style={[styles.segBtn, r?.present === false && { backgroundColor: colors.danger }]} accessibilityLabel={`${s.name} ausente`}>
                  <Feather name="x" size={16} color={r?.present === false ? '#fff' : colors.muted} />
                </Pressable>
              </View>
              <Pressable onPress={() => { cancelBooking(s.id, cls.id); showToast(`${s.name} quitado de la clase`); }} accessibilityLabel={`Quitar a ${s.name}`} style={{ padding: 4 }}>
                <Feather name="minus-circle" size={18} color={colors.faint} />
              </Pressable>
            </Card>
          );
        })}
      </View>

      {others.length > 0 && (
        <>
          <SectionLabel>Agregar alumno a esta clase</SectionLabel>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {others.map((s) => (
              <Pressable
                key={s.id}
                onPress={() => { const r = book(s.id, cls.id); showToast(r.ok ? `${s.name} inscrito` : r.reason); }}
                style={styles.chip}>
                <Feather name="plus" size={13} color={colors.navy} />
                <Txt w={700} size={12.5}>{s.name}</Txt>
                <Txt size={11} color={colors.muted}>{s.level}</Txt>
              </Pressable>
            ))}
          </View>
        </>
      )}
      <Txt size={11.5} color={colors.faint} style={{ textAlign: 'center', marginTop: 18 }}>Los cambios se guardan automáticamente.</Txt>
    </Screen>
  );
}

const styles = StyleSheet.create({
  seg: { flexDirection: 'row', backgroundColor: '#EAF1F8', borderRadius: 10, padding: 3, gap: 3 },
  segBtn: { width: 34, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999, borderWidth: 1.5, borderColor: '#dce6f0', backgroundColor: '#fff' },
});
