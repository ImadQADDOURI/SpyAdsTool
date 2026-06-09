/**
 * browserPool.ts
 *
 * Production-grade browser pool with:
 * • Concurrency limit (semaphore at 10)
 * • Controlled browser restart (3h OR 300 requests)
 * • Graceful restart handling
 */

import {
  chromium,
  type Browser,
  type BrowserContext,
  type Page,
} from "playwright";

import { BROWSER_CONFIG } from "./browserConfig";

// ─── Semaphore ───────────────────────────────────────────────────────────────
class Semaphore {
  private queue: Array<() => void> = [];
  private current = 0;

  constructor(private readonly max: number) {}

  async acquire(): Promise<void> {
    if (this.current < this.max) {
      this.current++;
      return;
    }
    return new Promise<void>((resolve) => {
      this.queue.push(resolve);
    });
  }

  release(): void {
    const next = this.queue.shift();
    if (next) {
      next();
    } else {
      this.current--;
    }
  }

  /**
   * Get current number of active acquisitions
   */
  getCurrentLoad(): number {
    return this.current;
  }

  /**
   * Get number of queued requests
   */
  getQueueLength(): number {
    return this.queue.length;
  }
}

// ─── Browser State ───────────────────────────────────────────────────────────
interface BrowserState {
  instance: Browser;
  launchedAt: number;
  requestsServed: number;
}

let browserState: BrowserState | null = null;
const semaphore = new Semaphore(BROWSER_CONFIG.maxConcurrentContexts);

// Flag to prevent new requests during restart
let isRestarting = false;

// ─── Browser Lifecycle ───────────────────────────────────────────────────────

/**
 * Get or create browser instance.
 * Note: Restart checks now happen in acquireContext() before semaphore acquisition.
 */
export async function getBrowser(): Promise<Browser> {
  // Create browser if not exists
  if (!browserState || !browserState.instance.isConnected()) {
    console.log("🚀 Launching new browser instance...");
    const instance = await chromium.launch({
      headless: BROWSER_CONFIG.headless,
    });

    browserState = {
      instance,
      launchedAt: Date.now(),
      requestsServed: 0,
    };

    console.log("✅ Browser launched successfully");
  }

  return browserState.instance;
}

/**
 * Check if browser should be restarted based on age or request count
 */
function shouldRestartBrowser(state: BrowserState): boolean {
  const age = Date.now() - state.launchedAt;
  const ageExceeded = age >= BROWSER_CONFIG.maxBrowserAge;
  const requestsExceeded =
    state.requestsServed >= BROWSER_CONFIG.maxRequestsBeforeRestart;

  if (ageExceeded) {
    console.log(
      `⏰ Browser age: ${Math.round(age / 1000 / 60)} minutes (max: ${BROWSER_CONFIG.maxBrowserAge / 1000 / 60})`,
    );
  }

  if (requestsExceeded) {
    console.log(
      `📊 Requests served: ${state.requestsServed} (max: ${BROWSER_CONFIG.maxRequestsBeforeRestart})`,
    );
  }

  return ageExceeded || requestsExceeded;
}

/**
 * Gracefully restart browser:
 * 1. Stop accepting new requests
 * 2. Wait for inflight requests to complete
 * 3. Close old browser
 * 4. Launch new browser
 */
