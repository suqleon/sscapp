import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AccentButton, Pill, Screen, ScreenHeader, SectionLabel, Txt, useToast } from '@/components/ui';
import { colors, head } from '@/constants/theme';
import { useAppState } from '@/context/AppState';
import { getBookingSlots } from '@/data/mockData';

const days = [
  { label: 'LUN', num: 15 },
  { label: 'MAR', num: 16 },
  { label: 'MIÉ', num: 17 },
  { label: 'JUE', num: 18 },
  { label: 'VIE', num: 19 },
];

export default function BookScreen() {
  const { profile } = useAppState();
  const router = useRouter();
  const showToast = useToast();
  const slots = getBookingSlots(profile);
  const [selectedDay, setSelectedDay] = useState(16);
  const [selectedSlot, setSelectedSlot] = useState(slots[0].id);
  const chosen = slots.find((s) => s.id === selectedSlot);

  function confirm() {
    if (!chosen || chosen.state === 'full') return;
    showToast(`Reserva confirmada · ${chosen.time} ${chosen.period}`);
    setTimeout(() => router.push('/horario'), 900);
  }

  return (
    <Screen>
      <ScreenHeader title="Reservar clase" />
      <Txt w={700} size={13} style={{ marginBottom: 10 }}>Junio 2026</Txt>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {days.map((d) => {
          const active = d.num === selectedDay;
          return (
            <Pressable key={d.num} onPress={() => setSelectedDay(d.num)} style={[styles.day, active ? styles.dayActive : styles.dayIdle]}>
              <Txt size={11} w={active ? 700 : 600} color={active ? '#bfe6ff' : colors.muted}>{d.label}</Txt>
              <Text style={[head(800), { fontSize: 17, color: active ? '#fff' : colors.navy, marginTop: 3 }]}>{d.num}</Text>
            </Pressable>
          );
        })}
      </View>

      <SectionLabel>Horarios disponibles</SectionLabel>
      <View style={{ gap: 10 }}>
        {slots.map((slot) => {
          const isSelected = slot.id === selectedSlot;
          const isFull = slot.state === 'full';
          return (
            <Pressable
              key={slot.id}
              disabled={isFull}
              onPress={() => setSelectedSlot(slot.id)}
              style={[styles.slot, isSelected ? styles.slotSelected : styles.slotIdle, isFull && { opacity: 0.55 }]}>
              <View style={{ alignItems: 'center', minWidth: 46 }}>
                <Text style={[head(800), { fontSize: 18, color: isSelected ? colors.blue : colors.navy }]}>{slot.time}</Text>
                <Txt size={10} w={700} color={colors.muted}>{slot.period}</Txt>
              </View>
              <View style={{ width: 1, height: 38, backgroundColor: '#EAF1F8' }} />
              <View style={{ flex: 1 }}>
                <Text style={[head(700), { fontSize: 14.5, color: colors.navy }]}>{slot.title}</Text>
                <Txt size={12} color={colors.muted} style={{ marginTop: 2 }}>{slot.subtitle}</Txt>
              </View>
              {isFull ? (
                <Pill color={colors.faint} bg="#EEF3F8">Lleno</Pill>
              ) : isSelected ? (
                <View style={styles.check}><Feather name="check" size={15} color="#fff" /></View>
              ) : (
                <Pill color={colors.success} bg={colors.successBg}>Libre</Pill>
              )}
            </Pressable>
          );
        })}
      </View>

      <AccentButton label={`Confirmar reserva · ${chosen ? `${chosen.time} ${chosen.period}` : ''}`} onPress={confirm} disabled={chosen?.state === 'full'} style={{ marginTop: 18 }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  day: { flex: 1, alignItems: 'center', paddingVertical: 11, borderRadius: 14 },
  dayIdle: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  dayActive: { backgroundColor: colors.blue },
  slot: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 18, padding: 15 },
  slotIdle: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  slotSelected: { backgroundColor: '#EAF4FE', borderWidth: 2, borderColor: colors.blue },
  check: { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.blue, alignItems: 'center', justifyContent: 'center' },
});
