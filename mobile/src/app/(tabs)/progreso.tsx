import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, StyleSheet, Text, View } from 'react-native';

import { Screen, ScreenHeader, SectionLabel, Txt } from '@/components/ui';
import { colors, head } from '@/constants/theme';
import { useData } from '@/store/DataProvider';
import { attendanceRate, currentStudent } from '@/store/selectors';
import { levelProgress, ProgressRing } from './index';

export const BADGE_CATALOG: { label: string; colors: [string, string] }[] = [
  { label: 'Flotación', colors: ['#FFE9A8', '#F5A623'] },
  { label: 'Respiración', colors: ['#A8E6FF', '#16B5F7'] },
  { label: 'Crol 25m', colors: ['#C9F5DF', '#18B57A'] },
  { label: 'Espalda', colors: ['#C9B8FF', '#6F4AE0'] },
  { label: 'Pecho', colors: ['#FFC9D6', '#E0335B'] },
  { label: 'Mariposa', colors: ['#BFE6FF', '#0073CC'] },
];

export default function ProgressScreen() {
  const { db } = useData();
  const st = currentStudent(db);
  if (!st) {
    return (
      <Screen><ScreenHeader title="Progreso" /><Txt color={colors.muted}>No hay nadador registrado.</Txt></Screen>
    );
  }
  const pct = levelProgress(st.skills);
  const rate = attendanceRate(db, st.id);

  return (
    <Screen>
      <ScreenHeader title={`Progreso de ${st.name}`} />

      <LinearGradient colors={['#07336b', colors.blue, colors.cyan]} start={{ x: 0, y: 0 }} end={{ x: 1.2, y: 1 }} style={styles.hero}>
        <Image source={require('@/assets/images/android-icon-foreground.png')} style={styles.heroFin} />
        <ProgressRing value={pct} size={86} stroke={9} color={colors.cyan} track="rgba(255,255,255,0.22)" />
        <View>
          <Txt size={11} w={700} color="#bfe6ff" style={{ letterSpacing: 1 }}>NIVEL ACTUAL</Txt>
          <Text style={[head(800), { fontSize: 22, color: '#fff', marginTop: 4 }]}>{st.level}</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
            <View style={styles.pts}><Feather name="star" size={13} color="#FFD23F" /><Txt size={12} w={700} color="#fff">{st.points.toLocaleString('es-EC')} pts</Txt></View>
            {rate !== null && <View style={styles.pts}><Feather name="check" size={13} color="#fff" /><Txt size={12} w={700} color="#fff">{rate}% asistencia</Txt></View>}
          </View>
        </View>
      </LinearGradient>

      <SectionLabel>Insignias · {st.badges.length} de {BADGE_CATALOG.length}</SectionLabel>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {BADGE_CATALOG.map((b) => {
          const earned = st.badges.includes(b.label);
          return (
            <View key={b.label} style={{ width: '22%', alignItems: 'center', gap: 6 }}>
              <LinearGradient colors={earned ? b.colors : ['#EEF3F8', '#EEF3F8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.badge, !earned && styles.badgeLocked]}>
                <Feather name={earned ? 'star' : 'lock'} size={earned ? 26 : 22} color={earned ? '#fff' : colors.faint} />
              </LinearGradient>
              <Txt size={10} w={700} color={earned ? colors.navy : colors.faint}>{b.label}</Txt>
            </View>
          );
        })}
      </View>

      <SectionLabel style={{ marginTop: 20, marginBottom: 12 }}>Habilidades</SectionLabel>
      {st.skills.length === 0 && <Txt size={13} color={colors.muted}>El profesor aún no ha evaluado habilidades.</Txt>}
      <View style={{ gap: 13 }}>
        {st.skills.map((s) => (
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
  pts: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.16)', paddingVertical: 5, paddingHorizontal: 11, borderRadius: 999 },
  badge: { width: '100%', aspectRatio: 1, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  badgeLocked: { borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#cdd9e6' },
  track: { height: 8, borderRadius: 999, backgroundColor: '#E8F0F8', overflow: 'hidden' },
});
