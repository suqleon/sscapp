import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Session } from '@supabase/supabase-js';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { supabase, supabaseConfigured } from '@/lib/supabase';

const DEMO_AUTH_KEY = 'ssc-demo-auth-v1';

type SignUpInput = { email: string; password: string; clientName: string; swimmerName: string };
type AuthResult = { error?: string };

type AppStateValue = {
  /** False until the stored session has been read. Keep the splash up until then. */
  ready: boolean;
  isAuthed: boolean;
  demoMode: boolean;
  session: Session | null;
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

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [demoAuthed, setDemoAuthed] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (supabase) {
        const { data } = await supabase.auth.getSession();
        if (!cancelled) setSession(data.session);
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
    const sub = supabase?.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => {
      cancelled = true;
      sub?.data.subscription.unsubscribe();
    };
  }, []);

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
    () => ({ ready, isAuthed, demoMode: !supabaseConfigured, session, signIn, signUp, signOut, demoLogin, editorOpen, setEditorOpen }),
    [ready, isAuthed, session, signIn, signUp, signOut, demoLogin, editorOpen]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppState(): AppStateValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAppState must be used inside AppStateProvider');
  return v;
}
