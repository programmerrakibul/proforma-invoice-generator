const DEFAULT_AUTH_REDIRECT = "/invoices";

export function getSafeAuthRedirect(redirect: string | undefined): string {
  if (!redirect || !redirect.startsWith("/") || redirect.startsWith("//")) {
    return DEFAULT_AUTH_REDIRECT;
  }

  try {
    const parsed = new URL(redirect, "https://mmfabrics.local");
    if (parsed.origin !== "https://mmfabrics.local") return DEFAULT_AUTH_REDIRECT;
    if (parsed.pathname.startsWith("/auth/")) return DEFAULT_AUTH_REDIRECT;
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return DEFAULT_AUTH_REDIRECT;
  }
}
