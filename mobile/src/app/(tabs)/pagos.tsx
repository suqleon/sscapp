import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { Card, Divider, Screen, ScreenHeader, SectionLabel, Txt, useToast } from '@/components/ui';
import { colors, head } from '@/constants/theme';
import { useAppState } from '@/context/AppState';
import { paymentHistory } from '@/data/mockData';

export default function PaymentsScreen() {
  const { profile } = useAppState();
  const router = useRouter();
  const showToast = useToast();

  return (
    <Screen>
      <ScreenHeader title="Membresía" onBack={() => router.back()} />

      <LinearGradient colors={['#07336b', colors.blueDeep, colors.blue]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cardHero}>
        <Image source={require('@/assets/images/android-icon-foreground.png')} style={styles.heroFin} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View>
            <Txt size={11} w={700} color="#bfe6ff" style={{ letterSpacing: 1 }}>{profile.plan.toUpperCase()}</Txt>
            <Text style={[head(800), { fontSize: 19, color: '#fff', marginTop: 4 }]}>Shark Club</Text>
          </View>
          <View style={{ backgroundColor: colors.cyan, paddingHorizontal: 11, paddingVertical: 5, borderRadius: 999 }}>
            <Txt size={10.5} w={700}>ACTIVA</Txt>
          </View>
        </View>
        <View style={{ marginTop: 34, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <View>
            <Txt size={10} w={600} color="#9cc6ee">TITULAR</Txt>
            <Txt size={14.5} w={700} color="#fff" style={{ marginTop: 2 }}>{profile.clientName}</Txt>
          </View>
          <View>
            <Txt size={10} w={600} color="#9cc6ee">VÁLIDA HASTA</Txt>
            <Txt size={14.5} w={700} color="#fff" style={{ marginTop: 2 }}>08 / 26</Txt>
          </View>
        </View>
      </LinearGradient>

      <Card style={{ marginTop: 16, flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 }}>
        <View style={{ flex: 1 }}>
          <Text style={[head(700), { fontSize: 15, color: colors.navy }]}>{profile.price} / mes</Text>
          <Txt size={12} color={colors.muted} style={{ marginTop: 2 }}>Renueva el 8 de julio · 8 clases</Txt>
        </View>
        <Pressable onPress={() => showToast('Cambio de plan próximamente')}>
          <Txt size={12} w={700} color={colors.blue}>Cambiar</Txt>
        </Pressable>
      </Card>

      <SectionLabel>Método de pago</SectionLabel>
      <Card onPress={() => showToast('Gestión de método de pago próximamente')} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 16 }}>
        <View style={styles.visa}><Text style={[head(800), { color: '#fff', fontSize: 11 }]}>VISA</Text></View>
        <Txt size={13.5} w={600} style={{ flex: 1 }}>•••• 4821</Txt>
        <Feather name="chevron-right" size={18} color={colors.faint} />
      </Card>

      <SectionLabel>Historial</SectionLabel>
      {paymentHistory.map((p, i) => (
        <View key={p.label}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 11, paddingHorizontal: 2 }}>
            <View style={styles.okIcon}><Feather name="check" size={17} color={colors.success} /></View>
            <View style={{ flex: 1 }}>
              <Txt size={13.5} w={700}>{p.label}</Txt>
              <Txt size={11.5} color={colors.muted}>{p.date}</Txt>
            </View>
            <Txt size={13.5} w={700}>{profile.price}</Txt>
          </View>
          {i < paymentHistory.length - 1 && <Divider />}
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  cardHero: { borderRadius: 22, padding: 20, minHeight: 150, overflow: 'hidden' },
  heroFin: { position: 'absolute', right: -30, bottom: -36, width: 170, height: 170, opacity: 0.16 },
  visa: { width: 42, height: 30, borderRadius: 6, backgroundColor: '#1a1f71', alignItems: 'center', justifyContent: 'center' },
  okIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: colors.successBg, alignItems: 'center', justifyContent: 'center' },
});
