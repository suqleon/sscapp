import { Feather } from '@expo/vector-icons';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Txt } from '@/components/ui';
import { body, colors, head } from '@/constants/theme';
import { useAppState } from '@/context/AppState';
import type { Profile } from '@/data/mockData';

type Field = { key: keyof Profile; label: string; group: string; keyboard?: 'default' | 'numeric' };

const fields: Field[] = [
  { key: 'clientName', label: 'Nombre del cliente', group: 'Cliente' },
  { key: 'swimmerName', label: 'Nombre del nadador', group: 'Nadador' },
  { key: 'swimmerAge', label: 'Edad', group: 'Nadador', keyboard: 'numeric' },
  { key: 'level', label: 'Nivel', group: 'Nadador' },
  { key: 'coach', label: 'Instructor / coach', group: 'Próxima clase' },
  { key: 'classTime', label: 'Hora', group: 'Próxima clase' },
  { key: 'lane', label: 'Carril', group: 'Próxima clase' },
  { key: 'pool', label: 'Alberca', group: 'Próxima clase' },
  { key: 'plan', label: 'Plan', group: 'Membresía' },
  { key: 'price', label: 'Precio mensual', group: 'Membresía' },
];

const accentChoices = ['#FF6A3D', '#0073CC', '#16B5F7', '#18B57A', '#F5A623', '#6F4AE0', '#E0335B'];

export default function OwnerEditor() {
  const { profile, updateProfile, resetProfile, editorOpen, setEditorOpen, demoMode } = useAppState();
  const insets = useSafeAreaInsets();
  const groups = [...new Set(fields.map((f) => f.group))];

  return (
    <>
      <Pressable onPress={() => setEditorOpen(true)} style={[styles.fab, { top: insets.top + 10 }]} accessibilityLabel="Abrir editor del dueño">
        <Feather name="edit-2" size={14} color="#fff" />
        <Text style={[head(700), { color: '#fff', fontSize: 12.5 }]}>Editor</Text>
      </Pressable>

      <Modal visible={editorOpen} transparent animationType="fade" onRequestClose={() => setEditorOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setEditorOpen(false)} />
        <View style={[styles.panel, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 12 }]}>
          <View style={styles.panelHeader}>
            <View>
              <Text style={[head(800), { fontSize: 16, color: colors.navy }]}>Editor del dueño</Text>
              <Txt size={11} w={600} color={colors.faint}>
                {demoMode ? 'Los cambios se guardan en este dispositivo' : 'Los cambios se guardan en tu cuenta'}
              </Txt>
            </View>
            <Pressable onPress={() => setEditorOpen(false)} style={styles.closeBtn} accessibilityLabel="Cerrar">
              <Feather name="x" size={17} color={colors.navy} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }} keyboardShouldPersistTaps="handled">
            <Txt w={800} size={11} color={profile.accent} style={styles.groupLabel}>COLOR DE ACENTO</Txt>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {accentChoices.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => updateProfile({ accent: c })}
                  accessibilityLabel={`Color ${c}`}
                  style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: c, borderWidth: profile.accent === c ? 3 : 0, borderColor: colors.navy }}
                />
              ))}
            </View>

            {groups.map((group) => (
              <View key={group}>
                <Txt w={800} size={11} color={profile.accent} style={styles.groupLabel}>{group.toUpperCase()}</Txt>
                {fields
                  .filter((f) => f.group === group)
                  .map((f) => (
                    <View key={f.key} style={{ marginBottom: 12 }}>
                      <Txt w={700} size={12} color="#486a8c" style={{ marginBottom: 5 }}>{f.label}</Txt>
                      <TextInput
                        value={String(profile[f.key])}
                        onChangeText={(v) => updateProfile({ [f.key]: v } as Partial<Profile>)}
                        keyboardType={f.keyboard ?? 'default'}
                        style={styles.input}
                      />
                    </View>
                  ))}
              </View>
            ))}

            <Pressable onPress={resetProfile} style={styles.resetBtn}>
              <Txt w={700} size={13} color="#486a8c">Restablecer valores</Txt>
            </Pressable>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 16,
    zIndex: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: colors.navy,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(6,24,47,0.35)' },
  panel: { position: 'absolute', top: 0, right: 0, bottom: 0, width: '86%', maxWidth: 360, backgroundColor: '#fff' },
  panelHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: '#EAF1F8', marginBottom: 6 },
  closeBtn: { width: 32, height: 32, borderRadius: 9, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  groupLabel: { letterSpacing: 1, marginTop: 18, marginBottom: 10 },
  input: { ...body(500), borderWidth: 1.5, borderColor: '#dce6f0', borderRadius: 11, paddingVertical: 10, paddingHorizontal: 12, fontSize: 14, color: colors.navy, backgroundColor: '#fff' },
  resetBtn: { marginTop: 16, alignItems: 'center', paddingVertical: 12, borderWidth: 1.5, borderColor: '#E1ECF6', borderRadius: 12 },
});
