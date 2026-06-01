"use client";

import { MswProvider } from "./MswProvider";
import { QueryProvider } from "./QueryProvider";
import { IntlProvider } from "./IntlProvider";
import { ThemeProvider } from "./ThemeProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MswProvider>
      <QueryProvider>
        <IntlProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </IntlProvider>
      </QueryProvider>
    </MswProvider>
  );
}
