import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { confirm } from '@/components/form';
import { Avatar, Card, Pill, Screen, ScreenHeader, SectionLabel, Txt, useToast } from '@/components/ui';
import { colors, head } from '@/constants/theme';
import { useData } from '@/store/DataProvider';
import { dateShort, money, monthKey, monthLabel, pendingThisMonth, planFor, revenueForMonth, studentById, todayISO } from '@/store/selectors';

const methodLabel = { efectivo: 'Efectivo', transferencia: 'Transfer.', tarjeta: 'Tarjeta' } as const;

export default function PaymentsAdmin() {
  const { db, removePayment } = useData();
  const router = useRouter();
  const showToast = useToast();
  const accent = db.settings.accent;
  const mk = monthKey(todayISO());
  const pending = pendingThisMonth(db);
  const revenue = revenueForMonth(db);
  const monthPayments = db.payments.filter((p) => monthKey(p.date) === mk);
  const expected = pending.reduce((s, st) => s + (planFor(db, st)?.price ?? 0), 0);
  const recent = [...db.payments].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 30);

  return (
    <Screen>
      <ScreenHeader
        title="Pagos"
        right={
          <Pressable onPress={() => router.push({ pathname: '/cobros/nuevo', params: {} })} style={[styles.addBtn, { backgroundColor: accent }]} accessibilityLabel="Registrar pago">
            <Feather name="plus" size={18} color="#fff" />
            <Txt w={700} size={12.5} color="#fff">Registrar</Txt>
          </Pressable>
        }
      />
      <Txt size={13} color={colors.muted} style={{ marginTop: -6 }}>{monthLabel(todayISO())}</Txt>

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
        <Card style={{ flex: 1, gap: 4 }}>
          <Txt size={11} w={700} color={colors.muted}>COBRADO</Txt>
          <Text style={[head(800), { fontSize: 22, color: colors.success }]}>{money(revenue)}</Text>
          <Txt size={11.5} color={colors.muted}>{monthPayments.length} pagos</Txt>
        </Card>
        <Card style={{ flex: 1, gap: 4 }}>
          <Txt size={11} w={700} color={colors.muted}>POR COBRAR</Txt>
          <Text style={[head(800), { fontSize: 22, color: pending.length ? '#C77A0A' : colors.navy }]}>{money(expected)}</Text>
          <Txt size={11.5} color={colors.muted}>{pending.length} alumnos</Txt>
        </Card>
      </View>

      <SectionLabel>Pendientes este mes</SectionLabel>
      {pending.length === 0 && <Card style={{ alignItems: 'center' }}><Txt size={13.5} color={colors.success} w={600}>✓ Todos los alumnos con plan están al día.</Txt></Card>}
      <View style={{ gap: 8 }}>
        {pending.map((s) => {
          const plan = planFor(db, s);
          return (
            <Card key={s.id} onPress={() => router.push({ pathname: '/cobros/nuevo', params: { studentId: s.id } })} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 }}>
              <Avatar initial={s.name.charAt(0)} colorsPair={['#FFE9A8', '#F5A623']} size={38} rounded={11} />
              <View style={{ flex: 1 }}>
                <Txt w={700} size={14}>{s.name}</Txt>
                <Txt size={11.5} color={colors.muted}>{s.parentName} · {plan?.name ?? 'Sin plan'}{s.parentPhone ? ` · ${s.parentPhone}` : ''}</Txt>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 4 }}>
                <Txt w={800} size={14}>{money(plan?.price ?? 0)}</Txt>
                <Pill color="#C77A0A" bg={colors.warnBg}>Registrar</Pill>
              </View>
            </Card>
          );
        })}
      </View>

      <SectionLabel>Últimos pagos</SectionLabel>
      {recent.length === 0 && <Txt size={13} color={colors.muted}>Aún no hay pagos registrados.</Txt>}
      <View style={{ gap: 8 }}>
        {recent.map((p) => {
          const s = studentById(db, p.studentId);
          return (
            <Card key={p.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 }}>
              <View style={styles.okIcon}><Feather name="check" size={16} color={colors.success} /></View>
              <View style={{ flex: 1 }}>
                <Txt w={700} size={13.5}>{s?.name ?? 'Alumno eliminado'} · {p.concept}</Txt>
                <Txt size={11.5} color={colors.muted}>{dateShort(p.date)} · {methodLabel[p.method]}</Txt>
              </View>
              <Txt w={800} size={14}>{money(p.amount)}</Txt>
              <Pressable onPress={() => confirm('Eliminar pago', `¿Borrar el pago de ${money(p.amount)} de ${s?.name ?? 'este alumno'}?`, () => { removePayment(p.id); showToast('Pago eliminado'); })} accessibilityLabel="Eliminar pago" style={{ padding: 4 }}>
                <Feather name="trash-2" size={16} color={colors.faint} />
              </Pressable>
            </Card>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 9, paddingHorizontal: 13, borderRadius: 12, marginRight: 96 },
  okIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: colors.successBg, alignItems: 'center', justifyContent: 'center' },
});
