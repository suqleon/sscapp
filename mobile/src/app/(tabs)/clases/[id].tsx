import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Chips, confirm, DangerButton, Input, Row2, Stepper } from '@/components/form';
import { Card, OutlineButton, PrimaryButton, Screen, ScreenHeader, Toggle, Txt, useToast } from '@/components/ui';
import { colors } from '@/constants/theme';
import { useData } from '@/store/DataProvider';
import { isoDate } from '@/store/seed';
import { classById, dayShort, parseISO } from '@/store/selectors';

const TIMES = ['07:00', '08:00', '09:00', '10:00', '11:00', '15:00', '16:00', '17:00', '18:00', '18:30', '19:00'];

export default function ClassForm() {
  const { id, date: dateParam } = useLocalSearchParams<{ id: string; date?: string }>();
  const { db, addClass, updateClass, removeClass } = useData();
  const router = useRouter();
  const showToast = useToast();
  const existing = id !== 'nuevo' ? classById(db, id) : undefined;

  const [title, setTitle] = useState(existing?.title ?? '');
  const [level, setLevel] = useState(existing?.level ?? db.settings.levels[1] ?? '');
  const [coachId, setCoachId] = useState(existing?.coachId ?? db.coaches[0]?.id ?? '');
  const [pool, setPool] = useState(existing?.pool ?? db.settings.pools[0] ?? 'Alberca A');
  const [lane, setLane] = useState(existing?.lane ?? '');
  const [date, setDate] = useState(existing?.date ?? dateParam ?? isoDate(0));
  const [time, setTime] = useState(existing?.time ?? '17:00');
  const [capacity, setCapacity] = useState(existing?.capacity ?? 6);
  const [special, setSpecial] = useState(existing?.special ?? false);

  const days = Array.from({ length: 14 }, (_, i) => isoDate(i));
  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(date);
  const validTime = /^\d{2}:\d{2}$/.test(time);

  function save() {
    const finalTitle = title.trim() || `${level} · Clase`;
    if (!coachId) return showToast('Agrega un profesor primero (Equipo → Planes y profesores).');
    if (!validDate) return showToast('La fecha debe ser AAAA-MM-DD.');
    if (!validTime) return showToast('La hora debe ser HH:MM (24 h).');
    const data = { title: finalTitle, level, coachId, pool, lane: lane.trim() || undefined, date, time, capacity, special };
    if (existing) updateClass(existing.id, data);
    else addClass(data);
    showToast(existing ? 'Clase actualizada' : 'Clase creada');
    router.back();
  }

  return (
    <Screen>
      <ScreenHeader title={existing ? 'Editar clase' : 'Nueva clase'} onBack={() => router.back()} />
      <Card style={{ gap: 2 }}>
        <Input label="Nombre de la clase" value={title} onChangeText={setTitle} placeholder={`Ej. ${level} · Crol`} />
        <Chips label="Nivel" options={db.settings.levels.map((l) => ({ value: l, label: l }))} value={level} onChange={setLevel} />
        <Chips label="Profesor" options={db.coaches.map((c) => ({ value: c.id, label: c.name }))} value={coachId} onChange={setCoachId} />
        <Row2>
          <View style={{ flex: 1.4 }}><Chips label="Alberca" options={db.settings.pools.map((p) => ({ value: p, label: p }))} value={pool} onChange={setPool} /></View>
          <View style={{ flex: 1 }}><Input label="Carril" value={lane} onChangeText={setLane} placeholder="3" keyboardType="numeric" /></View>
        </Row2>
      </Card>

      <Card style={{ marginTop: 12, gap: 2 }}>
        <Txt w={700} size={12} color="#486a8c" style={{ marginBottom: 6 }}>Fecha</Txt>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
          {days.map((d) => {
            const active = d === date;
            return (
              <View key={d} style={{ width: '13%' }}>
                <OutlineButton
                  label={`${dayShort(d)} ${parseISO(d).getDate()}`}
                  onPress={() => setDate(d)}
                  style={{ paddingVertical: 8, paddingHorizontal: 0, borderRadius: 10, backgroundColor: active ? colors.navy : '#fff', borderColor: active ? colors.navy : '#dce6f0' }}
                  color={active ? '#fff' : colors.navy}
                />
              </View>
            );
          })}
        </View>
        <Input label="O escribe la fecha (AAAA-MM-DD)" value={date} onChangeText={setDate} placeholder="2026-09-20" />
        <Chips label="Hora" options={TIMES.map((t) => ({ value: t, label: t }))} value={TIMES.includes(time) ? time : undefined} onChange={setTime} />
        <Input label="O escribe la hora (24 h, HH:MM)" value={time} onChangeText={setTime} placeholder="17:00" />
        <Stepper label="Cupo máximo" value={capacity} onChange={setCapacity} min={1} max={40} step={1} />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 }}>
          <View style={{ flex: 1 }}>
            <Txt w={600} size={13.5}>Clase especial</Txt>
            <Txt size={11.5} color={colors.muted}>Evaluaciones, festivales, eventos</Txt>
          </View>
          <Toggle on={special} onChange={() => setSpecial((v) => !v)} />
        </View>
      </Card>

      <PrimaryButton label={existing ? 'Guardar cambios' : 'Crear clase'} onPress={save} style={{ marginTop: 16 }} />
      {existing && (
        <DangerButton
          label="Eliminar clase"
          onPress={() => confirm('Eliminar clase', 'Se borrarán también sus reservas y asistencia.', () => { removeClass(existing.id); showToast('Clase eliminada'); router.back(); })}
        />
      )}
    </Screen>
  );
}
