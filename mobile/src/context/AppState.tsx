import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Session } from '@supabase/supabase-js';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { defaultProfile, type Profile, type Role } from '@/data/mockData';
import { supabase, supabaseConfigured } from '@/lib/supabase';

const PROFILE_KEY = 'ssc-profile-v1';
const DEMO_AUTH_KEY = 'ssc-demo-auth-v1';

type SignUpInput = { email: string; password: string; clientName: string; swimmerName: string };
type AuthResult = { error?: string };

type AppStateValue = {
  /** False until stored session + profile have been read. Keep the splash up until then. */
  ready: boolean;
  isAuthed: boolean;
  demoMode: boolean;
  profile: Profile;
  role: Role;
  updateProfile: (patch: Partial<Profile>) => void;
  resetProfile: () => void;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (input: SignUpInput) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  /** Demo-only shortcut used by the biometric button. */
  demoLogin: () => Promise<void>;
  editorOpen: boolean;
  setEditorOpen: (open: boolean) => void;
};

const Ctx = createContext<AppStateValue | null>(null);

function humanizeAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('invalid login credentials')) return 'Correo o contraseña incorrectos.';
  if (m.includes('email not confirmed')) return 'Confirma tu correo antes de ingresar (revisa tu bandeja).';
  if (m.includes('already registered')) return 'Ese correo ya tiene una cuenta. Inicia sesión.';
  if (m.includes('password should be at least')) return 'La contraseña debe tener al menos 6 caracteres.';
  if (m.includes('network')) return 'Sin conexión. Revisa tu internet e intenta de nuevo.';
  return message;
}

