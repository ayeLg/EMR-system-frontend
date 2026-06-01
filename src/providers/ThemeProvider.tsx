"use client";

import { App, ConfigProvider, theme as antdTheme } from "antd";
import { useUIStore } from "@/store/ui-store";
import { baseTokens, componentTokens } from "@/theme/tokens";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const mode = useUIStore((s) => s.theme);

  return (
    <ConfigProvider
      theme={{
        algorithm:
          mode === "dark"
            ? antdTheme.darkAlgorithm
            : antdTheme.defaultAlgorithm,
        token: baseTokens,
        components: componentTokens,
      }}
      componentSize="small"
    >
      <App>{children}</App>
    </ConfigProvider>
  );
}
