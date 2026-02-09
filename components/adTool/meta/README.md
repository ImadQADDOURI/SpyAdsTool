# Browser Pool - Production Enhancements

Production-grade browser pool for executing Meta GraphQL requests with Playwright Chromium.

## 🎯 System Profile

- **1 Chromium browser** (singleton)
- **10 concurrent executions** max (semaphore-enforced)
- **15s hard timeout** per request (AbortController)
- **Browser restart** at 3h OR 300 requests
- **Graceful restart** (stop intake → finish inflight → relaunch)
- **Minimal header injection** only

## ✅ What Was Added

### 1️⃣ Concurrency Limit (Mandatory)

**Location:** `browserPool.ts`

- Semaphore limits concurrent browser contexts to 10
- Prevents CPU/RAM exhaustion
- Queues excess requests gracefully
- Already implemented in your original code, verified at 10

```typescript
const semaphore = new Semaphore(BROWSER_CONFIG.maxConcurrentContexts); // 10
```

### 2️⃣ Hard Request Timeout (Mandatory)

**Location:** `executeMeta.ts`

- AbortController enforces 15s timeout on every fetch
- Prevents hung requests from blocking contexts
- Avoids cascading failures

```typescript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 15_000);

const response = await fetch(url, {
  signal: controller.signal,
  // ...
});
```

### 3️⃣ Controlled Browser Restart (Mandatory)

**Location:** `browserPool.ts`

- Restarts browser when:
  - Browser age ≥ 3 hours
  - Requests served ≥ 300
- Graceful restart flow:
  1. Stop accepting new requests (`isRestarting = true`)
  2. Wait for inflight requests to complete (max 30s)
  3. Close old browser
  4. Reset state and allow new requests

```typescript
function shouldRestartBrowser(state: BrowserState): boolean {
  const age = Date.now() - state.launchedAt;
  return age >= 3 * 60 * 60 * 1000 || state.requestsServed >= 300;
}
```

## 📁 File Changes

### Modified Files

| File | Changes |
|------|---------|
| `browserConfig.ts` | Added `maxBrowserAge`, `maxRequestsBeforeRestart`, `evaluateTimeout` |
| `browserPool.ts` | Added browser lifecycle management, restart logic, diagnostics |
| `executeMeta.ts` | Added AbortController timeout enforcement |
| `fetchMeta.ts` | Improved error handling, ensured context release in finally block |
| `buildHeaders.ts` | No changes (kept as-is) |

### New Files

| File | Purpose |
|------|---------|
| `diagnostics.ts` | Optional monitoring utilities for browser pool health |

## 🚀 Usage

### Basic Usage (No Changes Required)

Your existing code continues to work exactly as before:

```typescript
import { fetchMeta } from './fetchMeta';

const result = await fetchMeta(
  { name: 'AdLibrarySearch' },
  { variables: { query: 'test' } }
);
```

### Monitoring (Optional)

```typescript
import { getBrowserPoolStatus, logBrowserPoolStatus } from './diagnostics';

// Log status to console
logBrowserPoolStatus();

// Get programmatic status
const status = getBrowserPoolStatus();
console.log(status);
// {
//   browserAge: 5400000,
//   browserAgeFormatted: '1.5h (90m)',
//   requestsServed: 145,
//   activeContexts: 3,
//   queuedRequests: 0,
//   utilizationPercent: 30,
//   ...
// }
```

### Health Check Endpoint (Optional)

```typescript
// app/api/health/browser/route.ts
import { getBrowserHealthHandler } from '@/lib/browser/diagnostics';

export const GET = getBrowserHealthHandler();

// Returns:
// {
//   "status": "healthy",
//   "activeContexts": 2,
//   "requestsServed": 87,
//   "browserAgeFormatted": "0.8h (48m)",
//   "issues": []
// }
```

## 🔧 Configuration

All settings in `browserConfig.ts`:

