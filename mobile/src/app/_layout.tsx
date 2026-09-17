import { Outfit_500Medium, Outfit_600SemiBold, Outfit_700Bold, Outfit_800ExtraBold } from '@expo-google-fonts/outfit';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';

import OwnerEditor from '@/components/OwnerEditor';
import { ToastProvider } from '@/components/ui';
import { colors } from '@/constants/theme';
import { AppStateProvider, useAppState } from '@/context/AppState';
import { DataProvider, useData } from '@/store/DataProvider';

SplashScreen.preventAutoHideAsync().catch(() => {});

function RootNavigator({ fontsReady }: { fontsReady: boolean }) {
  const { ready, isAuthed } = useAppState();
  const { ready: dataReady } = useData();
  const canRender = fontsReady && ready && dataReady;

  useEffect(() => {
    if (canRender) SplashScreen.hideAsync().catch(() => {});
  }, [canRender]);

  if (!canRender) return null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        <Stack.Protected guard={!isAuthed}>
          <Stack.Screen name="login" />
        </Stack.Protected>
        <Stack.Protected guard={isAuthed}>
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>
      </Stack>
      {isAuthed && <OwnerEditor />}
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_800ExtraBold,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  return (
    <AppStateProvider>
      <DataProvider>
        <ToastProvider>
          <RootNavigator fontsReady={fontsLoaded || Boolean(fontError)} />
        </ToastProvider>
      </DataProvider>
    </AppStateProvider>
  );
}
