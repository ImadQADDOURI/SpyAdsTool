/**
 * diagnostics.ts
 *
 * Optional monitoring utilities for browser pool health.
 * Useful for logging, dashboards, or health checks.
 */

import { getPoolStats } from "./browserPool";

/**
 * Get human-readable browser pool status
 */
export function getBrowserPoolStatus() {
  const stats = getPoolStats();

  const ageMinutes = Math.round(stats.browserAge / 1000 / 60);
  const ageHours = (stats.browserAge / 1000 / 60 / 60).toFixed(1);

  return {
    ...stats,
    browserAgeFormatted: `${ageHours}h (${ageMinutes}m)`,
    utilizationPercent: Math.round(
      (stats.activeContexts / stats.maxConcurrency) * 100,
    ),
    restartThresholds: {
      age: {
        current: ageMinutes,
        max: 180, // 3 hours in minutes
        percentUsed: Math.round((ageMinutes / 180) * 100),
      },
      requests: {
        current: stats.requestsServed,
        max: 300,
        percentUsed: Math.round((stats.requestsServed / 300) * 100),
      },
    },
  };
}

/**
 * Log browser pool status to console
 */
export function logBrowserPoolStatus() {
  const status = getBrowserPoolStatus();

  console.log("\n📊 Browser Pool Status:");
  console.log("─".repeat(50));
  console.log(`  Active Contexts:    ${status.activeContexts}/${status.maxConcurrency} (${status.utilizationPercent}%)`);
  console.log(`  Queued Requests:    ${status.queuedRequests}`);
  console.log(`  Browser Age:        ${status.browserAgeFormatted}`);
  console.log(`  Requests Served:    ${status.requestsServed}/300`);
  console.log(`  Restarting:         ${status.isRestarting ? "YES ⚠️" : "No"}`);
  console.log("─".repeat(50));
  console.log(`  Age Threshold:      ${status.restartThresholds.age.percentUsed}% used`);
  console.log(`  Request Threshold:  ${status.restartThresholds.requests.percentUsed}% used`);
  console.log("─".repeat(50) + "\n");
}

/**
 * Check if browser pool is healthy
 */
export function isBrowserPoolHealthy(): {
  healthy: boolean;
  issues: string[];
} {
  const stats = getPoolStats();
  const issues: string[] = [];

  // Check if restarting
  if (stats.isRestarting) {
    issues.push("Browser is currently restarting");
  }

  // Check if queue is building up
  if (stats.queuedRequests > 20) {
    issues.push(`High queue length: ${stats.queuedRequests} requests waiting`);
  }

  // Check if near restart threshold
  const ageMinutes = stats.browserAge / 1000 / 60;
  if (ageMinutes > 165) {
    // 2h 45m (warning before 3h restart)
    issues.push(`Browser age near restart threshold: ${Math.round(ageMinutes)}m`);
  }

  if (stats.requestsServed > 270) {
    // Warning before 300 restart
    issues.push(`Request count near restart threshold: ${stats.requestsServed}/300`);
  }

  return {
    healthy: issues.length === 0,
    issues,
  };
}

/**
 * Express/Next.js API route handler for health checks
 * 
 * Usage in Next.js:
 * ```typescript
 * // app/api/health/browser/route.ts
 * import { getBrowserHealthHandler } from '@/lib/browser/diagnostics';
 * export const GET = getBrowserHealthHandler;
 * ```
 */
export function getBrowserHealthHandler() {
  return async () => {
    const health = isBrowserPoolHealthy();
    const status = getBrowserPoolStatus();

    return Response.json(
      {
        status: health.healthy ? "healthy" : "degraded",
        ...status,
        issues: health.issues,
      },
      {
        status: health.healthy ? 200 : 503,
      },
    );
  };
}
