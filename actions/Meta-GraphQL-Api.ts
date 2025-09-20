"use server";

import crypto from "crypto";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";
import { toggleMetaGraphQLConfig } from "@/actions/meta-graphql-config-actions";
import {
  getActiveConfigIds,
  getRandomActiveConfigId,
  refreshActiveConfigsCache,
} from "@/actions/Meta-GraphQL-config-rotation";
import { apiNameToDocId } from "@/actions/Meta-GraphQL-Queries";

import { prisma } from "@/lib/db";

import { ACTIVE_CONFIGS_CACHE_TAG } from "./Meta-GraphQL-cache-config";

// 🔧 CACHING CONFIGURATION ===================================================
const CACHE_CONFIG = {
  MAX_ITEMS: 150, // 🔢 Maximum number of cached items
  DEFAULT_REVALIDATE_SECONDS: 86400, // ⏱️ Default cache duration (24 hours)
  ENABLED: true, // 🔌 Master switch for caching
};

// 🌐 GRAPHQL CONFIG TYPE ======================================================
type GraphQLConfig = {
  url: string; // 🔗 API endpoint URL
  headers: Record<string, string>; // 🔑 Authentication headers
  method: "POST" | "GET"; // ⚡ Only allow valid HTTP methods
  body: string; // 📦 Raw body string for exact replication
};

// ✨ TYPE FOR CONFIG WITH ID =================================================
type GraphQLConfigWithId = {
  config: GraphQLConfig;
  id: string | null;
};

// 🎯 API PARAMETER INTERFACE ==================================================
interface MetaGraphQLApiProps {
  configId?: string; // 🔍 Optional specific configuration ID
  variables?: Record<string, unknown>; // 🌀 Custom variables to merge
  fb_api_req_friendly_name?: keyof typeof apiNameToDocId; // 📛 Meta API query name
  skipCache?: boolean; // 🚫 Option to bypass cache for fresh data
}

// 🔥 CUSTOM ERROR FOR DEACTIVATION SIGNALING ================================
class ConfigDeactivationError extends Error {
  configId: string;
  cause: Error; // The original error (fetch error, auth error)

  constructor(configId: string, cause: Error, message?: string) {
    super(
      message ||
        `Config ${configId} requires deactivation due to: ${cause.message}`,
    );
    this.name = "ConfigDeactivationError";
    this.configId = configId;
    this.cause = cause;
    // Ensure stack trace is captured correctly
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ConfigDeactivationError);
    }
  }
}

// 🔑 CACHE KEY GENERATOR ======================================================
function generateCacheKey(params: MetaGraphQLApiProps): string {
  // 🧮 Create a stable hash from all parameters
  const paramsString = JSON.stringify({
    configId: params.configId,
    variables: params.variables || {},
    apiName: params.fb_api_req_friendly_name || "none",
  });

  // 🔒 Generate a short, deterministic hash (MD5 is fast and sufficient for caching)
  return crypto.createHash("md5").update(paramsString).digest("hex");
}

// 🚀 MAIN API EXECUTOR WITH CACHING (Updated Catch Logic) =====================
export async function metaGraphQLApi(params: MetaGraphQLApiProps) {
  // 🏷️ Generate cache key (consistent regardless of execution path)
  const cacheKey = generateCacheKey(params);
  const cacheTag = `meta-gql-${cacheKey}`;

  try {
    if (params.skipCache || !CACHE_CONFIG.ENABLED) {
      // 🚫 Execute directly if cache is skipped or disabled
      // Still need the outer try/catch to handle potential deactivations
      return await executeGraphQLRequest(params);
    }

    // 🧠 Use Next.js unstable_cache
    const cachedFetch = nextCache(
      async () => {
        // console.log(
        //   `🚀 Executing GraphQL request via cache (Key: ${cacheKey})`,
        // );
        // This function might throw ConfigDeactivationError or other errors
        return await executeGraphQLRequest(params);
      },
      [cacheTag], // Unique key array based on the tag
      {
        revalidate: CACHE_CONFIG.DEFAULT_REVALIDATE_SECONDS,
        tags: [cacheTag, "meta-gql"], // Add specific and general tags
      },
    );

    // ⚡️ Execute the cached function
    return await cachedFetch();
  } catch (error) {
    //  CATCH ERRORS *OUTSIDE* THE CACHED FUNCTION
    console.error(
      "💥 API Execution Failed (Outer Catch):",
      error instanceof Error ? error.message : "Unknown error",
    );

    // 🧐 Check if it's our custom error signaling deactivation
    if (error instanceof ConfigDeactivationError) {
      console.warn(
        `🚦 Deactivation signal received for config ID: ${error.configId}. Cause: ${error.cause.message}`,
      );
      try {
        // ✅ Perform deactivation and revalidation *outside* the cache boundary
        await toggleMetaGraphQLConfig(error.configId, false);
        console.log(
          `✅ Successfully deactivated config ${error.configId} and revalidated cache.`,
        );
      } catch (toggleError) {
        console.error(
          `🚨 CRITICAL: Failed to deactivate config ${error.configId} after signal:`,
          toggleError,
        );
        // Log this failure, but proceed to re-throw the original cause
      }
      // 🚨 Re-throw the *original* error that caused the deactivation signal
      // This ensures the client knows the underlying reason for the failure
      throw error.cause;
    } else {
      // 🚨 It was some other error, just re-throw it
      throw error;
    }
  }
}

