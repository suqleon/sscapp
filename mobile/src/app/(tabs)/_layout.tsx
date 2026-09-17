import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router/js-tabs';
import type { ColorValue } from 'react-native';

import { body, colors } from '@/constants/theme';
import { useAppState } from '@/context/AppState';

type IconName = React.ComponentProps<typeof Feather>['name'];

const tab = (title: string, icon: IconName) => ({
  title,
  tabBarIcon: ({ color }: { color: ColorValue }) => <Feather name={icon} size={22} color={color} />,
});

export default function TabsLayout() {
  const { profile } = useAppState();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: profile.accent,
        tabBarInactiveTintColor: colors.faint,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: '#EAF1F8', height: 78, paddingTop: 8 },
        tabBarLabelStyle: { ...body(600), fontSize: 10.5 },
        sceneStyle: { backgroundColor: colors.bg },
      }}>
      <Tabs.Screen name="index" options={tab('Inicio', 'home')} />
      <Tabs.Screen name="reservar" options={tab('Reservar', 'calendar')} />
      <Tabs.Screen name="progreso" options={tab('Progreso', 'award')} />
      <Tabs.Screen name="mensajes" options={tab('Mensajes', 'message-circle')} />
      <Tabs.Screen name="perfil" options={tab('Perfil', 'user')} />
      {/* Reachable from Inicio, but not shown in the tab bar */}
      <Tabs.Screen name="horario" options={{ href: null, title: 'Horario' }} />
      <Tabs.Screen name="pagos" options={{ href: null, title: 'Pagos' }} />
      <Tabs.Screen name="avisos" options={{ href: null, title: 'Avisos' }} />
    </Tabs>
  );
}
