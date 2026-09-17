import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Card, Screen, ScreenHeader, Txt, useToast } from '@/components/ui';
import { colors } from '@/constants/theme';
import { shareCSV } from '@/store/csv';
import { useData } from '@/store/DataProvider';
import { coachName, planFor, studentById, classById, dateShort, time12 } from '@/store/selectors';

export default function ExportScreen() {
  const { db } = useData();
  const router = useRouter();
  const showToast = useToast();
  const [busy, setBusy] = useState<string | null>(null);

  const datasets = [
    {
      key: 'alumnos',
      title: 'Alumnos',
      desc: `${db.students.length} alumnos · nombre, nivel, representante, plan, contacto`,
      icon: 'users' as const,
      rows: () =>
        db.students.map((s) => ({
          Nombre: s.name,
          Edad: s.age ?? '',
          Nivel: s.level,
          Representante: s.parentName,
          Teléfono: s.parentPhone ?? '',
          Correo: s.parentEmail ?? '',
          Plan: planFor(db, s)?.name ?? '',
          Puntos: s.points,
          Insignias: s.badges.join(' | '),
          'Info médica': s.medical ?? '',
          'Contacto emergencia': s.emergencyContact ?? '',
          'Autorizados recoger': s.authorizedPickup ?? '',
          Registrado: s.createdAt.slice(0, 10),
        })),
    },
    {
      key: 'pagos',
      title: 'Pagos',
      desc: `${db.payments.length} pagos · fecha, alumno, concepto, monto, método`,
      icon: 'dollar-sign' as const,
      rows: () =>
        [...db.payments]
          .sort((a, b) => b.date.localeCompare(a.date))
          .map((p) => {
            const s = studentById(db, p.studentId);
            return { Fecha: p.date, Alumno: s?.name ?? '', Representante: s?.parentName ?? '', Concepto: p.concept, Monto: p.amount, Método: p.method };
          }),
    },
    {
      key: 'asistencia',
      title: 'Asistencia',
      desc: `${db.attendance.length} registros · clase, fecha, alumno, presente`,
      icon: 'check-square' as const,
      rows: () =>
        db.attendance.map((a) => {
          const c = classById(db, a.classId);
          const s = studentById(db, a.studentId);
          return { Fecha: c?.date ?? '', Hora: c ? time12(c.time) : '', Clase: c?.title ?? '', Coach: c ? coachName(db, c.coachId) : '', Alumno: s?.name ?? '', Presente: a.present ? 'Sí' : 'No', Marcado: a.markedAt.slice(0, 16).replace('T', ' ') };
        }),
    },
    {
      key: 'clases',
      title: 'Clases',
      desc: `${db.classes.length} clases · fecha, hora, coach, alberca, cupo, inscritos`,
      icon: 'calendar' as const,
      rows: () =>
        [...db.classes]
          .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
          .map((c) => ({
            Fecha: c.date,
            Hora: time12(c.time),
            Clase: c.title,
            Nivel: c.level,
            Coach: coachName(db, c.coachId),
            Alberca: c.pool,
            Carril: c.lane ?? '',
            Cupo: c.capacity,
            Inscritos: db.bookings.filter((b) => b.classId === c.id).length,
            Especial: c.special ? 'Sí' : 'No',
          })),
    },
  ];

  async function run(d: (typeof datasets)[number]) {
    try {
      setBusy(d.key);
      const rows = d.rows();
      if (rows.length === 0) return showToast('No hay datos para exportar todavía.');
      await shareCSV(`${d.key}-${new Date().toISOString().slice(0, 10)}.csv`, rows);
      showToast(`${d.title}: ${rows.length} filas exportadas`);
    } catch (e) {
      showToast(`No se pudo exportar: ${e instanceof Error ? e.message : 'error'}`);
    } finally {
      setBusy(null);
    }
  }

  return (
    <Screen>
      <ScreenHeader title="Exportar datos" onBack={() => router.back()} />
      <Txt size={13} color={colors.muted} style={{ marginBottom: 14 }}>
        Cada archivo se abre en Excel o Google Sheets. En el celular se abre el menú de compartir (WhatsApp, correo, Drive…); en la computadora se descarga.
      </Txt>
      <View style={{ gap: 10 }}>
        {datasets.map((d) => (
          <Card key={d.key} onPress={() => run(d)} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, opacity: busy === d.key ? 0.6 : 1 }}>
            <View style={{ width: 42, height: 42, borderRadius: 13, backgroundColor: '#EAF4FE', alignItems: 'center', justifyContent: 'center' }}>
              <Feather name={d.icon} size={20} color={colors.blue} />
            </View>
            <View style={{ flex: 1 }}>
              <Txt w={700} size={14.5}>{d.title}</Txt>
              <Txt size={12} color={colors.muted}>{d.desc}</Txt>
            </View>
            <Feather name="download" size={18} color={colors.faint} />
          </Card>
        ))}
      </View>
      <Txt size={11.5} color={colors.faint} style={{ marginTop: 16, textAlign: 'center' }}>Último respaldo: {dateShort(new Date().toISOString().slice(0, 10))}</Txt>
    </Screen>
  );
}