async function loadRemoteProfile(userId: string): Promise<Profile> {
  if (!supabase) return defaultProfile;
  const [profileRes, swimmerRes, membershipRes, bookingRes] = await Promise.all([
    supabase.from('profiles').select('client_name, role, accent').eq('id', userId).maybeSingle(),
    supabase.from('swimmers').select('name, age, level').eq('owner_id', userId).order('created_at').limit(1).maybeSingle(),
    supabase.from('memberships').select('plan, price').eq('owner_id', userId).order('created_at').limit(1).maybeSingle(),
    supabase
      .from('bookings')
      .select('class:classes(coach, pool, lane, start_time)')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const p = profileRes.data;
  const s = swimmerRes.data;
  const m = membershipRes.data;
  // supabase-js types a to-one join as an array unless told otherwise; normalise defensively.
  const rawClass = bookingRes.data?.class as unknown;
  const cls = (Array.isArray(rawClass) ? rawClass[0] : rawClass) as
    | { coach: string; pool: string; lane: string | null; start_time: string }
    | null
    | undefined;

  return {
    ...defaultProfile,
    clientName: p?.client_name || defaultProfile.clientName,
    role: (p?.role as Role) || 'cliente',
    accent: p?.accent || defaultProfile.accent,
    swimmerName: s?.name || defaultProfile.swimmerName,
    swimmerAge: s?.age != null ? String(s.age) : '',
    level: s?.level || defaultProfile.level,
    plan: m?.plan || defaultProfile.plan,
    price: m?.price != null ? `$${Number(m.price).toLocaleString('es-EC')}` : defaultProfile.price,
    coach: cls?.coach || defaultProfile.coach,
    pool: cls?.pool || defaultProfile.pool,
    lane: cls?.lane || defaultProfile.lane,
    classTime: cls?.start_time || defaultProfile.classTime,
  };
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [demoAuthed, setDemoAuthed] = useState(false);
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [editorOpen, setEditorOpen] = useState(false);

  // ---- boot: restore stored state ----
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(PROFILE_KEY);
        if (stored && !cancelled) setProfile({ ...defaultProfile, ...JSON.parse(stored) });
      } catch {
        /* storage unavailable — demo still works, just doesn't persist */
      }

      if (supabase) {
        const { data } = await supabase.auth.getSession();
        if (!cancelled) {
          setSession(data.session);
          if (data.session) setProfile(await loadRemoteProfile(data.session.user.id));
        }
      } else {
        try {
          const flag = await AsyncStorage.getItem(DEMO_AUTH_KEY);
          if (!cancelled) setDemoAuthed(flag === '1');
        } catch {
          /* ignore */
        }
      }
      if (!cancelled) setReady(true);
    })();

    const sub = supabase?.auth.onAuthStateChange(async (_event, next) => {
      setSession(next);
      if (next) setProfile(await loadRemoteProfile(next.user.id));
    });
    return () => {
      cancelled = true;
      sub?.data.subscription.unsubscribe();
    };
  }, []);

  // ---- persist profile edits locally (demo + as an offline cache) ----
  useEffect(() => {
    AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile)).catch(() => {});
  }, [profile]);

  const updateProfile = useCallback(
    (patch: Partial<Profile>) => {
      setProfile((prev) => ({ ...prev, ...patch }));
      if (!supabase || !session) return;
      const uid = session.user.id;
      // Best-effort remote sync of the editable fields; RLS guarantees we only touch our own rows.
      if (patch.clientName !== undefined || patch.accent !== undefined) {
        supabase
          .from('profiles')
          .update({ ...(patch.clientName !== undefined && { client_name: patch.clientName }), ...(patch.accent !== undefined && { accent: patch.accent }) })
          .eq('id', uid)
          .then(() => {});
      }
      if (patch.swimmerName !== undefined || patch.swimmerAge !== undefined || patch.level !== undefined) {
        supabase
          .from('swimmers')
          .update({
            ...(patch.swimmerName !== undefined && { name: patch.swimmerName }),
            ...(patch.swimmerAge !== undefined && { age: patch.swimmerAge ? Number(patch.swimmerAge) : null }),
            ...(patch.level !== undefined && { level: patch.level }),
          })
          .eq('owner_id', uid)
          .then(() => {});
      }
      if (patch.plan !== undefined) {
        supabase.from('memberships').update({ plan: patch.plan }).eq('owner_id', uid).then(() => {});
      }
    },
    [session]
  );

  const resetProfile = useCallback(() => setProfile(defaultProfile), []);

  const signIn = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    if (!supabase) {
      setDemoAuthed(true);
      await AsyncStorage.setItem(DEMO_AUTH_KEY, '1').catch(() => {});
      return {};
    }
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    return error ? { error: humanizeAuthError(error.message) } : {};
  }, []);

  const signUp = useCallback(async ({ email, password, clientName, swimmerName }: SignUpInput): Promise<AuthResult> => {
    if (!supabase) {
      setProfile((prev) => ({ ...prev, clientName: clientName || prev.clientName, swimmerName: swimmerName || prev.swimmerName }));
      setDemoAuthed(true);
      await AsyncStorage.setItem(DEMO_AUTH_KEY, '1').catch(() => {});
      return {};
    }
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      // Read by the on_auth_user_created trigger in supabase/schema.sql
      options: { data: { client_name: clientName, swimmer_name: swimmerName } },
    });
    return error ? { error: humanizeAuthError(error.message) } : {};
  }, []);

  const signOut = useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
    setDemoAuthed(false);
    await AsyncStorage.removeItem(DEMO_AUTH_KEY).catch(() => {});
  }, []);

  const demoLogin = useCallback(async () => {
    setDemoAuthed(true);
    await AsyncStorage.setItem(DEMO_AUTH_KEY, '1').catch(() => {});
  }, []);

  const isAuthed = supabase ? Boolean(session) : demoAuthed;

  const value = useMemo<AppStateValue>(
    () => ({
      ready,
      isAuthed,
      demoMode: !supabaseConfigured,
      profile,
      role: profile.role,
      updateProfile,
      resetProfile,
      signIn,
      signUp,
      signOut,
      demoLogin,
      editorOpen,
      setEditorOpen,
    }),
    [ready, isAuthed, profile, updateProfile, resetProfile, signIn, signUp, signOut, demoLogin, editorOpen]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppState(): AppStateValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAppState must be used inside AppStateProvider');
  return v;
}
