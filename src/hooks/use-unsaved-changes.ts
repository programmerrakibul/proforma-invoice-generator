"use client";

import { useEffect } from "react";

/**
 * Wraps `beforeunload` to warn about unsaved changes. Only attaches when
 * `enabled` is true and the browser supports it safely.
 */
export function useUnsavedChanges(
  enabled: boolean,
  onBeforeUnload: (event: BeforeUnloadEvent) => void,
) {
  useEffect(() => {
    if (!enabled) return;

    const handler = (event: BeforeUnloadEvent) => {
      onBeforeUnload(event);
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handler);
    return () => {
      window.removeEventListener("beforeunload", handler);
    };
  }, [enabled, onBeforeUnload]);
}