// 🔄 CORE EXECUTION FUNCTION (NON-CACHED) (Updated Error Handling) ===========
async function executeGraphQLRequest(
  params: MetaGraphQLApiProps,
): Promise<any> {
  // ⚡ Fetch raw response using configured parameters
  // Renamed return type for clarity, assuming it returns parsed JSON data
  let configResult: GraphQLConfigWithId | null = null;
  let rawResponse: string = "";

  try {
    // ⚙️ Get config (handles rotation internally if no configId)
    configResult = await getGraphQLConfig(params.configId);

    // ⚡ Fetch raw response using the obtained config
    rawResponse = await fetchGraphQL(params, configResult);

    console.log(
      `✅✅✅✅ Fetch successful ✅✅✅✅\n` + rawResponse.slice(0, 3000),
    );

    // 🚫 Check for Meta login error *before* parsing JSON
    const metaLoginErrorPattern =
      'for (;;);{"__ar":1,"error":1357001,"errorSummary":"Log in to continue"';

    // 🚫 More global pattern for Meta rate limit errors
    const metaRateLimitErrorPattern =
      '{"errors":[{"message":"Rate limit exceeded"';

    if (rawResponse.startsWith(metaLoginErrorPattern)) {
      const configIdToDeactivate = configResult.id;
      if (configIdToDeactivate) {
        console.warn(
          `🚨 Meta login error detected for config ID: ${configIdToDeactivate}. Signaling deactivation.`,
        );
        throw new ConfigDeactivationError(
          configIdToDeactivate,
          new Error("Authentication required - Config needs deactivation"),
        );
      } else {
        console.error("🚨 Meta login error detected but no config ID found!");
        throw new Error("Authentication required, but config ID unknown.");
      }
    }

    // 🚫 Check for any rate limit exceeded errors (global detection)
    if (rawResponse.startsWith(metaRateLimitErrorPattern)) {
      console.warn(
        `🚨 Meta rate limit error detected for config ID: ${configResult?.id}`,
      );
      throw new Error("Rate limit exceeded - try again later.");
    }

    // --- Existing JSON parsing logic ---
    const parsedData = parseJsonObjects(rawResponse);
    if (!parsedData.length) {
      const configInfo = configResult?.id
        ? ` (using config ${configResult.id})`
        : "";
      // Throw a regular error if parsing fails but it wasn't an auth issue
      throw new Error(
        `❌ Empty response - No valid JSON objects found${configInfo}`,
      );
    }

    // if ad or page search, log the total count
    console.log(
      `\n📦 Total ADs Count: ${
        parsedData.length > 1
          ? parsedData[1].data?.ad_library_main?.search_results_connection
              ?.count
          : parsedData[0].data?.ad_library_main?.search_results_connection
              ?.count
      }\n`,
    );

    return parsedData.length === 1 ? parsedData[0] : parsedData;
    // --- End of existing JSON parsing logic ---
  } catch (error) {
    // 💥 Handle fetch errors or the ConfigDeactivationError thrown above

    // If it's already our custom error from the Meta login check, just re-throw it
    if (error instanceof ConfigDeactivationError) {
      throw error;
    }

    // For all other errors, log but don't create a ConfigDeactivationError
    console.error(
      "💥 executeGraphQLRequest Failed:",
      error instanceof Error ? error.message : "Unknown error",
      configResult?.id ? `(Config ID: ${configResult.id})` : "",
    );

    // Simply re-throw the original error without deactivating the config
    throw error;
  }
}
// 🧹 CACHE INVALIDATION FUNCTION ==============================================
export async function invalidateGraphQLCache(params?: MetaGraphQLApiProps) {
  if (params) {
    const cacheKey = generateCacheKey(params);
    const cacheTag = `meta-gql-${cacheKey}`;
    // console.log(`🧹 Invalidating specific cache tag: ${cacheTag}`);
    revalidateTag(cacheTag);
  } else {
    // console.log("🧹 Invalidating all meta-gql cache tags");
    revalidateTag("meta-gql"); // Invalidate the general tag
  }
}

