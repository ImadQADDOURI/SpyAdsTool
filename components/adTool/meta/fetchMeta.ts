"use server";

/**
 * Extracts specific fields from an array of responses.
 * Keeps nested structure for each response.
 */
import { JSONPath } from "jsonpath-plus";

import { prisma } from "@/lib/db";

/**
 * Override or merge `variables` inside a URL-encoded GraphQL body.
 * - Only allows overriding existing keys (logs if key doesn’t exist).
 * Ensures correct encoding and logs the final variables.
 */
function overrideVariables(body: string, newVars: Record<string, any>) {
  try {
    const params = new URLSearchParams(body);
    const existingVarsRaw = params.get("variables");

    let existingVars: Record<string, any> = {};
    if (existingVarsRaw) {
      try {
        existingVars = JSON.parse(existingVarsRaw);
      } catch {
        // if it's encoded (like %7B...), decode first
        existingVars = JSON.parse(decodeURIComponent(existingVarsRaw));
      }
    }

    // Merge only provided vars
    const invalidKeys: string[] = [];
    const merged = { ...existingVars };
    for (const [key, value] of Object.entries(newVars)) {
      if (key in existingVars) merged[key] = value;
      else invalidKeys.push(key);
    }

    if (invalidKeys.length > 0) {
      console.warn(
        `⚠️ Tried to override non-existing variables: ${invalidKeys.join(", ")}`,
      );
    }

    console.log("🧩 Final Variables used in fetch:", merged);

    // Set back the merged variables (no double encoding)
    params.set("variables", JSON.stringify(merged));

    return params.toString();
  } catch (err) {
    console.error("❌ Failed to override variables:", err);
    return body;
  }
}

/**
 * Executes a Meta GraphQL request using either ID or name.
 */
export async function fetchMeta(
  identifier: { id?: string; name?: string },
  options?: {
    variables?: Record<string, any>;
    includeRaw?: boolean;
  },
) {
  try {
    // 1️⃣ Load config
    const config = await loadMetaConfig(identifier);
    const { base_request, fields_to_extract } = config as any;

    if (!base_request?.url) throw new Error("Invalid base_request");

    // 2️⃣ Prepare request
    const { url, method, headers, body } = base_request;
    const finalBody = options?.variables
      ? overrideVariables(body, options.variables)
      : body;

    // 3️⃣ Fetch from Meta
    const response = await fetch(url, {
      method: method || "POST",
      headers,
      body: finalBody,
    });

    const text = await response.text();
    if (!response.ok)
      throw new Error(`Meta request failed: ${response.status}`);

    // 4️⃣ Parse Meta’s multi-JSON response
    const parsedResponses = parseResponse(text);

    // 5️⃣ Extract requested fields
    const extractedResults = parsedResponses.map((json) =>
      extractFields(json, fields_to_extract),
    );

    // 6️⃣ Merges multiple extracted field results into one clean object
    const merged = mergeExtractedResults(extractedResults);

    return {
      success: true,
      id: config.id,
      name: config.name,
      extracted: merged,
      raw: options?.includeRaw ? parsedResponses : undefined,
    };
  } catch (error: any) {
    console.error("❌ fetchMeta error:", error);
    return {
      success: false,
      error: error.message || "Unknown error",
    };
  }
}

/**
 * Meta sometimes returns multiple JSON objects concatenated together like:
 * {"data": {...}}{"data": {...}}
 *
 * This function splits them efficiently and parses them safely.
 */
function parseResponse(raw: string): any[] {
  const results: any[] = [];
  const regex = /{[\s\S]*?}(?=\s*{|$)/g; // Match each complete {...} block

  const matches = raw.match(regex);
  if (!matches) return [];

  for (const match of matches) {
    try {
      results.push(JSON.parse(match));
    } catch {
      // Skip invalid fragments
      continue;
    }
  }

  return results;
}

/**
 * Extracts fields from a JSON object using JSONPath expressions.
 * @param json The JSON response to extract data from
 * @param fields Map of fieldName -> JSONPath
 * @returns Extracted fields in same structure as input keys
 */
function extractFields(
  json: any,
  fields: Record<string, string>,
): Record<string, any> {
  const extracted: Record<string, any> = {};

  for (const [key, path] of Object.entries(fields)) {
    try {
      // JSONPath returns an array of matches
      const result = JSONPath({ path, json });
      // If single value, return first match, else full array
      extracted[key] = result.length === 1 ? result[0] : result;
    } catch (err) {
      extracted[key] = { error: (err as Error).message };
    }
  }
  return extracted;
}

/**
 * Efficiently merges multiple extracted results into one clean object.
 * - Keeps only non-empty, non-null values.
 * - Combines unique values for repeated fields.
 * - Simplifies arrays with one unique value to a single item.
 */
function mergeExtractedResults(
  results: Record<string, any>[],
): Record<string, any> {
  if (!results || results.length === 0) return {};

  const merged: Record<string, Set<any>> = {};

  for (const result of results) {
    for (const [key, value] of Object.entries(result)) {
      if (!merged[key]) merged[key] = new Set();

      const values = Array.isArray(value) ? value : [value];
      for (const v of values) {
        if (
          v !== undefined &&
          v !== null &&
          v !== "" &&
          !(Array.isArray(v) && v.length === 0)
        ) {
          merged[key].add(JSON.stringify(v)); // use JSON for deep equality
        }
      }
    }
  }

  const final: Record<string, any> = {};
  for (const [key, set] of Object.entries(merged)) {
    const parsed = Array.from(set).map((v) => JSON.parse(v));
    final[key] = parsed.length === 1 ? parsed[0] : parsed;
  }

  return final;
}

// Utility: Pick a random element from an array
function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Loads a Meta GraphQL config by ID or randomly by name.
 * @param identifier Either the request ID or name (for rotation)
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
    return getRandomItem(configs);
  }

  throw new Error("Invalid identifier: must provide either id or name");
}
