"use client";

import { useEffect, useState } from "react";

/**
 * Client-side media query hook. Safe to use in client components only.
 * Initializes state from the current match so the first client render already
 * reflects the query result; subsequent changes update via the listener.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const media = window.matchMedia(query);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    media.addEventListener("change", handler);
    return () => {
      media.removeEventListener("change", handler);
    };
  }, [query]);

  return matches;
}