// 🔄 CORE FETCH IMPLEMENTATION ================================================
export async function fetchGraphQL(
  params: MetaGraphQLApiProps,
  configResult: GraphQLConfigWithId, // Expects config + ID
): Promise<string> {
  const { config, id: configIdUsed } = configResult;

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

  // console.log(
  //   `📡 Making fetch call to ${url} using config ID: ${configIdUsed ?? "Default/None"}`,
  // );
  // 🔍 Log Fetch VariablesactiveStatus: 'ACTIVE',
  {
    /*
  activeStatus: 'ACTIVE',
  adType: 'CREDIT_ADS',
  bylines: [],
  collationToken: null,
  contentLanguages: [],
  countries: [ 'BR', 'IN' ],
  cursor: null,
  excludedIDs: [],
  first: 30,
  location: null,
  mediaType: 'IMAGE',
  pageIDs: [],
  potentialReachInput: [],
  publisherPlatforms: [],
  queryString: 'garden',
  regions: [],
  searchType: 'KEYWORD_UNORDERED',
  sessionID: '36350c01-dbe2-4778-b84f-b1d1ec03ae57',
  sortData: null,
  source: 'NAV_HEADER',
  startDate: null,
  v: '7218b1',
  viewAllPageID: '0'
*/
  }
  const variableKeys = [
    "adArchiveID",
    "adType",
    "queryString",
    "searchType",
    "activeStatus",
    "mediaType",
    "publisherPlatforms",
    "contentLanguages",
    "countries",
    "startDate",
    "viewAllPageID",
    "collationGroupID",
    "pageID",
    "isAdNotAAAEligible",
    "cursor",
  ] as const;

  console.log(
    "🔍 GraphQL - " +
      params.fb_api_req_friendly_name +
      "\n" +
      variableKeys
        .map((key) => {
          const value = params.variables?.[key];
          const display =
            typeof value === "object" ? JSON.stringify(value) : value || "";
          return `  ${key}: \x1b[33m${display}\x1b[0m`;
        })
        .join("\n"),
  );

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
}

// 🔒 CONFIGURATION RETRIEVAL ==================================================
// Cache for fetching specific config details by ID
const fetchConfigById = nextCache(
  async (configId: string): Promise<GraphQLConfigWithId | null> => {
    // console.log(`💾 Fetching config details for ID: ${configId} from DB`);
    try {
      const config = await prisma.metaGraphQLConfig.findUnique({
        where: { id: configId },
      });

      if (!config) {
        console.warn(`Config ID ${configId} not found in DB.`);
        return null;
      }
      if (!config.is_active) {
        console.warn(`Config ID ${configId} is inactive.`);
        revalidateTag(ACTIVE_CONFIGS_CACHE_TAG); // Invalidate if we somehow try to fetch an inactive one
        return null;
      }

      const xhr = config.graphql_xhr as unknown;
      if (!xhr || typeof xhr !== "object" || Array.isArray(xhr)) {
        throw new Error(`📦 Invalid XHR format for config ${configId}`);
      }
      const { url, headers, method, body } = xhr as Record<string, unknown>;
      if (typeof url !== "string") throw new Error("❌ Invalid URL type");
      if (typeof headers !== "object")
        throw new Error("❌ Invalid headers type");
      if (typeof method !== "string") throw new Error("❌ Invalid method type");
      if (typeof body !== "string") throw new Error("❌ Body must be string");

      const normalizedMethod = method.toUpperCase() === "GET" ? "GET" : "POST";

      return {
        id: config.id,
        config: {
          url,
          headers: headers as Record<string, string>,
          method: normalizedMethod,
          body,
        },
      };
    } catch (error) {
      console.error(
        `💥 Failed to fetch/validate config ID ${configId}:`,
        error,
      );
      // Allow specific config fetch errors to propagate
      throw error;
    }
  },
  ["fetchConfigById"], // Base key for the cache
  {
    revalidate: CACHE_CONFIG.DEFAULT_REVALIDATE_SECONDS,
    tags: ["config-cache", ACTIVE_CONFIGS_CACHE_TAG], // Add appropriate tags
  },
);

