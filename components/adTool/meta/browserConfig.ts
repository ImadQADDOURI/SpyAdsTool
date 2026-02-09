/**
 * browserConfig.ts
 *
 * Centralized configuration for browser pool behavior.
 * Adjust these values based on your production metrics.
 */

export const BROWSER_CONFIG = {
  // ─── Concurrency ───────────────────────────────────────────────────────────
  /** Maximum concurrent browser contexts per browser instance */
  maxConcurrentContexts: 10,

  // ─── Navigation ────────────────────────────────────────────────────────────
  /** Timeout for initial page navigation (ms) */
  navigationTimeout: 10_000,

  /** Hard timeout for fetch execution inside page.evaluate (ms) */
  evaluateTimeout: 15_000,

  // ─── Browser Lifecycle ─────────────────────────────────────────────────────
  /** Maximum browser age before restart (ms) - 3 hours */
  maxBrowserAge: 3 * 60 * 60 * 1000,

  /** Maximum requests served before browser restart */
  maxRequestsBeforeRestart: 300,

  // ─── Browser Launch Options ────────────────────────────────────────────────
  /** Show browser UI (useful for debugging) */
  headless: false,

  /** Initial warmup URL */
  warmupUrl:
    "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&is_targeted_country=false&media_type=all&q=azerty123456789",

  // ─── Resource Blocking ─────────────────────────────────────────────────────
  /** Resource types to allow (all others blocked) */
  allowedResourceTypes: ["document", "script", "xhr", "fetch"] as const,
} as const;
