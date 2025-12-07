// components\adTool\meta\fetchMeta.ts
"use server";

import { toggleMetaRequest } from "@/actions/metaRequests";
import { JSONPath } from "jsonpath-plus";
import { ProxyAgent, fetch as undiciFetch } from "undici";

import { prisma } from "@/lib/db";

// Can add/remove codes or summaries here as needed
const AUTO_TOGGLE_ERRORS: Array<{ error?: number; errorSummary?: string }> = [
  { error: 1357001, errorSummary: "Log in to continue" }, // login required
  { error: 1357004, errorSummary: "Sorry, something went wrong" }, //  "errorDescription": "Please try closing and re-opening your browser window."
  // { errorSummary: "Rate limit exceeded" }, // example: throttling
];

/**
 * Executes a Meta GraphQL request using either ID or name.
 * Returns extracted fields based on JSONPath configuration.
 */
export async function fetchMeta(
  identifier: { id?: string; name?: string },
  options?: {
    variables?: Record<string, any>;
    includeRaw?: boolean;
  },
) {
  try {
    // 1️⃣ Load configuration from database
    const config = await loadMetaConfig(identifier);
    const { base_request, fields_to_extract } = config as any;

    if (!base_request?.url)
      throw new Error("Invalid base_request: missing url");

    // 2️⃣ Prepare request with optional variable overrides
    const { url, method, requestHeaders, requestBody } = base_request;
    const finalBody = options?.variables
      ? overrideVariables(requestBody, options.variables)
      : requestBody;

    // 3️⃣ Execute request (with proxy support if configured)
    const proxyFetch = createProxyFetch();
    const response = await proxyFetch(url, {
      method: method || "POST",
      headers: sanitizeHeaders(requestHeaders),
      body: finalBody,
    });

    const text = await response.text();
    if (!response.ok)
      throw new Error(`Meta request failed: ${response.status}`);

    // 4️⃣ Parse Meta's response (handles multiple concatenated JSON objects)
    const parsedResponses = parseMultiJsonResponse(text);

    // 5️⃣ Extract fields using JSONPath and return clean result
    const extracted = extractFields(parsedResponses, fields_to_extract);

    // Analyze the first response
    const diagnostics = await analyzeResponse(
      parsedResponses,
      config.id,
      config.is_active,
    );
    console.log("🩺 Diagnostic:", diagnostics, "\n", {
      id: config.id,
      name: config.name,
    });

    return {
      success: true, // request executed successfully
      id: config.id,
      name: config.name,
      extracted,
      diagnostics,
      raw: options?.includeRaw ? parsedResponses : undefined,
    };
  } catch (error: any) {
    console.error("❌ fetchMeta error:", error);
    return {
      success: false,
      diagnostics: {
        message: error.message || "Unknown error",
      },
    };
  }
}

/**
 * Override or merge variables in a URL-encoded GraphQL body.
 * Only updates existing keys in the base request variables.
 */
function overrideVariables(body: string, newVars: Record<string, any>): string {
  try {
    const params = new URLSearchParams(body);
    const existingVarsRaw = params.get("variables");

    // If no existing variables, just set new ones
    if (!existingVarsRaw) {
      params.set("variables", JSON.stringify(newVars));
      return params.toString();
    }

    // Parse existing variables (handle both encoded and plain JSON)
    let existingVars: Record<string, any> = {};
    try {
      // If it's encoded (like %7B...), decode first
      existingVars = JSON.parse(
        existingVarsRaw.startsWith("%7B")
          ? decodeURIComponent(existingVarsRaw)
          : existingVarsRaw,
      );
    } catch {
      existingVars = {};
    }

    // Merge new variables into existing ones
    const merged = { ...existingVars, ...newVars };

    console.log("🧩 Final Variables used in fetch:", merged);

    // Update the variables parameter
    params.set("variables", JSON.stringify(merged));

    return params.toString();
  } catch (err) {
    console.error("❌ Failed to override variables:", err);
    return body;
  }
}

/**
 * Sanitizes headers for use with standard fetch API.
 * Removes HTTP/2 pseudo-headers and headers that fetch handles automatically.
 */
function sanitizeHeaders(
  headers: Record<string, string>,
): Record<string, string> {
  const sanitized: Record<string, string> = {};

  for (const [key, value] of Object.entries(headers)) {
    const lowerKey = key.toLowerCase();

    // Skip HTTP/2 pseudo-headers (start with ':')
    if (lowerKey.startsWith(":")) continue;

    // Skip headers that fetch/browser handles automatically
    if (lowerKey === "accept-encoding" || lowerKey === "content-length") {
      continue;
    }

    // Keep everything else as-is
    sanitized[key] = value;
  }

  return sanitized;
}

/**
 * Parses Meta's response which may contain multiple JSON objects
 * concatenated together like: {"data": {...}}{"data": {...}}
 *
 * Uses bracket counting for efficient O(n) parsing instead of regex.
 */
function parseMultiJsonResponse(raw: string): any[] {
  const results: any[] = [];
  let depth = 0;
  let start = -1;
  let inString = false;
  let escapeNext = false;

  for (let i = 0; i < raw.length; i++) {
    const char = raw[i];

    // Handle escape sequences in strings
    if (escapeNext) {
      escapeNext = false;
      continue;
    }
    if (char === "\\") {
      escapeNext = true;
      continue;
    }

    // Track string boundaries (don't count brackets inside strings)
    if (char === '"') {
      inString = !inString;
      continue;
    }

    // Count brackets only outside of strings
    if (!inString) {
      if (char === "{") {
        if (depth === 0) start = i;
        depth++;
      } else if (char === "}") {
        depth--;
        // When we close a top-level object, parse it
        if (depth === 0 && start !== -1) {
          try {
            results.push(JSON.parse(raw.substring(start, i + 1)));
          } catch {
            // Skip invalid JSON fragments
          }
          start = -1;
        }
      }
    }
  }

  return results;
}

