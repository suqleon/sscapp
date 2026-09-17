import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, StyleSheet, Text, View } from 'react-native';

import { Screen, ScreenHeader, SectionLabel, Txt } from '@/components/ui';
import { colors, head } from '@/constants/theme';
import { useAppState } from '@/context/AppState';
import { badges, skills } from '@/data/mockData';
import { ProgressRing } from './index';

export default function ProgressScreen() {
  const { profile } = useAppState();

  return (
    <Screen>
      <ScreenHeader title={`Progreso de ${profile.swimmerName}`} />

      <LinearGradient colors={['#07336b', colors.blue, colors.cyan]} start={{ x: 0, y: 0 }} end={{ x: 1.2, y: 1 }} style={styles.hero}>
        <Image source={require('@/assets/images/android-icon-foreground.png')} style={styles.heroFin} />
        <ProgressRing value={75} size={86} stroke={9} color={colors.cyan} track="rgba(255,255,255,0.22)" />
        <View>
          <Txt size={11} w={700} color="#bfe6ff" style={{ letterSpacing: 1 }}>NIVEL ACTUAL</Txt>
          <Text style={[head(800), { fontSize: 22, color: '#fff', marginTop: 4 }]}>{profile.level}</Text>
          <View style={styles.pts}>
            <Feather name="star" size={13} color="#FFD23F" />
            <Txt size={12} w={700} color="#fff">1,240 pts</Txt>
          </View>
        </View>
      </LinearGradient>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 18, marginBottom: 10 }}>
        <Txt w={700} size={13}>Insignias</Txt>
        <Txt w={700} size={12} color={colors.blue}>Ver todas</Txt>
      </View>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        {badges.map((b) => (
          <View key={b.label} style={{ flex: 1, alignItems: 'center', gap: 6 }}>
            <LinearGradient colors={[b.colors[0], b.colors[1]]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.badge, !b.earned && styles.badgeLocked]}>
              <Feather name={b.earned ? 'star' : 'lock'} size={b.earned ? 26 : 22} color={b.earned ? '#fff' : colors.faint} />
            </LinearGradient>
            <Txt size={10} w={700} color={b.earned ? colors.navy : colors.faint}>{b.label}</Txt>
          </View>
        ))}
      </View>

      <SectionLabel style={{ marginTop: 20, marginBottom: 12 }}>Habilidades</SectionLabel>
      <View style={{ gap: 13 }}>
        {skills.map((s) => (
          <View key={s.label}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Txt size={12.5} w={600}>{s.label}</Txt>
              <Txt size={12.5} w={600} color={colors.muted}>{s.value}%</Txt>
            </View>
            <View style={styles.track}>
              <LinearGradient colors={[colors.blue, colors.cyan]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ width: `${s.value}%`, height: '100%', borderRadius: 999 }} />
            </View>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { borderRadius: 24, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 18, overflow: 'hidden' },
  heroFin: { position: 'absolute', right: -24, top: -24, width: 140, height: 140, opacity: 0.18 },
  pts: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, backgroundColor: 'rgba(255,255,255,0.16)', paddingVertical: 5, paddingHorizontal: 11, borderRadius: 999, alignSelf: 'flex-start' },
  badge: { width: '100%', aspectRatio: 1, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  badgeLocked: { borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#cdd9e6' },
  track: { height: 8, borderRadius: 999, backgroundColor: '#E8F0F8', overflow: 'hidden' },
});