async function restartBrowser(): Promise<void> {
  if (isRestarting) {
    console.log("⏳ Restart already in progress, waiting...");
    // Wait for restart to complete
    while (isRestarting) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return;
  }

  isRestarting = true;

  try {
    console.log("🛑 Stopping new request intake...");

    // Wait for all inflight requests to complete
    const maxWaitTime = 30_000; // 30 seconds max wait
    const startWait = Date.now();

    while (semaphore.getCurrentLoad() > 0) {
      const elapsed = Date.now() - startWait;

      if (elapsed > maxWaitTime) {
        console.warn(
          `⚠️ Force restart after ${maxWaitTime}ms - ${semaphore.getCurrentLoad()} requests still inflight`,
        );
        break;
      }

      console.log(
        `⏳ Waiting for ${semaphore.getCurrentLoad()} inflight requests... (${Math.round(elapsed / 1000)}s)`,
      );
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // Close old browser
    if (browserState?.instance) {
      console.log("🔒 Closing old browser instance...");
      await browserState.instance.close();
    }

    // Reset state
    browserState = null;

    console.log("✅ Browser restart complete");
  } finally {
    isRestarting = false;
  }
}

// ─── Context Management ──────────────────────────────────────────────────────

/**
 * Acquires a context + page and navigates to the Ads Library.
 *
 * CRITICAL: Caller MUST call releaseContext(context) in finally block.
 *
 * GraphQL Readiness Strategy:
 *   • Navigate to Ads Library search URL
 *   • Block unnecessary resources (images/fonts/media/etc.)
 *   • Wait for DOMContentLoaded
 *   • Wait for first successful GraphQL request as readiness signal
 *   • No timers, no idle detection, no guessing
 *
 * If Meta blocks your VPS, the network drops, or the DOM changes:
 *   •graphqlReadyPromise hits the BROWSER_CONFIG.graphqlTimeout limit.
 *   •Playwright securely throws a TimeoutError.
 *   •Execution instantly jumps to the catch block.
 *   •The dangling headless browser context is safely destroyed.
 *   •The semaphore slot is released so the rest of your app keeps humming.
 *   •The error bubbles up to your main logic so your app can retry via proxy or log the failure.
 */
export async function acquireContext(): Promise<{
  context: BrowserContext;
  page: Page;
}> {
  // Check if restart is needed BEFORE acquiring semaphore
  if (browserState && shouldRestartBrowser(browserState)) {
    console.log(
      "🔄 Browser restart threshold reached, initiating graceful restart...",
    );
    await restartBrowser();
  }

  // Wait if restart is in progress
  while (isRestarting) {
    console.log("⏸️ Waiting for browser restart to complete...");
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // Acquire semaphore slot (enforces concurrency limit)
  await semaphore.acquire();

  // 1. Declare context OUTSIDE the try block so the catch block can clean it up
  let context: BrowserContext | undefined;

  try {
    const b = await getBrowser();
    context = await b.newContext();
    const page = await context.newPage();

    // Block everything except allowed resource types
    await page.route("**/*", (route) => {
      const type = route.request().resourceType();
      if (BROWSER_CONFIG.allowedResourceTypes.includes(type as any)) {
        route.continue();
      } else {
        route.abort();
      }
    });

    // ── GraphQL Readiness Detection (Playwright Native) ────────────────────

    // Step 1: Tell Playwright to start listening for the GraphQL response
    const graphqlReadyPromise = page.waitForResponse(
      (response) =>
        response.url().includes(BROWSER_CONFIG.graphqlReadinessUrl) &&
        response.ok(),
      { timeout: BROWSER_CONFIG.graphqlTimeout },
    );

    // Step 2: Navigate to a search URL to trigger the GraphQL requests
    await page.goto(BROWSER_CONFIG.warmupUrl, {
      waitUntil: "domcontentloaded",
      timeout: BROWSER_CONFIG.navigationTimeout,
    });

    // Step 3: Await the response. If it takes longer than graphqlTimeout, it throws safely!
    await graphqlReadyPromise;

    // Increment request counter
    if (browserState) {
      browserState.requestsServed++;
    }

    return { context, page };
  } catch (error) {
    // Prevent memory leaks by safely closing the orphaned context
    if (context) {
      // The empty catch prevents masking the original timeout error if close() also fails
      await context.close().catch(() => {});
    }

    // Release semaphore on error to prevent deadlocks
    semaphore.release();
    throw error;
  }
}

/**
 * Release context and semaphore slot.
 * MUST be called in finally block.
 */
export async function releaseContext(context: BrowserContext): Promise<void> {
  try {
    await context.close();
  } catch (error) {
    console.error("❌ Error closing context:", error);
  } finally {
    semaphore.release();
  }
}

// ─── Shutdown ────────────────────────────────────────────────────────────────

/**
 * Graceful shutdown for application termination
 */
export async function shutdownBrowser(): Promise<void> {
  console.log("🛑 Shutting down browser pool...");

  // Stop accepting new requests
  isRestarting = true;

  try {
    // Wait for inflight requests
    const maxWaitTime = 30_000;
    const startWait = Date.now();

    while (semaphore.getCurrentLoad() > 0) {
      const elapsed = Date.now() - startWait;

      if (elapsed > maxWaitTime) {
        console.warn(
          `⚠️ Force shutdown after ${maxWaitTime}ms - ${semaphore.getCurrentLoad()} requests still inflight`,
        );
        break;
      }

      console.log(
        `⏳ Waiting for ${semaphore.getCurrentLoad()} inflight requests...`,
      );
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // Close browser
    if (browserState?.instance) {
      await browserState.instance.close();
      browserState = null;
    }

    console.log("✅ Browser pool shutdown complete");
  } finally {
    isRestarting = false;
  }
}

// ─── Diagnostics ─────────────────────────────────────────────────────────────

/**
 * Get current pool statistics (useful for monitoring)
 */
export function getPoolStats() {
  return {
    isRestarting,
    browserAge: browserState ? Date.now() - browserState.launchedAt : 0,
    requestsServed: browserState?.requestsServed ?? 0,
    activeContexts: semaphore.getCurrentLoad(),
    queuedRequests: semaphore.getQueueLength(),
    maxConcurrency: BROWSER_CONFIG.maxConcurrentContexts,
  };
}