/**
 * Extracts fields from multiple JSON responses using JSONPath expressions.
 * Combines results from all responses into a single clean object.
 *
 * - Deduplicates values across responses
 * - Returns single value if only one unique result found
 * - Returns array if multiple unique values exist
 */
function extractFields(
  responses: any[],
  fieldPaths: Record<string, string>,
): Record<string, any> {
  // Use Sets to automatically handle deduplication
  const fieldSets: Record<string, Set<string>> = {};

  // Initialize a Set for each field
  for (const fieldName of Object.keys(fieldPaths)) {
    fieldSets[fieldName] = new Set();
  }

  // Process all responses and extract fields
  for (const json of responses) {
    for (const [fieldName, jsonPath] of Object.entries(fieldPaths)) {
      try {
        // Extract values using JSONPath (wrap: false avoids extra array nesting)
        const result = JSONPath({ path: jsonPath, json, wrap: false });

        if (result === undefined || result === null) continue;

        // Handle both single values and arrays
        const values = Array.isArray(result) ? result : [result];

        for (const value of values) {
          // Skip empty values
          if (value === undefined || value === null || value === "") continue;
          if (Array.isArray(value) && value.length === 0) continue;

          // Store as JSON string for complex objects, direct string for primitives
          const serialized =
            typeof value === "object" ? JSON.stringify(value) : String(value);
          fieldSets[fieldName].add(serialized);
        }
      } catch (err) {
        // Store error info for this field
        fieldSets[fieldName].add(
          JSON.stringify({ error: (err as Error).message }),
        );
      }
    }
  }

  // Convert Sets back to final values
  const result: Record<string, any> = {};

  for (const [fieldName, valueSet] of Object.entries(fieldSets)) {
    if (valueSet.size === 0) continue;

    // Deserialize values
    const deserializedValues = Array.from(valueSet).map((serialized) => {
      try {
        return JSON.parse(serialized);
      } catch {
        // Keep as string if it wasn't valid JSON
        return serialized;
      }
    });

    // Return single value if only one, otherwise return array
    result[fieldName] =
      deserializedValues.length === 1
        ? deserializedValues[0]
        : deserializedValues;
  }

  return result;
}

/**
 * Loads a Meta GraphQL config by ID or randomly by name.
 * When using name, randomly selects from active configs for rotation.
 */
async function loadMetaConfig(identifier: { id?: string; name?: string }) {
  if (identifier.id) {
    const config = await prisma.metaGraphQLRequest.findUnique({
      where: { id: identifier.id },
    });
    if (!config)
      throw new Error(`No MetaGraphQLRequest found for id=${identifier.id}`);
    return config;
  }

  if (identifier.name) {
    const configs = await prisma.metaGraphQLRequest.findMany({
      where: { name: identifier.name, is_active: true },
    });
    if (!configs.length)
      throw new Error(
        `No active MetaGraphQLRequest found for name=${identifier.name}`,
      );
    // Pick a random config for rotation/load balancing
    return configs[Math.floor(Math.random() * configs.length)];
  }

  throw new Error("Invalid identifier: must provide either id or name");
}

// Singleton proxy agent (reused across requests to avoid overhead)
let proxyAgent: ProxyAgent | null = null;

/**
 * Creates a fetch function with optional proxy support.
 * Uses singleton ProxyAgent to avoid creating new connections.
 * Falls back to native fetch if no proxy is configured.
 */
function createProxyFetch() {
  const proxyUrl = process.env.PROXY_URL;

  // Use native fetch if proxy not configured
  if (!proxyUrl) {
    return fetch;
  }

  // Initialize proxy agent once (singleton pattern for performance)
  if (!proxyAgent) {
    proxyAgent = new ProxyAgent(proxyUrl);
  }

  // Return proxy-enabled fetch function
  return async (url: string, options?: RequestInit): Promise<Response> => {
    const undiciOptions: any = {
      method: options?.method,
      headers: options?.headers,
      body: options?.body,
      dispatcher: proxyAgent,
    };

    const response = await undiciFetch(url, undiciOptions);
    return response as unknown as Response;
  };
}

/**
 * Analyze Meta response, minimal diagnostics,
 * and automatically toggle inactive if matches configured errors.
 */
async function analyzeResponse(
  parsedResponses: any[],
  requestId: string,
  isActive: boolean,
) {
  if (!parsedResponses.length) {
    return { message: "Empty response from server" };
  }

  const first = parsedResponses[0];

  // minimal & flat diagnostic object
  const diagnostics =
    first.error || first.errorSummary || first.errorDescription
      ? {
          error: first.error,
          errorSummary: first.errorSummary,
          errorDescription: first.errorDescription,
        }
      : { message: "Request succeeded" };

  // auto-toggle only if request is currently active
  if (isActive) {
    const shouldToggle = AUTO_TOGGLE_ERRORS.some((err) => {
      if (err.error && err.error === first.error) return true;
      if (err.errorSummary && first.errorSummary?.includes(err.errorSummary))
        return true;
      return false;
    });

    if (shouldToggle && requestId) {
      try {
        await toggleMetaRequest(requestId);
        console.log(`⚠️ Auto-toggled request ${requestId} to inactive`);
      } catch (err) {
        console.error("❌ Failed to auto-toggle request:", err);
      }
    }
  }

  return diagnostics;
}
