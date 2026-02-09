/**
 * buildHeaders.ts
 *
 * Extracts only allowed semantic headers from stored Meta requests.
 * Chromium supplies all other headers (user-agent, cookies, etc.) naturally.
 */

const ALLOWED_HEADERS: Record<string, { defaultValue?: string }> = {
  accept: {},
  origin: {},
  referer: { defaultValue: "https://www.facebook.com/ads/library/" },
  "content-type": { defaultValue: "application/x-www-form-urlencoded" },
  "x-fb-friendly-name": {},
};

/**
 * Returns minimal header set for Meta GraphQL requests.
 * Only includes allowed headers; falls back to defaults where defined.
 */
export function buildHeaders(
  storedHeaders: Record<string, string>,
): Record<string, string> {
  const lower: Record<string, string> = {};
  for (const [k, v] of Object.entries(storedHeaders)) {
    lower[k.toLowerCase()] = v;
  }

  const out: Record<string, string> = {};

  for (const [name, { defaultValue }] of Object.entries(ALLOWED_HEADERS)) {
    const value = lower[name] ?? defaultValue;
    if (value !== undefined) {
      out[name] = value;
    }
  }

  return out;
}
