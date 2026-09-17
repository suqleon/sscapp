import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { TextInput, View } from 'react-native';

import { Chips, Input, Row2 } from '@/components/form';
import { Card, PrimaryButton, Screen, ScreenHeader, Txt, useToast } from '@/components/ui';
import { body, colors } from '@/constants/theme';
import { useData } from '@/store/DataProvider';
import { planFor, studentById, todayISO } from '@/store/selectors';
import type { PaymentMethod } from '@/store/types';

const CONCEPTS = ['Mensualidad', 'Inscripción', 'Clase suelta', 'Uniforme', 'Otro'];

export default function NewPayment() {
  const { studentId: preset } = useLocalSearchParams<{ studentId?: string }>();
  const { db, addPayment } = useData();
  const router = useRouter();
  const showToast = useToast();
  const [q, setQ] = useState('');
  const [studentId, setStudentId] = useState<string | undefined>(preset);
  const student = studentById(db, studentId);
  const plan = planFor(db, student);
  const [concept, setConcept] = useState('Mensualidad');
  const [amount, setAmount] = useState(plan ? String(plan.price) : '');
  const [method, setMethod] = useState<PaymentMethod>('efectivo');
  const [date, setDate] = useState(todayISO());

  const candidates = db.students.filter((s) => !q.trim() || `${s.name} ${s.parentName}`.toLowerCase().includes(q.trim().toLowerCase())).slice(0, 12);

  function pick(id: string) {
    setStudentId(id);
    const p = planFor(db, studentById(db, id));
    if (p && concept === 'Mensualidad') setAmount(String(p.price));
  }

  function save() {
    const n = Number(amount);
    if (!studentId) return showToast('Elige el alumno.');
    if (!n || n <= 0) return showToast('Escribe el monto.');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return showToast('La fecha debe ser AAAA-MM-DD.');
    addPayment({ studentId, amount: n, concept, date, method });
    showToast(`Pago de $${n} registrado`);
    router.back();
  }

  return (
    <Screen>
      <ScreenHeader title="Registrar pago" onBack={() => router.back()} />
      <Card style={{ gap: 2 }}>
        <Txt w={700} size={12} color="#486a8c" style={{ marginBottom: 6 }}>Alumno</Txt>
        {!preset && <TextInput value={q} onChangeText={setQ} placeholder="Buscar alumno…" placeholderTextColor={colors.faint} style={{ ...body(500), borderWidth: 1.5, borderColor: '#dce6f0', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 13, fontSize: 14, color: colors.navy, marginBottom: 10 }} />}
        <Chips options={candidates.map((s) => ({ value: s.id, label: `${s.name} (${s.parentName.split(' ')[0]})` }))} value={studentId} onChange={pick} />
        {student && plan && <Txt size={12} color={colors.muted} style={{ marginTop: -4, marginBottom: 8 }}>Plan actual: {plan.name} · ${plan.price}/mes</Txt>}
      </Card>

      <Card style={{ marginTop: 12, gap: 2 }}>
        <Chips label="Concepto" options={CONCEPTS.map((c) => ({ value: c, label: c }))} value={concept} onChange={(c) => { setConcept(c); if (c === 'Mensualidad' && plan) setAmount(String(plan.price)); }} />
        <Row2>
          <View style={{ flex: 1 }}><Input label="Monto ($)" value={amount} onChangeText={setAmount} keyboardType="numeric" placeholder="60" /></View>
          <View style={{ flex: 1.3 }}><Input label="Fecha (AAAA-MM-DD)" value={date} onChangeText={setDate} /></View>
        </Row2>
        <Chips label="Método" options={[{ value: 'efectivo' as const, label: 'Efectivo' }, { value: 'transferencia' as const, label: 'Transferencia' }, { value: 'tarjeta' as const, label: 'Tarjeta' }]} value={method} onChange={setMethod} />
      </Card>

      <PrimaryButton label="Guardar pago" onPress={save} style={{ marginTop: 16 }} />
    </Screen>
  );
}
