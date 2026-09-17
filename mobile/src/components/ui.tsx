import { Feather } from '@expo/vector-icons';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { body, colors, head, radius } from '@/constants/theme';
import { useData } from '@/store/DataProvider';

// ---------- layout ----------

export function Screen({ children, scroll = true, style }: { children: ReactNode; scroll?: boolean; style?: StyleProp<ViewStyle> }) {
  const insets = useSafeAreaInsets();
  const padTop = insets.top + 14;
  if (!scroll) {
    return <View style={[styles.screen, { paddingTop: padTop }, style]}>{children}</View>;
  }
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={[styles.screen, { paddingTop: padTop }, style]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  );
}

export function ScreenHeader({ title, onBack, right }: { title: string; onBack?: () => void; right?: ReactNode }) {
  return (
    <View style={styles.header}>
      {onBack && (
        <Pressable onPress={onBack} style={styles.backBtn} accessibilityLabel="Volver">
          <Feather name="chevron-left" size={22} color={colors.navy} />
        </Pressable>
      )}
      <Text style={styles.title}>{title}</Text>
      <View style={{ flex: 1 }} />
      {right}
    </View>
  );
}

// ---------- text ----------

export function Txt({
  children,
  w = 400,
  size = 13.5,
  color = colors.navy,
  style,
  numberOfLines,
}: {
  children: ReactNode;
  w?: 400 | 500 | 600 | 700 | 800;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
}) {
  return (
    <Text numberOfLines={numberOfLines} style={[body(w), { fontSize: size, color }, style]}>
      {children}
    </Text>
  );
}

export function Head({ children, size = 21, w = 800, color = colors.navy, style }: { children: ReactNode; size?: number; w?: 600 | 700 | 800; color?: string; style?: StyleProp<TextStyle> }) {
  return <Text style={[head(w), { fontSize: size, color, letterSpacing: -0.3 }, style]}>{children}</Text>;
}

export function SectionLabel({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  return <Txt w={700} size={13} style={[{ marginTop: 18, marginBottom: 10 }, style]}>{children}</Txt>;
}

// ---------- surfaces ----------

export function Card({ children, style, onPress }: { children: ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void }) {
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [styles.card, style, pressed && { opacity: 0.85 }]}>
        {children}
      </Pressable>
    );
  }
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Divider({ inset = 0 }: { inset?: number }) {
  return <View style={{ height: 1, backgroundColor: '#EAF1F8', marginLeft: inset }} />;
}

export function Pill({ children, color, bg }: { children: ReactNode; color: string; bg: string }) {
  return (
    <View style={{ backgroundColor: bg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, alignSelf: 'flex-start' }}>
      <Txt w={700} size={11} color={color}>{children}</Txt>
    </View>
  );
}

export function IconBox({ name, color, bg, size = 40, iconSize = 20 }: { name: React.ComponentProps<typeof Feather>['name']; color: string; bg: string; size?: number; iconSize?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size * 0.3, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
      <Feather name={name} size={iconSize} color={color} />
    </View>
  );
}

export function Avatar({ initial, colorsPair, size = 46, rounded = 15 }: { initial: string; colorsPair: [string, string]; size?: number; rounded?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: rounded, backgroundColor: colorsPair[1], alignItems: 'center', justifyContent: 'center' }}>
      <Text style={[head(800), { color: '#fff', fontSize: size * 0.4 }]}>{initial}</Text>
    </View>
  );
}

// ---------- controls ----------

type BtnProps = { label: string; onPress: () => void; disabled?: boolean; style?: StyleProp<ViewStyle>; icon?: ReactNode };

export function PrimaryButton({ label, onPress, disabled, style }: BtnProps) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [styles.btn, styles.btnPrimary, style, (pressed || disabled) && { opacity: 0.7 }]}>
      <Text style={[head(700), styles.btnText]}>{label}</Text>
    </Pressable>
  );
}

export function AccentButton({ label, onPress, disabled, style }: BtnProps) {
  const { db } = useData();
  return (
    <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [styles.btn, { backgroundColor: db.settings.accent }, style, (pressed || disabled) && { opacity: 0.7 }]}>
      <Text style={[head(700), styles.btnText]}>{label}</Text>
    </Pressable>
  );
}

export function OutlineButton({ label, onPress, disabled, style, icon, color = colors.navy }: BtnProps & { color?: string }) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [styles.btn, styles.btnOutline, style, pressed && { opacity: 0.7 }]}>
      {icon}
      <Text style={[body(700), { color, fontSize: 14 }]}>{label}</Text>
    </Pressable>
  );
}

export function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <Pressable onPress={onChange} accessibilityRole="switch" accessibilityState={{ checked: on }} style={{ width: 42, height: 24, borderRadius: 999, backgroundColor: on ? colors.success : '#D7E3EF', justifyContent: 'center' }}>
      <View style={{ position: 'absolute', left: on ? 20 : 2, width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff' }} />
    </Pressable>
  );
}

// ---------- toast ----------

const ToastCtx = createContext<(msg: string) => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<string | null>(null);
  const show = useCallback((m: string) => setMsg(m), []);
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), 2200);
    return () => clearTimeout(t);
  }, [msg]);
  return (
    <ToastCtx.Provider value={show}>
      <View style={{ flex: 1 }}>
        {children}
        {msg && (
          <View pointerEvents="none" style={styles.toast}>
            <Text style={[body(600), { color: '#fff', fontSize: 13.5, textAlign: 'center' }]}>{msg}</Text>
          </View>
        )}
      </View>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  return useContext(ToastCtx);
}

const styles = StyleSheet.create({
  screen: { paddingHorizontal: 22, paddingBottom: 28, backgroundColor: colors.bg, flexGrow: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 },
  backBtn: { width: 40, height: 40, borderRadius: 13, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  title: { ...head(800), fontSize: 21, color: colors.navy, letterSpacing: -0.3 },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, padding: 15 },
  btn: { paddingVertical: 15, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10 },
  btnPrimary: { backgroundColor: colors.blue },
  btnOutline: { backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border },
  btnText: { color: '#fff', fontSize: 16 },
  toast: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 96,
    backgroundColor: colors.navy,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 999,
    alignItems: 'center',
  },
});
