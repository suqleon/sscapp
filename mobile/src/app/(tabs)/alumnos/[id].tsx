import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { Chips, confirm, DangerButton, Input, Row2, Stepper } from '@/components/form';
import { Card, OutlineButton, PrimaryButton, Screen, ScreenHeader, SectionLabel, Txt, useToast } from '@/components/ui';
import { colors } from '@/constants/theme';
import { useData } from '@/store/DataProvider';
import { attendanceRate, paymentsFor, studentById } from '@/store/selectors';
import type { Skill } from '@/store/types';
import { BADGE_CATALOG } from '../progreso';

const SKILL_CATALOG = ['Respiración', 'Crol', 'Espalda', 'Pecho', 'Mariposa'];

export default function StudentForm() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { db, addStudent, updateStudent, removeStudent } = useData();
  const router = useRouter();
  const showToast = useToast();
  const existing = id !== 'nuevo' ? studentById(db, id) : undefined;
  const role = db.settings.viewAs;

  const [name, setName] = useState(existing?.name ?? '');
  const [age, setAge] = useState(existing?.age ? String(existing.age) : '');
  const [level, setLevel] = useState(existing?.level ?? db.settings.levels[1] ?? '');
  const [parentName, setParentName] = useState(existing?.parentName ?? '');
  const [parentPhone, setParentPhone] = useState(existing?.parentPhone ?? '');
  const [parentEmail, setParentEmail] = useState(existing?.parentEmail ?? '');
  const [planId, setPlanId] = useState<string>(existing?.planId ?? 'none');
  const [points, setPoints] = useState(existing?.points ?? 0);
  const [skills, setSkills] = useState<Skill[]>(() => SKILL_CATALOG.map((label) => ({ label, value: existing?.skills.find((s) => s.label === label)?.value ?? 0 })));
  const [badges, setBadges] = useState<string[]>(existing?.badges ?? []);
  const [medical, setMedical] = useState(existing?.medical ?? '');
  const [emergency, setEmergency] = useState(existing?.emergencyContact ?? '');
  const [pickup, setPickup] = useState(existing?.authorizedPickup ?? '');

  function save() {
    if (!name.trim()) return showToast('Escribe el nombre del alumno.');
    if (!parentName.trim()) return showToast('Escribe el nombre del representante.');
    const data = {
      name: name.trim(),
      age: age ? Number(age) : undefined,
      level,
      parentName: parentName.trim(),
      parentPhone: parentPhone.trim() || undefined,
      parentEmail: parentEmail.trim() || undefined,
      planId: planId === 'none' ? undefined : planId,
      points,
      skills: skills.filter((s) => s.value > 0),
      badges,
      medical: medical.trim() || undefined,
      emergencyContact: emergency.trim() || undefined,
      authorizedPickup: pickup.trim() || undefined,
    };
    if (existing) updateStudent(existing.id, data);
    else addStudent(data);
    showToast(existing ? 'Alumno actualizado' : 'Alumno registrado');
    router.back();
  }

  const rate = existing ? attendanceRate(db, existing.id) : null;
  const payCount = existing ? paymentsFor(db, existing.id).length : 0;

  return (
    <Screen>
      <ScreenHeader title={existing ? existing.name : 'Nuevo alumno'} onBack={() => router.back()} />
      {existing && (
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
          <Card style={{ flex: 1, padding: 12 }}><Txt size={11} w={700} color={colors.muted}>ASISTENCIA</Txt><Txt w={800} size={18}>{rate === null ? '—' : `${rate}%`}</Txt></Card>
          <Card style={{ flex: 1, padding: 12 }}><Txt size={11} w={700} color={colors.muted}>PAGOS</Txt><Txt w={800} size={18}>{payCount}</Txt></Card>
          {role === 'admin' && (
            <Card onPress={() => router.push({ pathname: '/cobros/nuevo', params: { studentId: existing.id } })} style={{ flex: 1.2, padding: 12, backgroundColor: colors.navy, borderColor: colors.navy, justifyContent: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><Feather name="dollar-sign" size={14} color="#fff" /><Txt w={700} size={12.5} color="#fff">Registrar pago</Txt></View>
            </Card>
          )}
        </View>
      )}

      <Card style={{ gap: 2 }}>
        <Row2>
          <View style={{ flex: 2 }}><Input label="Nombre del nadador" value={name} onChangeText={setName} placeholder="Ej. Lucas" autoCapitalize="words" /></View>
          <View style={{ flex: 1 }}><Input label="Edad" value={age} onChangeText={setAge} keyboardType="numeric" placeholder="8" /></View>
        </Row2>
        <Chips label="Nivel" options={db.settings.levels.map((l) => ({ value: l, label: l }))} value={level} onChange={setLevel} />
        <Chips label="Plan" options={[{ value: 'none', label: 'Sin plan' }, ...db.plans.map((p) => ({ value: p.id, label: `${p.name} · $${p.price}` }))]} value={planId} onChange={setPlanId} />
      </Card>

      <SectionLabel>Representante</SectionLabel>
      <Card style={{ gap: 2 }}>
        <Input label="Nombre" value={parentName} onChangeText={setParentName} placeholder="Ej. Ana Torres" autoCapitalize="words" />
        <Row2>
          <View style={{ flex: 1 }}><Input label="Teléfono / WhatsApp" value={parentPhone} onChangeText={setParentPhone} keyboardType="phone-pad" placeholder="099 123 4567" /></View>
        </Row2>
        <Input label="Correo" value={parentEmail} onChangeText={setParentEmail} keyboardType="email-address" autoCapitalize="none" placeholder="correo@ejemplo.com" />
      </Card>

      <SectionLabel>Progreso (lo llena el profesor)</SectionLabel>
      <Card>
        <Stepper label="Puntos" value={points} onChange={setPoints} min={0} max={99999} step={50} />
        <View style={{ height: 1, backgroundColor: '#EAF1F8', marginVertical: 4 }} />
        {skills.map((s, i) => (
          <Stepper key={s.label} label={s.label} value={s.value} onChange={(v) => setSkills((prev) => prev.map((x, j) => (j === i ? { ...x, value: v } : x)))} />
        ))}
        <Txt w={700} size={12} color="#486a8c" style={{ marginTop: 10, marginBottom: 8 }}>Insignias ganadas</Txt>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {BADGE_CATALOG.map((b) => {
            const on = badges.includes(b.label);
            return (
              <Pressable key={b.label} onPress={() => setBadges((prev) => (on ? prev.filter((x) => x !== b.label) : [...prev, b.label]))} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999, borderWidth: 1.5, borderColor: on ? b.colors[1] : '#dce6f0', backgroundColor: on ? b.colors[1] : '#fff' }}>
                <Feather name={on ? 'star' : 'lock'} size={13} color={on ? '#fff' : colors.faint} />
                <Txt w={700} size={12.5} color={on ? '#fff' : colors.navy}>{b.label}</Txt>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <SectionLabel>Seguridad del nadador</SectionLabel>
      <Card style={{ gap: 2 }}>
        <Input label="Información médica (alergias, condiciones)" value={medical} onChangeText={setMedical} multiline placeholder="Ej. Alérgico al cloro en exceso; usa inhalador." />
        <Input label="Contacto de emergencia" value={emergency} onChangeText={setEmergency} placeholder="Nombre · teléfono" />
        <Input label="Autorizados para recoger" value={pickup} onChangeText={setPickup} multiline placeholder="Nombres separados por coma" />
      </Card>

      <PrimaryButton label={existing ? 'Guardar cambios' : 'Registrar alumno'} onPress={save} style={{ marginTop: 16 }} />
      {existing && role === 'admin' && (
        <DangerButton label="Eliminar alumno" onPress={() => confirm('Eliminar alumno', `Se borrarán las reservas y asistencia de ${existing.name}. Los pagos se conservan para contabilidad.`, () => { removeStudent(existing.id); showToast('Alumno eliminado'); router.back(); })} />
      )}
      {existing && <OutlineButton label="Cancelar" onPress={() => router.back()} style={{ marginTop: 10 }} />}
    </Screen>
  );
}
