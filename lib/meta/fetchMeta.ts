/**
 * fetchMeta.ts
 *
 * Executes Meta GraphQL requests inside a real Chromium browser.
 * All parsing, extraction, and auto-toggle logic preserved from original.
 *
 * Production enhancements:
 * • Uses enhanced browser pool with concurrency limiting
 * • Hard timeout enforcement (15s)
 * • Automatic browser restart (3h or 300 requests)
 * • Proper error handling and cleanup
 */

"use server";

import { toggleMetaRequest } from "@/actions/metaRequests";
import { JSONPath } from "jsonpath-plus";

import { prisma } from "@/lib/db";

import { acquireContext, releaseContext } from "./browserPool";
import { buildHeaders } from "./buildHeaders";
import { executeMeta } from "./executeMeta";

const AUTO_TOGGLE_ERRORS: Array<{ error?: number; errorSummary?: string }> = [
  { error: 1357001, errorSummary: "Log in to continue" },
  { error: 1357004, errorSummary: "Sorry, something went wrong" },
];

// ─── Main Entry Point ────────────────────────────────────────────────────────

export async function fetchMeta(
  identifier: { id?: string; name?: string },
  options?: {
    variables?: Record<string, any>;
    includeRaw?: boolean;
  },
) {
  let context: any = null;

  try {
    // Load configuration
    const config = await loadMetaConfig(identifier);
    const { base_request, fields_to_extract } = config as any;

    if (!base_request?.url) {
      throw new Error("Invalid base_request: missing url");
    }

    const { url, requestHeaders, requestBody } = base_request;

    // Acquire browser context (enforces concurrency limit)
    const acquired = await acquireContext();
    context = acquired.context;
    const page = acquired.page;

    // Prepare request body with variable overrides
    const finalBody = options?.variables
      ? overrideVariables(requestBody, options.variables)
      : requestBody;

    // Build minimal header set
    const headers = buildHeaders(requestHeaders);

    // Execute fetch inside browser with hard timeout
    const text = await executeMeta(page, { url, headers, body: finalBody });

    // Parse and extract fields
    const parsedResponses = parseMultiJsonResponse(text);
    const extracted = extractFields(parsedResponses, fields_to_extract);

    // Analyze response and auto-toggle if needed
    const diagnostics = await analyzeResponse(
      parsedResponses,
      config.id,
      config.is_active,
    );
    console.log("✅ Variables:", options?.variables);

    console.log("🩺 Diagnostic:", diagnostics, "\n", {
      id: config.id,
      name: config.name,
    });

    return {
      success: true,
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
        message: error.message || String(error) || "Unknown error",
        error: error.name,
      },
    };
  } finally {
    // CRITICAL: Always release context in finally block
    if (context) {
      await releaseContext(context);
    }
  }
}

// ─── Helpers (preserved from original) ──────────────────────────────────────

function overrideVariables(body: string, newVars: Record<string, any>): string {
  try {
    const params = new URLSearchParams(body);
    const existingVarsRaw = params.get("variables");

    if (!existingVarsRaw) {
      params.set("variables", JSON.stringify(newVars));
      return params.toString();
    }

    let existingVars: Record<string, any> = {};
    try {
      existingVars = JSON.parse(
        existingVarsRaw.startsWith("%7B")
          ? decodeURIComponent(existingVarsRaw)
          : existingVarsRaw,
      );
    } catch {
      existingVars = {};
    }

    const merged = { ...existingVars, ...newVars };
    // console.log("🧩 Final Variables:", merged);

    params.set("variables", JSON.stringify(merged));
    return params.toString();
  } catch (err) {
    console.error("❌ Failed to override variables:", err);
    return body;
  }
}

function parseMultiJsonResponse(raw: string): any[] {
  const results: any[] = [];
  let depth = 0;
  let start = -1;
  let inString = false;
  let escapeNext = false;

  for (let i = 0; i < raw.length; i++) {
    const char = raw[i];

    if (escapeNext) {
      escapeNext = false;
      continue;
    }
    if (char === "\\") {
      escapeNext = true;
      continue;
    }
    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (!inString) {
      if (char === "{") {
        if (depth === 0) start = i;
        depth++;
      } else if (char === "}") {
        depth--;
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

function extractFields(
  responses: any[],
  fieldPaths: Record<string, string>,
): Record<string, any> {
  const fieldSets: Record<string, Set<string>> = {};

  for (const fieldName of Object.keys(fieldPaths)) {
    fieldSets[fieldName] = new Set();
  }

  for (const json of responses) {
    for (const [fieldName, jsonPath] of Object.entries(fieldPaths)) {
      try {
        const result = JSONPath({ path: jsonPath, json, wrap: false });

        if (result === undefined || result === null) continue;

        const values = Array.isArray(result) ? result : [result];

        for (const value of values) {
          if (value === undefined || value === null || value === "") continue;
          if (Array.isArray(value) && value.length === 0) continue;

          const serialized =
            typeof value === "object" ? JSON.stringify(value) : String(value);
          fieldSets[fieldName].add(serialized);
        }
      } catch (err) {
        fieldSets[fieldName].add(
          JSON.stringify({ error: (err as Error).message }),
        );
      }
    }
  }

  const result: Record<string, any> = {};

  for (const [fieldName, valueSet] of Object.entries(fieldSets)) {
    if (valueSet.size === 0) continue;

    const deserializedValues = Array.from(valueSet).map((serialized) => {
      try {
        return JSON.parse(serialized);
      } catch {
        return serialized;
      }
    });

    result[fieldName] =
      deserializedValues.length === 1
        ? deserializedValues[0]
        : deserializedValues;
  }

  return result;
}

async function loadMetaConfig(identifier: { id?: string; name?: string }) {
  if (identifier.id) {
    const config = await prisma.metaGraphQLRequest.findUnique({
      where: { id: identifier.id },
    });
    if (!config) {
      throw new Error(`No MetaGraphQLRequest found for id=${identifier.id}`);
    }
    return config;
  }

  if (identifier.name) {
    const configs = await prisma.metaGraphQLRequest.findMany({
      where: { name: identifier.name, is_active: true },
    });
    if (!configs.length) {
      throw new Error(
        `No active MetaGraphQLRequest found for name=${identifier.name}`,
      );
    }
    return configs[Math.floor(Math.random() * configs.length)];
  }

  throw new Error("Invalid identifier: must provide either id or name");
}

async function analyzeResponse(
  parsedResponses: any[],
  requestId: string,
  isActive: boolean,
) {
  if (!parsedResponses.length) {
    return { message: "Empty response from server" };
  }

  const first = parsedResponses[0];

  const diagnostics =
    first.error || first.errorSummary || first.errorDescription
      ? {
          error: first.error,
          errorSummary: first.errorSummary,
          errorDescription: first.errorDescription,
        }
      : { message: "Request succeeded" };

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
        console.error("❌ Failed to auto-toggle:", err);
      }
    }
  }

  return diagnostics;
}
