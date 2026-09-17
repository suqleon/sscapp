import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { Avatar, Card, Screen, Txt } from '@/components/ui';
import { colors, head } from '@/constants/theme';
import { useAppState } from '@/context/AppState';

export function ProgressRing({ value, size = 58, stroke = 7, color, track = '#EAF1F8', label }: { value: number; size?: number; stroke?: number; color: string; track?: string; label?: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${c} ${c}`}
          strokeDashoffset={c * (1 - value / 100)}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <Text style={[head(800), { fontSize: size * 0.26, color: colors.navy }]}>{label ?? `${value}%`}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const { profile } = useAppState();
  const router = useRouter();

  const quick: { label: string; icon: React.ComponentProps<typeof Feather>['name']; to: '/reservar' | '/pagos' | '/horario' | '/mensajes'; accent?: boolean; color?: string }[] = [
    { label: 'Reservar', icon: 'calendar', to: '/reservar', accent: true },
    { label: 'Pagar', icon: 'credit-card', to: '/pagos', color: colors.blue },
    { label: 'Asistencia', icon: 'check-square', to: '/horario', color: colors.success },
    { label: 'Mensajes', icon: 'message-circle', to: '/mensajes', color: colors.blue },
  ];

  return (
    <Screen>
      <View style={styles.topRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Avatar initial={profile.clientName.charAt(0).toUpperCase()} colorsPair={[colors.cyan, colors.blue]} />
          <View>
            <Txt size={13} w={600} color={colors.muted}>Hola,</Txt>
            <Text style={[head(800), { fontSize: 19, color: colors.navy }]}>{profile.clientName}</Text>
          </View>
        </View>
        <Pressable onPress={() => router.push('/avisos')} style={styles.bell} accessibilityLabel="Avisos">
          <Feather name="bell" size={21} color={colors.navy} />
          <View style={[styles.bellDot, { backgroundColor: profile.accent }]} />
        </Pressable>
      </View>

      <Pressable onPress={() => router.push('/horario')} style={({ pressed }) => [{ marginTop: 18 }, pressed && { opacity: 0.9 }]}>
        <LinearGradient colors={['#07336b', colors.blue, colors.cyan]} start={{ x: 0, y: 0 }} end={{ x: 1.3, y: 1 }} style={styles.hero}>
          <Image source={require('@/assets/images/android-icon-foreground.png')} style={styles.heroFin} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Txt size={11} w={700} color="#bfe6ff" style={{ letterSpacing: 1 }}>PRÓXIMA CLASE</Txt>
            <View style={{ backgroundColor: colors.cyan, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 }}>
              <Txt size={11} w={700}>HOY</Txt>
            </View>
          </View>
          <Text style={[head(800), { fontSize: 23, color: '#fff', marginTop: 12 }]}>Nivel {profile.level}</Text>
          <Txt size={13} color="#cfe8ff" style={{ marginTop: 3 }}>Nadador: {profile.swimmerName} · Carril {profile.lane}</Txt>
          <View style={{ flexDirection: 'row', gap: 18, marginTop: 16 }}>
            <View style={styles.heroMeta}><Feather name="clock" size={16} color="#bfe6ff" /><Txt size={13.5} w={600} color="#fff">{profile.classTime}</Txt></View>
            <View style={styles.heroMeta}><Feather name="map-pin" size={16} color="#bfe6ff" /><Txt size={13.5} w={600} color="#fff">{profile.pool}</Txt></View>
          </View>
          <View style={styles.coachRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>
              <Avatar initial={profile.coach.charAt(0).toUpperCase()} colorsPair={['#ffd0c0', '#FF6A3D']} size={30} rounded={15} />
              <Txt size={13} w={600} color="#fff">Coach {profile.coach}</Txt>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Txt size={12.5} w={700} color="#fff">Ver detalles</Txt>
              <Feather name="chevron-right" size={15} color="#fff" />
            </View>
          </View>
        </LinearGradient>
      </Pressable>

      <View style={styles.quickGrid}>
        {quick.map((q) => (
          <Pressable key={q.label} onPress={() => router.push(q.to)} style={({ pressed }) => [styles.quickItem, pressed && { opacity: 0.8 }]}>
            <View style={[styles.quickIcon, q.accent ? { backgroundColor: profile.accent } : { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }]}>
              <Feather name={q.icon} size={23} color={q.accent ? '#fff' : q.color} />
            </View>
            <Txt size={11} w={700}>{q.label}</Txt>
          </Pressable>
        ))}
      </View>

      <Card onPress={() => router.push('/progreso')} style={{ marginTop: 18, flexDirection: 'row', alignItems: 'center', gap: 16, borderRadius: 20, padding: 16 }}>
        <ProgressRing value={75} color={profile.accent} />
        <View style={{ flex: 1 }}>
          <Text style={[head(700), { fontSize: 15, color: colors.navy }]}>Progreso de {profile.swimmerName}</Text>
          <Txt size={12.5} color={colors.muted} style={{ marginTop: 2 }}>3 de 4 clases esta semana</Txt>
        </View>
        <Feather name="chevron-right" size={20} color={colors.faint} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 92 },
  bell: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  bellDot: { position: 'absolute', top: 9, right: 10, width: 9, height: 9, borderRadius: 5, borderWidth: 2, borderColor: '#fff' },
  hero: { borderRadius: 24, padding: 20, overflow: 'hidden' },
  heroFin: { position: 'absolute', right: -30, bottom: -30, width: 170, height: 170, opacity: 0.16 },
  heroMeta: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  coachRow: { marginTop: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: 13, paddingVertical: 10, paddingHorizontal: 14 },
  quickGrid: { flexDirection: 'row', gap: 10, marginTop: 18 },
  quickItem: { flex: 1, alignItems: 'center', gap: 7 },
  quickIcon: { width: '100%', aspectRatio: 1, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
});
