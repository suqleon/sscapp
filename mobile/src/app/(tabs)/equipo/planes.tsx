import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { confirm, Input, Row2 } from '@/components/form';
import { Card, PrimaryButton, Screen, ScreenHeader, SectionLabel, Txt, useToast } from '@/components/ui';
import { body, colors } from '@/constants/theme';
import { useData } from '@/store/DataProvider';
import { money } from '@/store/selectors';

export default function PlansScreen() {
  const { db, addPlan, updatePlan, removePlan, addCoach, removeCoach } = useData();
  const router = useRouter();
  const showToast = useToast();
  const [newPlan, setNewPlan] = useState({ name: '', price: '', classes: '8' });
  const [newCoach, setNewCoach] = useState('');

  function createPlan() {
    const price = Number(newPlan.price);
    if (!newPlan.name.trim() || !price) return showToast('Escribe nombre y precio del plan.');
    addPlan({ name: newPlan.name.trim(), price, classesPerMonth: Number(newPlan.classes) || 0 });
    setNewPlan({ name: '', price: '', classes: '8' });
    showToast('Plan creado');
  }

  return (
    <Screen>
      <ScreenHeader title="Planes y profesores" onBack={() => router.back()} />

      <SectionLabel style={{ marginTop: 4 }}>Planes de membresía</SectionLabel>
      <View style={{ gap: 10 }}>
        {db.plans.map((p) => {
          const users = db.students.filter((s) => s.planId === p.id).length;
          return (
            <Card key={p.id} style={{ gap: 6 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <TextInput value={p.name} onChangeText={(v) => updatePlan(p.id, { name: v })} style={[styles.inline, { flex: 1 }]} />
                <Pressable
                  onPress={() => confirm('Eliminar plan', users ? `${users} alumno(s) tienen este plan; quedarán sin plan.` : '¿Eliminar este plan?', () => removePlan(p.id))}
                  accessibilityLabel={`Eliminar ${p.name}`}>
                  <Feather name="trash-2" size={18} color={colors.danger} />
                </Pressable>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Txt size={12} w={700} color="#486a8c">Precio $</Txt>
                <TextInput value={String(p.price)} onChangeText={(v) => updatePlan(p.id, { price: Number(v.replace(/[^0-9.]/g, '')) || 0 })} keyboardType="numeric" style={[styles.inline, { width: 80 }]} />
                <Txt size={12} w={700} color="#486a8c">Clases/mes</Txt>
                <TextInput value={String(p.classesPerMonth)} onChangeText={(v) => updatePlan(p.id, { classesPerMonth: Number(v.replace(/[^0-9]/g, '')) || 0 })} keyboardType="numeric" style={[styles.inline, { width: 60 }]} />
              </View>
              <Txt size={11.5} color={colors.muted}>{users} alumno(s) · {money(p.price)} al mes</Txt>
            </Card>
          );
        })}
      </View>

      <Card style={{ marginTop: 12, backgroundColor: '#F7FAFD' }}>
        <Txt w={700} size={13} style={{ marginBottom: 10 }}>Nuevo plan</Txt>
        <Input label="Nombre" value={newPlan.name} onChangeText={(v) => setNewPlan({ ...newPlan, name: v })} placeholder="Ej. Plan 2 veces por semana" />
        <Row2>
          <View style={{ flex: 1 }}><Input label="Precio ($)" value={newPlan.price} onChangeText={(v) => setNewPlan({ ...newPlan, price: v })} keyboardType="numeric" placeholder="60" /></View>
          <View style={{ flex: 1 }}><Input label="Clases al mes" value={newPlan.classes} onChangeText={(v) => setNewPlan({ ...newPlan, classes: v })} keyboardType="numeric" /></View>
        </Row2>
        <PrimaryButton label="Agregar plan" onPress={createPlan} />
      </Card>

      <SectionLabel>Profesores</SectionLabel>
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {db.coaches.map((c, i) => (
          <View key={c.id} style={[styles.coachRow, i > 0 && { borderTopWidth: 1, borderTopColor: '#EAF1F8' }]}>
            <Feather name="user" size={18} color={colors.blue} />
            <Txt w={600} size={14} style={{ flex: 1 }}>{c.name}</Txt>
            <Txt size={11.5} color={colors.muted}>{db.classes.filter((k) => k.coachId === c.id).length} clases</Txt>
            <Pressable onPress={() => confirm('Quitar profesor', `¿Quitar a ${c.name} del equipo? Sus clases quedarán sin coach asignado.`, () => removeCoach(c.id))} accessibilityLabel={`Quitar ${c.name}`}>
              <Feather name="x" size={18} color={colors.faint} />
            </Pressable>
          </View>
        ))}
        <View style={[styles.coachRow, { borderTopWidth: 1, borderTopColor: '#EAF1F8', gap: 10 }]}>
          <TextInput value={newCoach} onChangeText={setNewCoach} placeholder="Nombre del nuevo profesor" placeholderTextColor={colors.faint} style={[styles.inline, { flex: 1 }]} />
          <Pressable
            onPress={() => { if (!newCoach.trim()) return; addCoach(newCoach.trim()); setNewCoach(''); showToast('Profesor agregado'); }}
            style={{ backgroundColor: colors.navy, borderRadius: 10, paddingVertical: 9, paddingHorizontal: 12 }}>
            <Txt w={700} size={12.5} color="#fff">Agregar</Txt>
          </Pressable>
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  inline: { ...body(600), borderWidth: 1.5, borderColor: '#dce6f0', borderRadius: 10, paddingVertical: 8, paddingHorizontal: 10, fontSize: 14, color: colors.navy, backgroundColor: '#fff' },
  coachRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 15 },
});
