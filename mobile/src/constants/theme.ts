import { Platform } from 'react-native';

export const colors = {
  navy: '#07254F',
  navyDeep: '#06182f',
  blue: '#0073CC',
  blueDeep: '#0a3e7e',
  cyan: '#16B5F7',
  accent: '#FF6A3D',
  muted: '#6E8AAA',
  faint: '#9fb3c8',
  border: '#E7EFF7',
  bg: '#F2F8FD',
  surface: '#FFFFFF',
  success: '#18B57A',
  successBg: '#E4F7EF',
  warn: '#F5A623',
  warnBg: '#FDF1DD',
  danger: '#c0392b',
} as const;

type BodyWeight = 400 | 500 | 600 | 700 | 800;
type HeadWeight = 500 | 600 | 700 | 800;

const bodyMap: Record<BodyWeight, string> = {
  400: 'PlusJakartaSans_400Regular',
  500: 'PlusJakartaSans_500Medium',
  600: 'PlusJakartaSans_600SemiBold',
  700: 'PlusJakartaSans_700Bold',
  800: 'PlusJakartaSans_800ExtraBold',
};
const headMap: Record<HeadWeight, string> = {
  500: 'Outfit_500Medium',
  600: 'Outfit_600SemiBold',
  700: 'Outfit_700Bold',
  800: 'Outfit_800ExtraBold',
};

/** Body text font. RN can't derive weights from one family, so pick the file per weight. */
export const body = (w: BodyWeight = 400) => ({ fontFamily: bodyMap[w] });
/** Display / heading font (Outfit). */
export const head = (w: HeadWeight = 700) => ({ fontFamily: headMap[w] });

export const radius = { sm: 11, md: 14, lg: 16, xl: 18, xxl: 22, hero: 24 } as const;

export const shadow = Platform.select({
  ios: { shadowColor: colors.navy, shadowOpacity: 0.12, shadowRadius: 14, shadowOffset: { width: 0, height: 10 } },
  android: { elevation: 3 },
  default: {},
});
