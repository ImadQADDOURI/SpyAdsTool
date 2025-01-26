// @/actions/Meta-GraphQL-Api.ts
"use server";

import { cache } from "react";
import {
  apiNameToDocId,
  DEFAULT_GRAPHQL_CONFIG,
} from "@/utils/MetaGraphQLConstsAndFunctions";

import { prisma } from "@/lib/db";

// 🌐 GRAPHQL CONFIG TYPE ======================================================
type GraphQLConfig = {
  url: string; // 🔗 API endpoint URL
  headers: Record<string, string>; // 🔑 Authentication headers
  method: "POST" | "GET"; // ⚡ Only allow valid HTTP methods
  body: string; // 📦 Raw body string for exact replication
};

// 🎯 API PARAMETER INTERFACE ==================================================
interface MetaGraphQLApiProps {
  configId?: string; // 🔍 Optional specific configuration ID
  variables?: Record<string, unknown>; // 🌀 Custom variables to merge
  fb_api_req_friendly_name?: keyof typeof apiNameToDocId; // 📛 Meta API query name
}

// 🚀 MAIN API EXECUTOR ========================================================
export async function metaGraphQLApi(params: MetaGraphQLApiProps) {
  try {
    // ⚡ Fetch raw response using configured parameters
    const rawResponse = await fetchGraphQL(params);

    // 🧩 Parse potential multiple JSON objects from response
    const parsedData = parseJsonObjects(rawResponse);

    // 🚨 Validate we received usable data
    if (!parsedData.length) {
      throw new Error("❌ Empty response - No valid JSON objects found");
    }

    // 📦 Return single object or array based on response count
    return parsedData.length === 1 ? parsedData[0] : parsedData;
  } catch (error) {
    console.error(
      "💥 API Execution Failed:",
      error instanceof Error ? error.message : "Unknown error",
    );
    throw error; // 🚨 Propagate error for upstream handling
  }
}

// 🔄 CORE FETCH IMPLEMENTATION ================================================
export async function fetchGraphQL(params: MetaGraphQLApiProps) {
  try {
    // 🔍 Retrieve and validate configuration
    const config = await getGraphQLConfig(params.configId);

    // 🛠️ Prepare request components
    const { url, method } = config;
    const headers = new Headers(config.headers);
    const bodyParams = new URLSearchParams(config.body);

    // 🌀 Merge custom variables if provided
    if (params.variables) {
      bodyParams.set("variables", JSON.stringify(params.variables));
    }

    // 📛 Handle Meta API special parameters
    if (params.fb_api_req_friendly_name) {
      const apiName = params.fb_api_req_friendly_name;

      // 🏷️ Set friendly name in headers and body
      headers.set("x-fb-friendly-name", apiName);
      bodyParams.set("fb_api_req_friendly_name", apiName);

      // 🔢 Add document ID from predefined mapping
      const docId = apiNameToDocId[apiName];
      if (docId) bodyParams.set("doc_id", docId.toString());
    }

    // 🌐 Execute network request
    const response = await fetch(url, {
      method,
      headers,
      body: bodyParams.toString(),
    });

    // 🚨 Handle non-2xx responses
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `📡 API Error ${response.status}: ${errorBody.slice(0, 200)}`,
      );
    }

    return await response.text();
  } catch (error) {
    console.error(
      "💥 Fetch Failed:",
      error instanceof Error ? error.message : "Unknown error",
    );
    throw error; // 🚨 Propagate for error boundaries
  }
}

