import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { OutlineButton, PrimaryButton, Screen, Txt, useToast } from '@/components/ui';
import { body, colors, head } from '@/constants/theme';
import { useAppState } from '@/context/AppState';
import { useData } from '@/store/DataProvider';

export default function LoginScreen() {
  const { signIn, signUp, demoLogin, demoMode } = useAppState();
  const { db } = useData();
  const profile = { accent: db.settings.accent };
  const showToast = useToast();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState(demoMode ? 'ana.torres@email.com' : '');
  const [password, setPassword] = useState(demoMode ? 'demo1234' : '');
  const [clientName, setClientName] = useState('');
  const [swimmerName, setSwimmerName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setError(null);
    if (!email.trim() || !password) return setError('Escribe tu correo y contraseña.');
    if (mode === 'signup' && (!clientName.trim() || !swimmerName.trim())) return setError('Escribe tu nombre y el del nadador.');
    setBusy(true);
    const res = mode === 'login' ? await signIn(email, password) : await signUp({ email, password, clientName: clientName.trim(), swimmerName: swimmerName.trim() });
    setBusy(false);
    if (res.error) setError(res.error);
    else if (mode === 'signup' && !demoMode) showToast('Cuenta creada. Revisa tu correo si te pedimos confirmarlo.');
  }

  async function biometric() {
    if (!demoMode) {
      showToast('Inicia sesión con tu correo la primera vez; luego podrás entrar con huella.');
      return;
    }
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const enrolled = hasHardware && (await LocalAuthentication.isEnrolledAsync());
      if (!enrolled) {
        await demoLogin();
        return;
      }
      const r = await LocalAuthentication.authenticateAsync({ promptMessage: 'Ingresa a Shark Swimming Club', cancelLabel: 'Cancelar' });
      if (r.success) await demoLogin();
    } catch {
      await demoLogin();
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen>
        <View style={{ alignItems: 'center', marginTop: 16 }}>
          <Image source={require('@/assets/images/splash-icon.png')} style={{ width: 150, height: 142 }} resizeMode="contain" accessibilityLabel="Shark Swimming Club" />
        </View>
        <Text style={[head(800), styles.title]}>{mode === 'login' ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}</Text>
        <Txt size={13.5} color={colors.muted} style={{ textAlign: 'center', marginTop: 6 }}>
          {mode === 'login' ? 'Ingresa para gestionar tus clases' : 'Registra a tu familia en el club'}
        </Txt>

        <View style={{ marginTop: 24, gap: 14 }}>
          {mode === 'signup' && (
            <>
              <Field label="Tu nombre" icon="user" value={clientName} onChangeText={setClientName} placeholder="Ej. Ana" />
              <Field label="Nombre del nadador" icon="smile" value={swimmerName} onChangeText={setSwimmerName} placeholder="Ej. Lucas" />
            </>
          )}
          <Field label="Correo" icon="mail" value={email} onChangeText={setEmail} placeholder="tu@correo.com" keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
          <Field
            label="Contraseña"
            icon="lock"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry={!showPassword}
            autoComplete={mode === 'login' ? 'password' : 'new-password'}
            right={
              <Pressable onPress={() => setShowPassword((s) => !s)} accessibilityLabel={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                <Feather name={showPassword ? 'eye-off' : 'eye'} size={19} color={colors.muted} />
              </Pressable>
            }
          />
          {mode === 'login' && (
            <Pressable onPress={() => showToast('Recuperación de contraseña: próximamente')} style={{ alignSelf: 'flex-end' }}>
              <Txt w={700} size={12.5} color={colors.blue}>¿Olvidaste tu contraseña?</Txt>
            </Pressable>
          )}
          {error && (
            <Txt size={12.5} w={600} color={colors.danger} style={{ textAlign: 'center' }}>{error}</Txt>
          )}
          <PrimaryButton label={busy ? 'Un momento…' : mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'} onPress={submit} disabled={busy} style={{ marginTop: 4 }} />
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Txt size={12} w={600} color={colors.faint}>o continúa con</Txt>
          <View style={styles.dividerLine} />
        </View>

        <OutlineButton label="Face ID / Huella" onPress={biometric} icon={<MaterialCommunityIcons name="fingerprint" size={22} color={profile.accent} />} />

        <Pressable onPress={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); }} style={{ marginTop: 18, alignItems: 'center' }}>
          <Txt size={13} w={600} color={colors.muted}>
            {mode === 'login' ? '¿Nuevo en el club? ' : '¿Ya tienes cuenta? '}
            <Txt size={13} w={700} color={colors.blue}>{mode === 'login' ? 'Crear cuenta' : 'Iniciar sesión'}</Txt>
          </Txt>
        </Pressable>

        <View style={{ flex: 1 }} />
        <View style={styles.secureRow}>
          <Feather name="shield" size={14} color={colors.success} />
          <Txt size={12} w={600} color={colors.muted}>Conexión cifrada de extremo a extremo</Txt>
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}

function Field({
  label,
  icon,
  right,
  ...input
}: { label: string; icon: React.ComponentProps<typeof Feather>['name']; right?: React.ReactNode } & React.ComponentProps<typeof TextInput>) {
  return (
    <View>
      <Txt w={700} size={12}>{label}</Txt>
      <View style={styles.field}>
        <Feather name={icon} size={19} color={colors.blue} />
        <TextInput placeholderTextColor={colors.faint} style={styles.input} {...input} />
        {right}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, color: colors.navy, textAlign: 'center', marginTop: 22, letterSpacing: -0.4 },
  field: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 7, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: 15, paddingVertical: 12, paddingHorizontal: 15 },
  input: { ...body(500), flex: 1, fontSize: 14, color: colors.navy, paddingVertical: 2 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  secureRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingTop: 18, paddingBottom: 6 },
});
