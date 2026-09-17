import { Feather } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card, Pill, Screen, ScreenHeader, SectionLabel, Txt } from '@/components/ui';
import { colors, head } from '@/constants/theme';
import { useData } from '@/store/DataProvider';
import { bookingsFor, classesOn, coachName, money, pendingThisMonth, revenueForMonth, time12, todayISO } from '@/store/selectors';

function Kpi({ label, value, icon, color, onPress }: { label: string; value: string; icon: React.ComponentProps<typeof Feather>['name']; color: string; onPress?: () => void }) {
  return (
    <Card onPress={onPress} style={{ flex: 1, minWidth: '46%', gap: 8 }}>
      <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: color + '22', alignItems: 'center', justifyContent: 'center' }}>
        <Feather name={icon} size={18} color={color} />
      </View>
      <Text style={[head(800), { fontSize: 22, color: colors.navy }]}>{value}</Text>
      <Txt size={12} w={600} color={colors.muted}>{label}</Txt>
    </Card>
  );
}

export default function TeamHome() {
  const { db } = useData();
  const router = useRouter();
  const role = db.settings.viewAs;
  const today = todayISO();
  const todayClasses = classesOn(db, today);
  const pending = pendingThisMonth(db);
  const revenue = revenueForMonth(db);

  if (role === 'cliente') return <Redirect href="/" />;

  return (
    <Screen>
      <ScreenHeader title="Equipo" right={<View style={{ marginRight: 96 }}><Pill color={colors.blue} bg="#E8F2FD">{role === 'admin' ? 'Dueño / contadora' : 'Profesor'}</Pill></View>} />
      <Txt size={13} color={colors.muted} style={{ marginTop: -6 }}>{db.settings.clubName} · resumen de hoy</Txt>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 16 }}>
        <Kpi label="Clases hoy" value={String(todayClasses.length)} icon="calendar" color={colors.blue} onPress={() => router.push('/clases')} />
        <Kpi label="Alumnos activos" value={String(db.students.length)} icon="users" color={colors.success} onPress={() => router.push('/alumnos')} />
        {role === 'admin' && (
          <>
            <Kpi label="Pagos pendientes" value={String(pending.length)} icon="alert-circle" color={pending.length ? colors.warn : colors.success} onPress={() => router.push('/cobros')} />
            <Kpi label="Ingresos del mes" value={money(revenue)} icon="trending-up" color={colors.navy} onPress={() => router.push('/cobros')} />
          </>
        )}
      </View>

      <SectionLabel>Clases de hoy · pase de lista</SectionLabel>
      {todayClasses.length === 0 && (
        <Card style={{ alignItems: 'center', gap: 6 }}>
          <Txt size={13.5} color={colors.muted}>No hay clases programadas hoy.</Txt>
          <Pressable onPress={() => router.push({ pathname: '/clases/[id]', params: { id: 'nuevo' } })}><Txt w={700} size={13} color={colors.blue}>Crear una clase</Txt></Pressable>
        </Card>
      )}
      <View style={{ gap: 9 }}>
        {todayClasses.map((c) => {
          const booked = bookingsFor(db, c.id).length;
          const marked = db.attendance.filter((a) => a.classId === c.id).length;
          return (
            <Card key={c.id} onPress={() => router.push({ pathname: '/clases/asistencia/[id]', params: { id: c.id } })} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, padding: 14 }}>
              <View style={{ alignItems: 'center', minWidth: 52 }}>
                <Text style={[head(800), { fontSize: 16, color: colors.navy }]}>{time12(c.time).split(' ')[0]}</Text>
                <Txt size={10} w={700} color={colors.muted}>{time12(c.time).split(' ')[1]}</Txt>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[head(700), { fontSize: 14, color: colors.navy }]}>{c.title}</Text>
                <Txt size={12} color={colors.muted}>Coach {coachName(db, c.coachId)} · {booked}/{c.capacity} inscritos</Txt>
              </View>
              <Pill color={marked ? colors.success : colors.faint} bg={marked ? colors.successBg : '#EEF3F8'}>{marked ? `${marked} marcados` : 'Sin marcar'}</Pill>
            </Card>
          );
        })}
      </View>

      {role === 'admin' && (
        <>
          <SectionLabel>Administración</SectionLabel>
          <View style={{ gap: 9 }}>
            <Card onPress={() => router.push('/equipo/exportar')} style={styles.action}>
              <Feather name="download" size={20} color={colors.blue} />
              <View style={{ flex: 1 }}>
                <Txt w={700} size={14}>Exportar datos</Txt>
                <Txt size={12} color={colors.muted}>Alumnos, pagos, asistencia y clases a Excel (CSV)</Txt>
              </View>
              <Feather name="chevron-right" size={18} color={colors.faint} />
            </Card>
            <Card onPress={() => router.push('/equipo/planes')} style={styles.action}>
              <Feather name="settings" size={20} color={colors.navy} />
              <View style={{ flex: 1 }}>
                <Txt w={700} size={14}>Planes, precios y profesores</Txt>
                <Txt size={12} color={colors.muted}>{db.plans.length} planes · {db.coaches.length} profesores</Txt>
              </View>
              <Feather name="chevron-right" size={18} color={colors.faint} />
            </Card>
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  action: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
});
