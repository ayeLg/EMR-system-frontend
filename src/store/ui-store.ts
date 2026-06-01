import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark";
export type Locale = "en" | "my";

interface UIState {
  theme: ThemeMode;
  locale: Locale;
  sidebarCollapsed: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: "light",
      locale: "en",
      sidebarCollapsed: false,
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),
      setLocale: (locale) => set({ locale }),
      toggleLocale: () =>
        set((s) => ({ locale: s.locale === "en" ? "my" : "en" })),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      toggleSidebar: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
    }),
    { name: "emr-ui" },
  ),
);
