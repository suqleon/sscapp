import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, type ReactNode } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar, Card, Divider, OutlineButton, Pill, Screen, Toggle, Txt } from '@/components/ui';
import { colors, head } from '@/constants/theme';
import { useAppState } from '@/context/AppState';
import { useData } from '@/store/DataProvider';
import { currentStudent, planFor } from '@/store/selectors';

function Row({ icon, label, right, onPress }: { icon: ReactNode; label: string; right: ReactNode; onPress?: () => void }) {
  const content = (
    <View style={styles.row}>
      {icon}
      <Txt size={13.5} w={600} style={{ flex: 1 }}>{label}</Txt>
      {right}
    </View>
  );
  return onPress ? <Pressable onPress={onPress} style={({ pressed }) => pressed && { opacity: 0.7 }}>{content}</Pressable> : content;
}

function showInfo(title: string, text?: string) {
  const msg = text?.trim() || 'Sin información registrada. El equipo del club puede completarla desde la ficha del alumno.';
  if (Platform.OS === 'web') window.alert(`${title}\n\n${msg}`);
  else Alert.alert(title, msg);
}

export default function ProfileScreen() {
  const { signOut, demoMode, setEditorOpen } = useAppState();
  const { db, updateSettings } = useData();
  const accent = db.settings.accent;
  const role = db.settings.viewAs;
  const st = currentStudent(db);
  const siblings = st ? db.students.filter((s) => s.parentName === st.parentName) : [];
  const [twoFA, setTwoFA] = useState(true);
  const [biometric, setBiometric] = useState(true);

  const holder = role === 'cliente' ? st?.parentName ?? 'Cliente' : role === 'instructor' ? `Profesor · ${db.coaches[0]?.name ?? ''}` : `Dueño · ${db.settings.clubName}`;

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingRight: 100 }}>
        <Avatar initial={holder.charAt(0).toUpperCase()} colorsPair={[colors.cyan, colors.blue]} size={58} rounded={18} />
        <View style={{ flex: 1 }}>
          <Text style={[head(800), { fontSize: 18, color: colors.navy }]} numberOfLines={1}>{holder}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 }}>
            <Feather name="shield" size={13} color={colors.success} />
            <Txt size={12} w={700} color={colors.success}>{demoMode ? 'Datos guardados en este dispositivo' : 'Cuenta verificada'}</Txt>
          </View>
        </View>
      </View>

      {role === 'cliente' && (
        <View style={{ gap: 8, marginTop: 14 }}>
          {siblings.map((s) => {
            const active = s.id === st?.id;
            const plan = planFor(db, s);
            return (
              <Card key={s.id} onPress={() => updateSettings({ currentStudentId: s.id })} style={[{ flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, paddingVertical: 12, paddingHorizontal: 14 }, active && { borderColor: accent, borderWidth: 1.5 }]}>
                <Avatar initial={s.name.charAt(0).toUpperCase()} colorsPair={['#ffd0c0', '#FF6A3D']} size={38} rounded={11} />
                <View style={{ flex: 1 }}>
                  <Text style={[head(700), { fontSize: 14, color: colors.navy }]}>{s.name}{s.age ? ` · ${s.age} años` : ''}</Text>
                  <Txt size={12} color={colors.muted}>Nivel {s.level}{plan ? ` · ${plan.name}` : ''}</Txt>
                </View>
                {active && siblings.length > 1 && <Pill color={accent} bg="rgba(255,106,61,0.12)">Viendo</Pill>}
              </Card>
            );
          })}
        </View>
      )}

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 18, marginBottom: 10 }}>
        <Feather name="shield" size={15} color={accent} />
        <Text style={[head(800), { fontSize: 13, color: colors.navy }]}>Seguridad</Text>
      </View>
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <Row icon={<Feather name="lock" size={19} color={colors.blue} />} label="Verificación en dos pasos" right={<Toggle on={twoFA} onChange={() => setTwoFA((v) => !v)} />} />
        <Divider inset={15} />
        <Row icon={<MaterialCommunityIcons name="fingerprint" size={20} color={colors.blue} />} label="Acceso con Face ID / huella" right={<Toggle on={biometric} onChange={() => setBiometric((v) => !v)} />} />
        <Divider inset={15} />
        <Row icon={<Feather name="shield" size={19} color={colors.success} />} label="Datos cifrados extremo a extremo" right={<Pill color={colors.success} bg={colors.successBg}>Activo</Pill>} />
      </Card>

      {role === 'cliente' && st && (
        <>
          <Text style={[head(800), { fontSize: 13, color: colors.navy, marginTop: 16, marginBottom: 10 }]}>Datos de {st.name}</Text>
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <Row icon={<Feather name="activity" size={19} color={accent} />} label="Información médica" right={<Feather name="chevron-right" size={17} color={colors.faint} />} onPress={() => showInfo('Información médica', st.medical)} />
            <Divider inset={15} />
            <Row icon={<Feather name="phone" size={19} color={colors.blue} />} label="Contactos de emergencia" right={<Feather name="chevron-right" size={17} color={colors.faint} />} onPress={() => showInfo('Contactos de emergencia', st.emergencyContact)} />
            <Divider inset={15} />
            <Row icon={<Feather name="user-check" size={19} color={colors.success} />} label="Autorizados para recoger" right={<Feather name="chevron-right" size={17} color={colors.faint} />} onPress={() => showInfo('Autorizados para recoger', st.authorizedPickup)} />
          </Card>
        </>
      )}

      <OutlineButton label="Cambiar de vista (cliente / equipo)" onPress={() => setEditorOpen(true)} icon={<Feather name="sliders" size={16} color={colors.navy} />} style={{ marginTop: 20 }} />
      <OutlineButton label="Cerrar sesión" color={colors.danger} onPress={signOut} style={{ marginTop: 10, borderColor: '#f3d4d0' }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, paddingHorizontal: 15 },
});