export const getGraphQLConfig = async (
  configId?: string,
): Promise<GraphQLConfigWithId> => {
  if (configId) {
    console.log(`⚙️ Using specific config ID: ${configId}`);
    const specificConfig = await fetchConfigById(configId);
    if (!specificConfig) {
      throw new Error(
        `🔍 Specific configuration ID "${configId}" not found or inactive.`,
      );
    }
    return specificConfig;
  } else {
    // console.log("⚙️ No specific config ID provided, using rotation...");
    const nextId = await getRandomActiveConfigId();

    if (!nextId) {
      console.error(
        "🚨 CRITICAL: No active GraphQL configurations available for rotation.",
      );
      throw new Error("🚫 No active GraphQL configurations available.");
    }

    const rotatedConfig = await fetchConfigById(nextId);
    if (!rotatedConfig) {
      console.warn(
        `⚠️ Config ID ${nextId} from rotation was not found/inactive when fetching details. Refreshing active list.`,
      );
      revalidateTag(ACTIVE_CONFIGS_CACHE_TAG);
      throw new Error(
        `🚫 Configuration ${nextId} became unavailable during rotation. Please retry.`,
      );
    }
    return rotatedConfig;
  }
};

// 📊 CACHE MONITORING UTILITY (DEV ONLY) ======================================
export async function getCacheStats() {
  if (process.env.NODE_ENV !== "development") {
    return {
      enabled: false,
      message: "🔒 Cache stats only available in development",
    };
  }
  const activeIds = await getActiveConfigIds();
  return {
    enabled: CACHE_CONFIG.ENABLED,
    maxItems: CACHE_CONFIG.MAX_ITEMS,
    responseTtl: CACHE_CONFIG.DEFAULT_REVALIDATE_SECONDS,
    activeConfigCacheTag: ACTIVE_CONFIGS_CACHE_TAG,
    activeConfigCount: activeIds.length,
    message: "✅ Cache system active. Stats reflect current state.",
  };
}

// 🧰 JSON PARSING UTILITIES ===================================================
/**
 * 🚀 Hyper-optimized JSON objects parser
 * For well-formed JSONs with minimal overhead
 */
function parseJsonObjects(rawText: string): any[] {
  // 🎯 Quick path: try parsing as single JSON (most common case)
  try {
    return [JSON.parse(rawText)];
  } catch {
    // Continue with multi-JSON parsing
  }

  const results: any[] = [];
  const len = rawText.length;
  let pos = 0;

  // Skip initial whitespace
  while (
    pos < len &&
    (rawText[pos] === " " ||
      rawText[pos] === "\n" ||
      rawText[pos] === "\t" ||
      rawText[pos] === "\r")
  )
    pos++;

  // 🔍 Process each JSON object
  while (pos < len) {
    // Ensure we're starting with an object
    if (rawText[pos] !== "{") {
      pos++;
      // Skip to next potential JSON start
      while (pos < len && rawText[pos] !== "{") pos++;
      continue;
    }

    // Find matching closing brace
    const startPos = pos;
    let braceCount = 1;
    let inString = false;

    pos++;

    // Fast scan for object boundaries
    while (pos < len && braceCount > 0) {
      const char = rawText[pos];

      if (char === '"') {
        // Check if quote is escaped
        let escaped = false;
        let checkPos = pos - 1;
        while (checkPos >= 0 && rawText[checkPos] === "\\") {
          escaped = !escaped;
          checkPos--;
        }
        if (!escaped) inString = !inString;
      }

      // Only count braces outside of strings
      if (!inString) {
        if (char === "{") braceCount++;
        else if (char === "}") braceCount--;
      }

      pos++;
    }

    // Extract and parse the object if we found a complete one
    if (braceCount === 0) {
      try {
        // Slight optimization: use slice instead of substring for newer JS engines
        results.push(JSON.parse(rawText.slice(startPos, pos)));
      } catch {
        // Skip invalid JSON
      }
    }

    // Skip whitespace between objects
    while (
      pos < len &&
      (rawText[pos] === " " ||
        rawText[pos] === "\n" ||
        rawText[pos] === "\t" ||
        rawText[pos] === "\r")
    )
      pos++;
  }

  return results;
}
