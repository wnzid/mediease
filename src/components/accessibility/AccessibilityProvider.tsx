"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type AccessibilityState = {
  textSize: "default" | "large" | "extra-large";
  reducedMotion: boolean;
  highContrast: boolean;
  simplifiedInterface: boolean;
  preferredLanguage: string;
};

type AccessibilityContextValue = AccessibilityState & {
  updatePreference: <K extends keyof AccessibilityState>(key: K, value: AccessibilityState[K]) => void;
};

const STORAGE_KEY = "mediease-accessibility";

const defaultState: AccessibilityState = {
  textSize: "default",
  reducedMotion: false,
  highContrast: false,
  simplifiedInterface: false,
  preferredLanguage: "English",
};

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AccessibilityState>(() => {
    if (typeof window === "undefined") {
      return defaultState;
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState;
      return { ...defaultState, ...(JSON.parse(raw) as AccessibilityState) };
    } catch {
      return defaultState;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.textSize = state.textSize;
    root.dataset.contrast = state.highContrast ? "high" : "default";
    root.dataset.motion = state.reducedMotion ? "reduced" : "default";
    root.dataset.simplified = state.simplifiedInterface ? "true" : "false";
    root.lang = state.preferredLanguage.toLowerCase().startsWith("spanish") ? "es" : "en";

    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo<AccessibilityContextValue>(
    () => ({
      ...state,
      updatePreference: (key, nextValue) => setState((current) => ({ ...current, [key]: nextValue })),
    }),
    [state],
  );

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
}

export function useAccessibilityPreferences() {
  const context = useContext(AccessibilityContext);

  if (!context) {
    throw new Error("useAccessibilityPreferences must be used within AccessibilityProvider");
  }

  return context;
}
