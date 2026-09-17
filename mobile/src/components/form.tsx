import { Feather } from '@expo/vector-icons';
import { Alert, Platform, Pressable, StyleSheet, TextInput, View, type KeyboardTypeOptions } from 'react-native';

import { Txt } from '@/components/ui';
import { body, colors } from '@/constants/theme';

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  multiline,
  autoCapitalize,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words';
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Txt w={700} size={12} color="#486a8c" style={{ marginBottom: 5 }}>{label}</Txt>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.faint}
        keyboardType={keyboardType}
        multiline={multiline}
        autoCapitalize={autoCapitalize}
        style={[styles.input, multiline && { minHeight: 80, textAlignVertical: 'top' }]}
      />
    </View>
  );
}

export function Row2({ children }: { children: React.ReactNode }) {
  return <View style={{ flexDirection: 'row', gap: 12 }}>{children}</View>;
}

export function Chips<T extends string>({
  label,
  options,
  value,
  onChange,
  accent = colors.navy,
}: {
  label?: string;
  options: { value: T; label: string }[];
  value: T | undefined;
  onChange: (v: T) => void;
  accent?: string;
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      {label && <Txt w={700} size={12} color="#486a8c" style={{ marginBottom: 6 }}>{label}</Txt>}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {options.map((o) => {
          const active = o.value === value;
          return (
            <Pressable key={o.value} onPress={() => onChange(o.value)} style={[styles.chip, active && { backgroundColor: accent, borderColor: accent }]}>
              <Txt w={700} size={12.5} color={active ? '#fff' : colors.navy}>{o.label}</Txt>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function Stepper({ label, value, onChange, min = 0, max = 100, step = 5 }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 }}>
      <Txt w={600} size={13.5} style={{ flex: 1 }}>{label}</Txt>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Pressable onPress={() => onChange(Math.max(min, value - step))} style={styles.stepBtn} accessibilityLabel={`Bajar ${label}`}>
          <Feather name="minus" size={16} color={colors.navy} />
        </Pressable>
        <Txt w={800} size={14} style={{ minWidth: 42, textAlign: 'center' }}>{value}{max === 100 ? '%' : ''}</Txt>
        <Pressable onPress={() => onChange(Math.min(max, value + step))} style={styles.stepBtn} accessibilityLabel={`Subir ${label}`}>
          <Feather name="plus" size={16} color={colors.navy} />
        </Pressable>
      </View>
    </View>
  );
}

export function DangerButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.danger, pressed && { opacity: 0.7 }]}>
      <Feather name="trash-2" size={16} color={colors.danger} />
      <Txt w={700} size={14} color={colors.danger}>{label}</Txt>
    </Pressable>
  );
}

/** Cross-platform confirm: Alert on native, window.confirm on web (RN-web's Alert has no buttons). */
export function confirm(title: string, message: string, onConfirm: () => void) {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.confirm(`${title}\n\n${message}`)) onConfirm();
    return;
  }
  Alert.alert(title, message, [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Sí, continuar', style: 'destructive', onPress: onConfirm },
  ]);
}

const styles = StyleSheet.create({
  input: { ...body(500), borderWidth: 1.5, borderColor: '#dce6f0', borderRadius: 12, paddingVertical: 11, paddingHorizontal: 13, fontSize: 14.5, color: colors.navy, backgroundColor: '#fff' },
  chip: { paddingVertical: 8, paddingHorizontal: 13, borderRadius: 999, borderWidth: 1.5, borderColor: '#dce6f0', backgroundColor: '#fff' },
  stepBtn: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#EAF1F8', alignItems: 'center', justifyContent: 'center' },
  danger: { marginTop: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 16, borderWidth: 1.5, borderColor: '#f3d4d0', backgroundColor: '#fff' },
});