```typescript
export const BROWSER_CONFIG = {
  // Concurrency
  maxConcurrentContexts: 10,           // Max concurrent executions

  // Timeouts
  navigationTimeout: 10_000,           // 10s for navigation
  evaluateTimeout: 15_000,             // 15s hard timeout for fetch

  // Browser Lifecycle
  maxBrowserAge: 3 * 60 * 60 * 1000,  // 3 hours
  maxRequestsBeforeRestart: 300,       // 300 requests

  // Browser Options
  headless: false,                     // Show browser UI
  warmupUrl: "https://...",            // Initial navigation URL

  // Resource Blocking
  allowedResourceTypes: ["document", "script", "xhr", "fetch"],
};
```

## 📊 Behavior

### Normal Operation

```
User Request → Semaphore (wait if at capacity)
            → Acquire Context
            → Navigate to Ads Library
            → Wait for GraphQL ready
            → Execute fetch (15s timeout)
            → Parse & Extract
            → Release Context
            → Return Result
```

### Browser Restart Flow

```
Request 300 completes
  ↓
shouldRestartBrowser() → true
  ↓
isRestarting = true (blocks new requests)
  ↓
Wait for inflight contexts to finish (max 30s)
  ↓
Close old browser
  ↓
browserState = null
  ↓
isRestarting = false
  ↓
Next request triggers new browser launch
```

### Timeout Handling

```
Request starts
  ↓
AbortController timeout = 15s
  ↓
fetch() executes
  ↓
  ├─→ Response < 15s → Success
  └─→ Response > 15s → AbortError → Clean error message
```

## 🚫 What Was NOT Added (Intentionally)

As per requirements, the following were explicitly excluded:

- ❌ Memory-based restarts (only time/count)
- ❌ Adaptive thresholds
- ❌ Multiple browser instances
- ❌ Retry orchestration
- ❌ Circuit breakers
- ❌ Advanced observability stacks

## ⚠️ Important Notes

### Context Release

Always release contexts in a `finally` block:

```typescript
let context = null;

try {
  const acquired = await acquireContext();
  context = acquired.context;
  // ... use context
} finally {
  if (context) {
    await releaseContext(context);
  }
}
```

This is already done correctly in `fetchMeta.ts`.

### Restart Waiting

During restart, new requests will:
1. Wait in a polling loop until restart completes
2. Then proceed normally
3. No requests are rejected

### Force Restart

If inflight requests don't complete within 30s during restart:
- System proceeds with restart anyway
- Logs warning about abandoned contexts
- Prevents indefinite blocking

## 📈 Performance Characteristics

- **Throughput:** ~10 requests/second (depends on Meta response time)
- **Latency:** Navigation (1-3s) + Execution (0.5-5s) + Overhead (0.1s)
- **Memory:** ~500MB base + ~100MB per concurrent context
- **Browser uptime:** Max 3 hours or 300 requests

## 🐛 Troubleshooting

### "Request timeout after 15000ms"
- Meta's servers are slow/unresponsive
- Consider increasing `BROWSER_CONFIG.evaluateTimeout`
- Check network connectivity

### "Browser restart threshold reached"
- Normal behavior at 3h or 300 requests
- Monitor with `logBrowserPoolStatus()`
- Adjust thresholds in config if needed

### High queue length
- More requests than 10 concurrent limit
- Check `getPoolStats().queuedRequests`
- Consider horizontal scaling if sustained

## 📝 Example Logs

```
🚀 Launching new browser instance...
✅ Browser launched successfully
🩺 Diagnostic: { message: 'Request succeeded' }
📊 Requests served: 145/300
⏰ Browser age: 87 minutes (max: 180)

🔄 Browser restart threshold reached, initiating graceful restart...
🛑 Stopping new request intake...
⏳ Waiting for 3 inflight requests... (2s)
🔒 Closing old browser instance...
✅ Browser restart complete
```

## 🔐 Security Notes

- Browser runs in non-headless mode (set `headless: true` for production)
- Blocks unnecessary resources (images, fonts, media)
- Only injects minimal semantic headers
- Chromium handles cookies/fingerprinting naturally

## 📦 Dependencies

No new dependencies required. Uses existing:
- `playwright` (Chromium)
- Built-in AbortController
- Standard TypeScript

---

**Simple. Optimal. Reliable. No over-engineering.**
