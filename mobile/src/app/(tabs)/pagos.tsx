import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';

import { Card, Divider, Pill, Screen, ScreenHeader, SectionLabel, Txt } from '@/components/ui';
import { colors, head } from '@/constants/theme';
import { useData } from '@/store/DataProvider';
import { currentStudent, dateShort, money, monthKey, paymentsFor, planFor, todayISO } from '@/store/selectors';

const methodLabel = { efectivo: 'Efectivo', transferencia: 'Transferencia', tarjeta: 'Tarjeta' } as const;

export default function PaymentsScreen() {
  const { db } = useData();
  const router = useRouter();
  const st = currentStudent(db);
  const plan = planFor(db, st);
  const payments = st ? paymentsFor(db, st.id) : [];
  const paidThisMonth = payments.some((p) => monthKey(p.date) === monthKey(todayISO()));
  const last = payments[0];

  return (
    <Screen>
      <ScreenHeader title="Membresía" onBack={() => router.back()} />

      <LinearGradient colors={['#07336b', colors.blueDeep, colors.blue]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cardHero}>
        <Image source={require('@/assets/images/android-icon-foreground.png')} style={styles.heroFin} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View>
            <Txt size={11} w={700} color="#bfe6ff" style={{ letterSpacing: 1 }}>{(plan?.name ?? 'SIN PLAN').toUpperCase()}</Txt>
            <Text style={[head(800), { fontSize: 19, color: '#fff', marginTop: 4 }]}>{db.settings.clubName}</Text>
          </View>
          <View style={{ backgroundColor: paidThisMonth ? colors.cyan : colors.warn, paddingHorizontal: 11, paddingVertical: 5, borderRadius: 999 }}>
            <Txt size={10.5} w={700}>{paidThisMonth ? 'AL DÍA' : 'PENDIENTE'}</Txt>
          </View>
        </View>
        <View style={{ marginTop: 34, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <View>
            <Txt size={10} w={600} color="#9cc6ee">TITULAR</Txt>
            <Txt size={14.5} w={700} color="#fff" style={{ marginTop: 2 }}>{st?.parentName ?? '—'}</Txt>
          </View>
          <View>
            <Txt size={10} w={600} color="#9cc6ee">ÚLTIMO PAGO</Txt>
            <Txt size={14.5} w={700} color="#fff" style={{ marginTop: 2 }}>{last ? dateShort(last.date) : '—'}</Txt>
          </View>
        </View>
      </LinearGradient>

      <Card style={{ marginTop: 16, flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 }}>
        <View style={{ flex: 1 }}>
          <Text style={[head(700), { fontSize: 15, color: colors.navy }]}>{plan ? `${money(plan.price)} / mes` : 'Sin plan asignado'}</Text>
          <Txt size={12} color={colors.muted} style={{ marginTop: 2 }}>{plan ? `${plan.classesPerMonth} clases al mes · ${st?.name}` : 'Pide en recepción que te asignen un plan.'}</Txt>
        </View>
        {!paidThisMonth && plan && <Pill color="#C77A0A" bg={colors.warnBg}>Mes pendiente</Pill>}
      </Card>

      <SectionLabel>Cómo pagar</SectionLabel>
      <Card style={{ gap: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}><Feather name="dollar-sign" size={16} color={colors.success} /><Txt size={13} w={600}>Efectivo o transferencia en recepción</Txt></View>
        <Txt size={12} color={colors.muted}>El equipo registra el pago y aquí aparece confirmado. El pago con tarjeta desde la app llega en una próxima versión.</Txt>
      </Card>

      <SectionLabel>Historial</SectionLabel>
      {payments.length === 0 && <Txt size={13} color={colors.muted}>Aún no hay pagos registrados.</Txt>}
      {payments.map((p, i) => (
        <View key={p.id}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 11, paddingHorizontal: 2 }}>
            <View style={styles.okIcon}><Feather name="check" size={17} color={colors.success} /></View>
            <View style={{ flex: 1 }}>
              <Txt size={13.5} w={700}>{p.concept}</Txt>
              <Txt size={11.5} color={colors.muted}>{dateShort(p.date)} · {methodLabel[p.method]}</Txt>
            </View>
            <Txt size={13.5} w={700}>{money(p.amount)}</Txt>
          </View>
          {i < payments.length - 1 && <Divider />}
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  cardHero: { borderRadius: 22, padding: 20, minHeight: 150, overflow: 'hidden' },
  heroFin: { position: 'absolute', right: -30, bottom: -36, width: 170, height: 170, opacity: 0.16 },
  okIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: colors.successBg, alignItems: 'center', justifyContent: 'center' },
});
