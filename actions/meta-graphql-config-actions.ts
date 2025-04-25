// @/actions/meta-graphql-config-actions.ts
"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { prisma } from "@/lib/db";

import { metaGraphQLApi } from "./Meta-GraphQL-Api"; // Keep for test action
import { ACTIVE_CONFIGS_CACHE_TAG } from "./Meta-GraphQL-cache-config";

// --- create, update, delete actions remain the same ---

export async function createMetaGraphQLConfig(graphql_xhr: any) {
  try {
    const config = await prisma.metaGraphQLConfig.create({
      data: {
        graphql_xhr,
        is_active: true, // Default to active
      },
    });
    revalidatePath("/meta-graphql-configs");
    revalidateTag(ACTIVE_CONFIGS_CACHE_TAG); // ✨ Revalidate active list on create
    return { success: true, data: config };
  } catch (error) {
    console.error("💥 Failed to create config:", error);
    return { success: false, error: String(error) };
  }
}

export async function updateMetaGraphQLConfig(id: string, graphql_xhr: any) {
  try {
    const config = await prisma.metaGraphQLConfig.update({
      where: { id },
      data: { graphql_xhr },
    });
    revalidatePath("/meta-graphql-configs");
    // Note: Updating content doesn't change active status, so no tag revalidation needed here.
    return { success: true, data: config };
  } catch (error) {
    console.error(`💥 Failed to update config ${id}:`, error);
    return { success: false, error: String(error) };
  }
}

// --- toggleMetaGraphQLConfig (Updated) ---
export async function toggleMetaGraphQLConfig(id: string, is_active: boolean) {
  try {
    console.log(
      `🔄 Toggling config ${id} to ${is_active ? "ACTIVE" : "INACTIVE"}`,
    );
    const config = await prisma.metaGraphQLConfig.update({
      where: { id },
      data: { is_active },
    });
    revalidatePath("/meta-graphql-configs"); // Revalidate admin page UI
    revalidateTag(ACTIVE_CONFIGS_CACHE_TAG); // ✨ Revalidate the active config list cache!
    console.log(
      `✅ Config ${id} toggled. Cache tag "${ACTIVE_CONFIGS_CACHE_TAG}" revalidated.`,
    );
    return { success: true, data: config };
  } catch (error) {
    console.error(`💥 Failed to toggle config ${id}:`, error);
    return { success: false, error: String(error) };
  }
}

export async function deleteMetaGraphQLConfig(id: string) {
  try {
    await prisma.metaGraphQLConfig.delete({
      where: { id },
    });
    revalidatePath("/meta-graphql-configs");
    revalidateTag(ACTIVE_CONFIGS_CACHE_TAG); // ✨ Revalidate active list on delete
    return { success: true };
  } catch (error) {
    console.error(`💥 Failed to delete config ${id}:`, error);
    return { success: false, error: String(error) };
  }
}

// --- getMetaGraphQLConfigs remains the same ---
export async function getMetaGraphQLConfigs() {
  try {
    const configs = await prisma.metaGraphQLConfig.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: configs };
  } catch (error) {
    console.error("💥 Failed to get configs:", error);
    return { success: false, error: String(error) };
  }
}

// --- testMetaGraphQLConfig remains the same ---
// Note: This test will now use rotation if no configId is implicitly passed,
// or the specific config if its ID is used. Deactivation logic applies.
export async function testMetaGraphQLConfig(id: string) {
  try {
    // Use skipCache to ensure a fresh test against the config
    const rawResponse = await metaGraphQLApi({ configId: id, skipCache: true });
    return { success: true, data: rawResponse };
  } catch (error) {
    console.error(`💥 Test failed for config ${id}:`, error);
    // Return the error message for UI feedback
    return { success: false, error: String(error) };
  }
}
