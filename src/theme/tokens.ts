import type { ThemeConfig } from "antd";

/**
 * Clinical Blue — EMR design tokens.
 * Shared across light & dark algorithms (see ThemeProvider).
 */
export const baseTokens: ThemeConfig["token"] = {
  colorPrimary: "#1677FF",
  borderRadius: 8,
  fontFamily:
    "var(--font-inter), var(--font-myanmar), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontSize: 14,
};

/** Compact, consistent component sizing for a data-dense EMR. */
export const componentTokens: ThemeConfig["components"] = {
  Layout: {
    headerHeight: 48,
    headerPadding: "0 16px",
  },
  Menu: {
    itemBorderRadius: 8,
    itemMarginInline: 8,
  },
};
