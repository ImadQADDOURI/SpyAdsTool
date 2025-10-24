/**
 * Extracts specific fields from an array of responses.
 * Keeps nested structure for each response.
 */
import { JSONPath } from "jsonpath-plus";

import { prisma } from "@/lib/db";

/**
 * Override `variables` inside a URL-encoded GraphQL body.
 */
function overrideVariables(body: string, newVars: Record<string, any>) {
  try {
    const params = new URLSearchParams(body);
    const vars = params.get("variables");
    if (!vars) return body;

    const decoded = JSON.parse(decodeURIComponent(vars));
    const merged = { ...decoded, ...newVars };
    params.set("variables", encodeURIComponent(JSON.stringify(merged)));
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

    // 6️⃣ Return structured result
    return {
      success: true,
      id: config.id,
      name: config.name,
      extracted: extractedResults,
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
export function parseResponse(raw: string): any[] {
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
export function extractFields(
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

// Utility: Pick a random element from an array
function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Loads a Meta GraphQL config by ID or randomly by name.
 * @param identifier Either the request ID or name (for rotation)
 */
export async function loadMetaConfig(identifier: {
  id?: string;
  name?: string;
}) {
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
