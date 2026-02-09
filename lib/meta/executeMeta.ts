/**
 * executeMeta.ts
 *
 * Executes Meta GraphQL POST inside a Chromium page using window.fetch().
 * Enforces hard 15s timeout with AbortController.
 * Returns raw response text for parsing.
 */

import { type Page } from "playwright";

import { BROWSER_CONFIG } from "./browserConfig";

interface ExecuteMetaParams {
  url: string;
  headers: Record<string, string>;
  body: string;
}

/**
 * Runs fetch() inside the browser with hard timeout enforcement.
 * Throws on HTTP errors, timeouts, or network failures.
 */
export async function executeMeta(
  page: Page,
  params: ExecuteMetaParams,
): Promise<string> {
  // Set timeout for this specific operation
  page.setDefaultTimeout(BROWSER_CONFIG.evaluateTimeout);

  try {
    const rawText = await page.evaluate(
      async ({ url, headers, body, timeout }) => {
        // Create AbortController for hard timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
          const response = await fetch(url, {
            method: "POST",
            headers,
            body,
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          const text = await response.text();

          if (!response.ok) {
            throw new Error(
              `Meta request failed: ${response.status} ${response.statusText}`,
            );
          }

          return text;
        } catch (error: any) {
          clearTimeout(timeoutId);

          // Handle abort/timeout specifically
          if (error.name === "AbortError") {
            throw new Error(`Request timeout after ${timeout}ms`);
          }

          throw error;
        }
      },
      {
        ...params,
        timeout: BROWSER_CONFIG.evaluateTimeout,
      },
    );

    return rawText;
  } catch (error: any) {
    // Enhance error message
    if (error.message?.includes("Timeout")) {
      throw new Error(
        `Meta GraphQL request timeout after ${BROWSER_CONFIG.evaluateTimeout}ms`,
      );
    }
    throw error;
  } finally {
    // Reset to default timeout to avoid affecting other operations
    page.setDefaultTimeout(30_000);
  }
}