// 🔒 CONFIGURATION RETRIEVAL ==================================================
const getGraphQLConfig = cache(
  async (configId?: string): Promise<GraphQLConfig> => {
    try {
      // 🔍 Database lookup logic
      const config = await (configId
        ? prisma.metaGraphQLConfig.findUnique({ where: { id: configId } })
        : prisma.metaGraphQLConfig.findFirst({
            where: { is_active: true },
            orderBy: { createdAt: "desc" },
          }));

      // 🚨 No config found handling
      if (!config) throw new Error("🔍 Configuration not found");

      // 🛡️ Type-safe validation of stored JSON
      const xhr = config.graphql_xhr as unknown;
      if (!xhr || typeof xhr !== "object" || Array.isArray(xhr)) {
        throw new Error("📦 Invalid XHR format - Expected object");
      }

      // 🧱 Destructure with type checking
      const { url, headers, method, body } = xhr as Record<string, unknown>;

      // ✅ Validate individual fields
      if (typeof url !== "string") throw new Error("❌ Invalid URL type");
      if (typeof headers !== "object")
        throw new Error("❌ Invalid headers type");
      if (typeof method !== "string") throw new Error("❌ Invalid method type");
      if (typeof body !== "string")
        throw new Error("❌ Body must be stored as string");

      // 🛠️ Normalize HTTP method
      const normalizedMethod = method.toUpperCase() === "GET" ? "GET" : "POST";

      return {
        url,
        headers: headers as Record<string, string>,
        method: normalizedMethod,
        body,
      };
    } catch (error) {
      console.error(
        "💾 Config Retrieval Error:",
        error instanceof Error ? error.message : "Unknown error",
      );
      throw error; // 🚨 Prevent invalid config usage
    }
  },
);
// 🧰 JSON PARSING UTILITIES ===================================================
function parseJsonObjects(rawText: string): any[] {
  // 🧼 STEP 1: CLEAN UNWANTED PREFIXES
  const cleanedText = rawText
    // 🔄 Remove all "for(;;);" variations (case-insensitive with optional spaces)
    .replace(/for\s*\(\s*;;\s*\)\s*;?/gim, "")
    // ✂️ Trim whitespace from both ends
    .trim();

  // 🎯 STEP 2: ATTEMPT SINGLE JSON PARSE FIRST
  try {
    return [JSON.parse(cleanedText)];
  } catch {
    // Continue to multi-json parsing if single parse fails
  }

  // 🔄 STEP 3: EFFICIENT MULTI-JSON HANDLING
  const jsonObjects: unknown[] = [];
  let currentObject = "";
  let bracketBalance = 0;
  let inString = false;
  let escaped = false;

  // 🚀 OPTIMIZED CHARACTER ITERATION (O(n) complexity)
  for (let i = 0; i < cleanedText.length; i++) {
    const char = cleanedText[i];

    // 🧭 STATE MANAGEMENT
    if (char === '"' && !escaped) inString = !inString;
    escaped = char === "\\" && !escaped;

    // 📦 BRACKET TRACKING (only when not in string)
    if (!inString) {
      if (char === "{") bracketBalance++;
      if (char === "}") bracketBalance--;
    }

    currentObject += char;

    // 🎉 COMPLETE OBJECT DETECTION
    if (bracketBalance === 0 && currentObject.trim() !== "") {
      try {
        jsonObjects.push(JSON.parse(currentObject));
        currentObject = "";
      } catch (error) {
        // 🚨 RECOVERY: Attempt to find valid JSON in current buffer
        const lastValidIndex = findLastValidObjectEnd(currentObject);
        if (lastValidIndex > -1) {
          try {
            jsonObjects.push(
              JSON.parse(currentObject.slice(0, lastValidIndex + 1)),
            );
            currentObject = currentObject.slice(lastValidIndex + 1);
          } catch {
            // Continue processing remaining text
          }
        }
      }
    }
  }

  // 🔍 FINAL ATTEMPT FOR REMAINING TEXT
  if (currentObject.trim()) {
    try {
      jsonObjects.push(JSON.parse(currentObject));
    } catch {
      // Ignore trailing invalid JSON
    }
  }

  return jsonObjects.length > 0 ? jsonObjects : [];
}

// 🔎 HELPER: FIND LAST VALID OBJECT END =======================================
function findLastValidObjectEnd(text: string): number {
  // 🚀 QUICK SCAN FROM END (O(n) worst case)
  let balance = 0;
  for (let i = text.length - 1; i >= 0; i--) {
    if (text[i] === "}") balance++;
    if (text[i] === "{") balance--;
    if (balance === 1) return i; // Found closing bracket with balance
  }
  return -1;
}
