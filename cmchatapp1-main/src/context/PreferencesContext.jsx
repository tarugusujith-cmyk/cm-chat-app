import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const PreferencesContext = createContext(null);
const STORAGE_KEY = 'cm-chat-preferences';

const DEFAULTS = {
  notifications: {
    notifications: true,
    showPreviews: true,
    reactionNotifications: false,
    incomingCallRingtone: false,
    sounds: true,
  },
  privacy: {
    lastSeen: 'Everyone',
    profilePhoto: 'Everyone',
    about: 'Everyone',
    readReceipts: true,
    groups: 'Everyone',
  },
  wallpaper: {
    color: null, // null = default
    doodle: true,
  },
};

function loadInitial() {
  if (typeof window === 'undefined') return DEFAULTS;
  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    if (!stored) return DEFAULTS;
    return {
      notifications: { ...DEFAULTS.notifications, ...stored.notifications },
      privacy: { ...DEFAULTS.privacy, ...stored.privacy },
      wallpaper: { ...DEFAULTS.wallpaper, ...stored.wallpaper },
    };
  } catch {
    return DEFAULTS;
  }
}

export function PreferencesProvider({ children }) {
  const [prefs, setPrefs] = useState(loadInitial);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  }, [prefs]);

  const setNotification = useCallback((key, value) => {
    setPrefs((p) => ({ ...p, notifications: { ...p.notifications, [key]: value } }));
  }, []);

  const setPrivacy = useCallback((key, value) => {
    setPrefs((p) => ({ ...p, privacy: { ...p.privacy, [key]: value } }));
  }, []);

  const setWallpaper = useCallback((key, value) => {
    setPrefs((p) => ({ ...p, wallpaper: { ...p.wallpaper, [key]: value } }));
  }, []);

  return (
    <PreferencesContext.Provider value={{ ...prefs, setNotification, setPrivacy, setWallpaper }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error('usePreferences must be used within PreferencesProvider');
  return ctx;
}
