// @/lib/config-rotation.ts
"use server";

import { unstable_cache as cache, revalidateTag } from "next/cache";
import { MetaGraphQLConfig } from "@prisma/client"; // 💡 Import Prisma type

import { prisma } from "@/lib/db";

import {
  ACTIVE_CONFIGS_CACHE_TAG,
  ACTIVE_CONFIGS_TTL_SECONDS,
} from "./Meta-GraphQL-cache-config";

// 🔄 ROTATION STATE ==========================================================
// ⚠️ IMPORTANT: Module-level state might have limitations in serverless environments
// with multiple concurrent instances. For absolute consistency, consider an
// external store (Redis, KV) if needed, but this is the minimal overhead approach.
let currentConfigIndex = 0;

// 💾 FETCH AND CACHE ACTIVE CONFIG IDs =======================================
/**
 * @description Fetches and caches the IDs of all active MetaGraphQLConfig entries.
 * Uses Next.js unstable_cache for efficient caching with a specific tag.
 * @returns {Promise<string[]>} A promise resolving to an array of active config IDs.
 */
export const getActiveConfigIds = cache(
  async (): Promise<string[]> => {
    // console.log("🔄 Fetching active GraphQL config IDs from DB..."); // 🪵 Log DB access
    try {
      const activeConfigs = await prisma.metaGraphQLConfig.findMany({
        where: { is_active: true },
        select: { id: true }, // 🚀 Only fetch the ID
        orderBy: { createdAt: "asc" }, // 🕰️ Consistent ordering for rotation
      });
      return activeConfigs.map((config) => config.id);
    } catch (error) {
      console.error("💥 Failed to fetch active config IDs:", error);
      return []; // Return empty array on error to prevent breaking rotation logic
    }
  },
  [ACTIVE_CONFIGS_CACHE_TAG], // 🔗 Associate with the specific cache tag
  {
    revalidate: ACTIVE_CONFIGS_TTL_SECONDS, // ⏱️ Set cache expiration time
    tags: [ACTIVE_CONFIGS_CACHE_TAG], // 🏷️ Assign the tag for targeted revalidation
  },
);

// ➡️ GET NEXT CONFIG ID FOR ROTATION =========================================
/**
 * @description Retrieves the next active config ID based on the rotation index.
 * Fetches the list of active IDs using the cached `getActiveConfigIds` function.
 * Handles wrapping around the list and the case where no active configs are found.
 * @returns {Promise<string | null>} A promise resolving to the next config ID or null if none are active.
 */
export async function getNextActiveConfigId(): Promise<string | null> {
  const activeIds = await getActiveConfigIds();

  if (!activeIds || activeIds.length === 0) {
    console.warn("⚠️ No active GraphQL configurations found for rotation.");
    return null; // 🤷 No active configs available
  }

  // 🔄 Calculate next index with wrap-around
  const indexToUse = currentConfigIndex % activeIds.length;
  const nextId = activeIds[indexToUse];

  // ⏭️ Increment index for the *next* call (atomic update not guaranteed across instances)
  currentConfigIndex = (currentConfigIndex + 1) % activeIds.length;

  console.log(`⚙️ Rotating to config ID: ${nextId} (Index: ${indexToUse})`); // 🪵 Log rotation
  return nextId;
}

// 🔄 MANUAL CACHE REFRESH ACTION ============================================
/**
 * @description Server action to manually invalidate the cache for active config IDs.
 * Typically triggered by an admin interface.
 */
export async function refreshActiveConfigsCache() {
  console.log(
    `🔄 Manually revalidating cache tag: ${ACTIVE_CONFIGS_CACHE_TAG}`,
  );
  revalidateTag(ACTIVE_CONFIGS_CACHE_TAG);
  // Optionally, revalidate the base path if needed
  // revalidatePath('/meta-graphql-configs'); // Already done in toggle action
}
