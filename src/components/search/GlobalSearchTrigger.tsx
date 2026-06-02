"use client";

import { useTranslations } from "next-intl";
import { SearchInput } from "@/components/ui/SearchInput";
import { useIsMac } from "@/hooks/useIsMac";
import { useUIStore } from "@/store/ui-store";

/** Topbar search field — opens the command palette (⌘K / Ctrl+K). */
export function GlobalSearchTrigger() {
  const t = useTranslations("common");
  const isMac = useIsMac();
  const setOpen = useUIStore((s) => s.setCommandPaletteOpen);

  const shortcutLabel = isMac ? "⌘K" : "Ctrl+K";

  return (
    <SearchInput
      wide
      readOnly
      placeholder={t("globalSearch")}
      onClick={() => setOpen(true)}
      onFocus={(e) => {
        e.target.blur();
        setOpen(true);
      }}
      suffix={
        <kbd className="emr-global-search-kbd" aria-hidden>
          {shortcutLabel}
        </kbd>
      }
      style={{ maxWidth: "100%", cursor: "pointer" }}
      aria-label={t("globalSearch")}
      aria-haspopup="dialog"
    />
  );
}
