import { useCallback, useState } from "react";

/**
 * "Have we already shown this in this session?" flag backed by sessionStorage.
 * Falls back to in-memory state when storage is blocked (private mode, iframes).
 */
export function useSessionOnce(key: string) {
  const [seen, setSeen] = useState<boolean>(() => {
    try {
      return window.sessionStorage.getItem(key) === "1";
    } catch {
      return false;
    }
  });

  const markSeen = useCallback(() => {
    try {
      window.sessionStorage.setItem(key, "1");
    } catch {
      /* storage unavailable — in-memory flag below still works for this mount */
    }
    setSeen(true);
  }, [key]);

  return { seen, markSeen };
}
