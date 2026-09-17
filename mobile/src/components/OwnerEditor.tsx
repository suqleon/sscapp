import { Feather } from '@expo/vector-icons';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Txt } from '@/components/ui';
import { body, colors, head } from '@/constants/theme';
import { useAppState } from '@/context/AppState';
import { useData } from '@/store/DataProvider';
import type { Role } from '@/store/types';

const accentChoices = ['#FF6A3D', '#0073CC', '#16B5F7', '#18B57A', '#F5A623', '#6F4AE0', '#E0335B'];
const roles: { key: Role; label: string; hint: string }[] = [
  { key: 'cliente', label: 'Cliente', hint: 'Lo que ve un padre / alumno' },
  { key: 'instructor', label: 'Profesor', hint: 'Agenda, pase de lista, progreso' },
  { key: 'admin', label: 'Dueño / contadora', hint: 'Todo: alumnos, clases, pagos, exportar' },
];

/**
 * "Ajustes" panel: brand accent, club name, and — in local/demo mode — which
 * role and which student the phone is looking at, so the owner can try both
 * halves of the app from one device.
 */
export default function OwnerEditor() {
  const { editorOpen, setEditorOpen } = useAppState();
  const { db, updateSettings, reset } = useData();
  const insets = useSafeAreaInsets();
  const s = db.settings;

  return (
    <>
      <Pressable onPress={() => setEditorOpen(true)} style={[styles.fab, { top: insets.top + 10 }]} accessibilityLabel="Abrir ajustes">
        <Feather name="sliders" size={14} color="#fff" />
        <Text style={[head(700), { color: '#fff', fontSize: 12.5 }]}>Ajustes</Text>
      </Pressable>

      <Modal visible={editorOpen} transparent animationType="fade" onRequestClose={() => setEditorOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setEditorOpen(false)} />
        <View style={[styles.panel, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 12 }]}>
          <View style={styles.panelHeader}>
            <View>
              <Text style={[head(800), { fontSize: 16, color: colors.navy }]}>Ajustes</Text>
              <Txt size={11} w={600} color={colors.faint}>Se guardan en este dispositivo</Txt>
            </View>
            <Pressable onPress={() => setEditorOpen(false)} style={styles.closeBtn} accessibilityLabel="Cerrar">
              <Feather name="x" size={17} color={colors.navy} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }} keyboardShouldPersistTaps="handled">
            <Txt w={800} size={11} color={s.accent} style={styles.groupLabel}>VER LA APP COMO</Txt>
            <View style={{ gap: 8 }}>
              {roles.map((r) => {
                const active = s.viewAs === r.key;
                return (
                  <Pressable key={r.key} onPress={() => updateSettings({ viewAs: r.key })} style={[styles.roleBtn, active && { borderColor: s.accent, backgroundColor: '#FFF4EF' }]}>
                    <View style={[styles.radio, active && { borderColor: s.accent }]}>{active && <View style={[styles.radioDot, { backgroundColor: s.accent }]} />}</View>
                    <View style={{ flex: 1 }}>
                      <Txt w={700} size={13.5}>{r.label}</Txt>
                      <Txt size={11.5} color={colors.muted}>{r.hint}</Txt>
                    </View>
                  </Pressable>
                );
              })}
            </View>

            {s.viewAs === 'cliente' && (
              <>
                <Txt w={800} size={11} color={s.accent} style={styles.groupLabel}>ALUMNO QUE VE ESTE CLIENTE</Txt>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {db.students.map((st) => {
                    const active = st.id === (s.currentStudentId ?? db.students[0]?.id);
                    return (
                      <Pressable key={st.id} onPress={() => updateSettings({ currentStudentId: st.id })} style={[styles.chip, active && { backgroundColor: colors.navy, borderColor: colors.navy }]}>
                        <Txt w={700} size={12.5} color={active ? '#fff' : colors.navy}>{st.name}</Txt>
                      </Pressable>
                    );
                  })}
                </View>
              </>
            )}

            <Txt w={800} size={11} color={s.accent} style={styles.groupLabel}>COLOR DE ACENTO</Txt>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {accentChoices.map((c) => (
                <Pressable key={c} onPress={() => updateSettings({ accent: c })} accessibilityLabel={`Color ${c}`} style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: c, borderWidth: s.accent === c ? 3 : 0, borderColor: colors.navy }} />
              ))}
            </View>

            <Txt w={800} size={11} color={s.accent} style={styles.groupLabel}>NOMBRE DEL CLUB</Txt>
            <TextInput value={s.clubName} onChangeText={(v) => updateSettings({ clubName: v })} style={styles.input} />

            <Pressable onPress={reset} style={styles.resetBtn}>
              <Txt w={700} size={13} color="#486a8c">Restablecer datos de ejemplo</Txt>
            </Pressable>
            <Txt size={11} color={colors.faint} style={{ textAlign: 'center', marginTop: 8 }}>Borra alumnos, clases y pagos creados en este dispositivo.</Txt>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: { position: 'absolute', right: 16, zIndex: 60, flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: colors.navy, paddingVertical: 9, paddingHorizontal: 14, borderRadius: 999 },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(6,24,47,0.35)' },
  panel: { position: 'absolute', top: 0, right: 0, bottom: 0, width: '86%', maxWidth: 360, backgroundColor: '#fff' },
  panelHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: '#EAF1F8', marginBottom: 6 },
  closeBtn: { width: 32, height: 32, borderRadius: 9, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  groupLabel: { letterSpacing: 1, marginTop: 18, marginBottom: 10 },
  roleBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1.5, borderColor: '#dce6f0', borderRadius: 12, padding: 12 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#cdd9e6', alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  chip: { paddingVertical: 7, paddingHorizontal: 12, borderRadius: 999, borderWidth: 1.5, borderColor: '#dce6f0', backgroundColor: '#fff' },
  input: { ...body(500), borderWidth: 1.5, borderColor: '#dce6f0', borderRadius: 11, paddingVertical: 10, paddingHorizontal: 12, fontSize: 14, color: colors.navy, backgroundColor: '#fff' },
  resetBtn: { marginTop: 24, alignItems: 'center', paddingVertical: 12, borderWidth: 1.5, borderColor: '#E1ECF6', borderRadius: 12 },
});
