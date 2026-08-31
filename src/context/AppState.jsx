import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { defaultProfile } from '../data/mockData';

const STORAGE_KEY = 'ssc-profile-v1';
const AUTH_KEY = 'ssc-auth-v1';

const AppStateContext = createContext(null);

function loadProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProfile;
    return { ...defaultProfile, ...JSON.parse(raw) };
  } catch {
    return defaultProfile;
  }
}

export function AppStateProvider({ children }) {
  const [profile, setProfile] = useState(loadProfile);
  const [isAuthed, setIsAuthed] = useState(() => {
    try {
      return sessionStorage.getItem(AUTH_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [editorOpen, setEditorOpen] = useState(false);
  const [notices, setNotices] = useState({}); // per-notice read state, keyed by index

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      /* private browsing / storage disabled — demo still works, just doesn't persist */
    }
  }, [profile]);

  function updateProfile(patch) {
    setProfile((prev) => ({ ...prev, ...patch }));
  }

  function resetProfile() {
    setProfile(defaultProfile);
  }

  function login() {
    setIsAuthed(true);
    try {
      sessionStorage.setItem(AUTH_KEY, '1');
    } catch {
      /* ignore */
    }
  }

  function logout() {
    setIsAuthed(false);
    try {
      sessionStorage.removeItem(AUTH_KEY);
    } catch {
      /* ignore */
    }
  }

  const value = useMemo(
    () => ({
      profile,
      updateProfile,
      resetProfile,
      isAuthed,
      login,
      logout,
      editorOpen,
      setEditorOpen,
      notices,
      setNotices,
    }),
    [profile, isAuthed, editorOpen, notices]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used inside AppStateProvider');
  return ctx;
}
