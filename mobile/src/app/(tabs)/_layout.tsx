import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router/js-tabs';
import type { ColorValue } from 'react-native';

import { body, colors } from '@/constants/theme';
import { useData } from '@/store/DataProvider';

type IconName = React.ComponentProps<typeof Feather>['name'];

const tab = (title: string, icon: IconName, show: boolean) => ({
  title,
  href: show ? undefined : (null as null),
  tabBarIcon: ({ color }: { color: ColorValue }) => <Feather name={icon} size={22} color={color} />,
});

export default function TabsLayout() {
  const { db } = useData();
  const role = db.settings.viewAs;
  const client = role === 'cliente';
  const staff = !client;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: db.settings.accent,
        tabBarInactiveTintColor: colors.faint,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: '#EAF1F8', height: 78, paddingTop: 8 },
        tabBarLabelStyle: { ...body(600), fontSize: 10.5 },
        sceneStyle: { backgroundColor: colors.bg },
      }}>
      {/* Cliente */}
      <Tabs.Screen name="index" options={tab('Inicio', 'home', client)} />
      <Tabs.Screen name="reservar" options={tab('Reservar', 'calendar', client)} />
      <Tabs.Screen name="progreso" options={tab('Progreso', 'award', client)} />
      <Tabs.Screen name="mensajes" options={tab('Mensajes', 'message-circle', client)} />
      {/* Equipo (profesores / dueño / contadora) */}
      <Tabs.Screen name="equipo" options={tab('Equipo', 'grid', staff)} />
      <Tabs.Screen name="clases" options={tab('Clases', 'calendar', staff)} />
      <Tabs.Screen name="alumnos" options={tab('Alumnos', 'users', staff)} />
      <Tabs.Screen name="cobros" options={tab('Pagos', 'dollar-sign', role === 'admin')} />
      {/* Ambos */}
      <Tabs.Screen name="perfil" options={tab('Perfil', 'user', true)} />
      {/* Reachable from Inicio, never in the bar */}
      <Tabs.Screen name="horario" options={{ href: null, title: 'Horario' }} />
      <Tabs.Screen name="pagos" options={{ href: null, title: 'Pagos' }} />
      <Tabs.Screen name="avisos" options={{ href: null, title: 'Avisos' }} />
    </Tabs>
  );
}
