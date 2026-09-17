import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar, Card, Divider, OutlineButton, Pill, Screen, Toggle, Txt, useToast } from '@/components/ui';
import { colors, head } from '@/constants/theme';
import { useAppState } from '@/context/AppState';

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

export default function ProfileScreen() {
  const { profile, signOut, demoMode } = useAppState();
  const showToast = useToast();
  const [twoFA, setTwoFA] = useState(true);
  const [biometric, setBiometric] = useState(true);
  const soon = () => showToast('Sección en desarrollo');

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingRight: 92 }}>
        <Avatar initial={profile.clientName.charAt(0).toUpperCase()} colorsPair={[colors.cyan, colors.blue]} size={58} rounded={18} />
        <View style={{ flex: 1 }}>
          <Text style={[head(800), { fontSize: 19, color: colors.navy }]}>{profile.clientName}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 }}>
            <Feather name="shield" size={13} color={colors.success} />
            <Txt size={12} w={700} color={colors.success}>{demoMode ? 'Modo demostración' : 'Cuenta verificada'}</Txt>
          </View>
        </View>
      </View>

      <Card style={{ marginTop: 14, flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, paddingVertical: 12, paddingHorizontal: 14 }}>
        <Avatar initial={profile.swimmerName.charAt(0).toUpperCase()} colorsPair={['#ffd0c0', '#FF6A3D']} size={38} rounded={11} />
        <View style={{ flex: 1 }}>
          <Text style={[head(700), { fontSize: 14, color: colors.navy }]}>
            {profile.swimmerName}{profile.swimmerAge ? ` · ${profile.swimmerAge} años` : ''}
          </Text>
          <Txt size={12} color={colors.muted}>Nadador · Nivel {profile.level}</Txt>
        </View>
      </Card>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 18, marginBottom: 10 }}>
        <Feather name="shield" size={15} color={profile.accent} />
        <Text style={[head(800), { fontSize: 13, color: colors.navy }]}>Seguridad</Text>
      </View>
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <Row icon={<Feather name="lock" size={19} color={colors.blue} />} label="Verificación en dos pasos" right={<Toggle on={twoFA} onChange={() => setTwoFA((v) => !v)} />} />
        <Divider inset={15} />
        <Row icon={<MaterialCommunityIcons name="fingerprint" size={20} color={colors.blue} />} label="Acceso con Face ID / huella" right={<Toggle on={biometric} onChange={() => setBiometric((v) => !v)} />} />
        <Divider inset={15} />
        <Row icon={<Feather name="shield" size={19} color={colors.success} />} label="Datos cifrados extremo a extremo" right={<Pill color={colors.success} bg={colors.successBg}>Activo</Pill>} />
      </Card>

      <Text style={[head(800), { fontSize: 13, color: colors.navy, marginTop: 16, marginBottom: 10 }]}>Datos del nadador</Text>
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <Row icon={<Feather name="activity" size={19} color={profile.accent} />} label="Información médica" right={<Feather name="chevron-right" size={17} color={colors.faint} />} onPress={soon} />
        <Divider inset={15} />
        <Row icon={<Feather name="phone" size={19} color={colors.blue} />} label="Contactos de emergencia" right={<Feather name="chevron-right" size={17} color={colors.faint} />} onPress={soon} />
        <Divider inset={15} />
        <Row icon={<Feather name="user-check" size={19} color={colors.success} />} label="Autorizados para recoger" right={<Feather name="chevron-right" size={17} color={colors.faint} />} onPress={soon} />
      </Card>

      <OutlineButton label="Cerrar sesión" color={colors.danger} onPress={signOut} style={{ marginTop: 20, borderColor: '#f3d4d0' }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, paddingHorizontal: 15 },
});
