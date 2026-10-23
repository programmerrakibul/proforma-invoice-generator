const DEFAULT_AUTH_REDIRECT = "/invoices";

const baseURL = process.env.BETTER_AUTH_URL;

export function getSafeAuthRedirect(redirect: string | undefined): string {
  if (!redirect || !redirect.startsWith("/") || redirect.startsWith("//")) {
    return DEFAULT_AUTH_REDIRECT;
  }

  try {
    const parsed = new URL(redirect, baseURL);
    if (parsed.origin !== baseURL) return DEFAULT_AUTH_REDIRECT;
    if (parsed.pathname.startsWith("/auth/")) return DEFAULT_AUTH_REDIRECT;
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return DEFAULT_AUTH_REDIRECT;
  }
}
