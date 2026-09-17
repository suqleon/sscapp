import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Avatar, Card, Pill, Screen, ScreenHeader, Txt } from '@/components/ui';
import { body, colors, head } from '@/constants/theme';
import { useData } from '@/store/DataProvider';
import { pendingThisMonth, planFor } from '@/store/selectors';

export default function StudentsScreen() {
  const { db } = useData();
  const router = useRouter();
  const accent = db.settings.accent;
  const [q, setQ] = useState('');
  const pendingIds = new Set(pendingThisMonth(db).map((s) => s.id));
  const list = db.students
    .filter((s) => !q.trim() || `${s.name} ${s.parentName} ${s.level}`.toLowerCase().includes(q.trim().toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Screen>
      <ScreenHeader
        title="Alumnos"
        right={
          <Pressable onPress={() => router.push({ pathname: '/alumnos/[id]', params: { id: 'nuevo' } })} style={[styles.addBtn, { backgroundColor: accent }]} accessibilityLabel="Nuevo alumno">
            <Feather name="plus" size={18} color="#fff" />
            <Txt w={700} size={12.5} color="#fff">Nuevo</Txt>
          </Pressable>
        }
      />
      <View style={styles.search}>
        <Feather name="search" size={18} color={colors.faint} />
        <TextInput value={q} onChangeText={setQ} placeholder="Buscar por nombre, representante o nivel" placeholderTextColor={colors.faint} style={styles.searchInput} />
      </View>
      <Txt size={12} color={colors.muted} style={{ marginBottom: 10 }}>{list.length} de {db.students.length} alumnos</Txt>
      <View style={{ gap: 9 }}>
        {list.map((s) => {
          const plan = planFor(db, s);
          return (
            <Card key={s.id} onPress={() => router.push({ pathname: '/alumnos/[id]', params: { id: s.id } })} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 }}>
              <Avatar initial={s.name.charAt(0)} colorsPair={['#ffd0c0', '#FF6A3D']} size={42} rounded={13} />
              <View style={{ flex: 1 }}>
                <Text style={[head(700), { fontSize: 14.5, color: colors.navy }]}>{s.name}{s.age ? ` · ${s.age} años` : ''}</Text>
                <Txt size={12} color={colors.muted}>{s.level} · {s.parentName}{plan ? ` · ${plan.name}` : ' · Sin plan'}</Txt>
              </View>
              {pendingIds.has(s.id) ? <Pill color="#C77A0A" bg={colors.warnBg}>Pago pendiente</Pill> : <Feather name="chevron-right" size={18} color={colors.faint} />}
            </Card>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 9, paddingHorizontal: 13, borderRadius: 12, marginRight: 96 },
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 14, paddingHorizontal: 14, marginBottom: 8 },
  searchInput: { ...body(500), flex: 1, fontSize: 13.5, color: colors.navy, paddingVertical: 12 },
});
