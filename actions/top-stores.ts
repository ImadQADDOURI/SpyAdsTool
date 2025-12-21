// @/actions/top-stores.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { type TopStore } from "@prisma/client";

import { prisma } from "@/lib/db";

const rPath = "/top-stores-config";

// 🚀 Get all top stores
export async function getTopStores(): Promise<TopStore[]> {
  try {
    return await prisma.topStore.findMany({
      orderBy: { revenue: "desc" },
    });
  } catch (error) {
    throw new Error("Failed to fetch top stores");
  }
}

// ✨ Create a new top store
export async function createTopStore(formData: FormData) {
  const data = {
    image: formData.get("image") as string,
    name: formData.get("name") as string,
    niche: formData.get("niche") as string,
    link: formData.get("link") as string,
    revenue: parseFloat(formData.get("revenue") as string),
    sales: parseInt(formData.get("sales") as string),
    CTA: formData.get("CTA") as string,
  };

  try {
    await prisma.topStore.create({ data });
  } catch (error) {
    throw new Error("Failed to create top store");
  }

  revalidatePath(rPath);
  redirect(rPath);
}

// 🔄 Update a top store
export async function updateTopStore(id: string, formData: FormData) {
  const data = {
    image: formData.get("image") as string,
    name: formData.get("name") as string,
    niche: formData.get("niche") as string,
    link: formData.get("link") as string,
    revenue: parseFloat(formData.get("revenue") as string),
    sales: parseInt(formData.get("sales") as string),
    CTA: formData.get("CTA") as string,
  };

  try {
    await prisma.topStore.update({
      where: { id },
      data,
    });
  } catch (error) {
    throw new Error(`Failed to update top store ${id}`);
  }

  revalidatePath(rPath);
  redirect(rPath);
}

// 🗑️ Delete a top store
export async function deleteTopStore(id: string) {
  try {
    await prisma.topStore.delete({ where: { id } });
  } catch (error) {
    throw new Error(`Failed to delete top store ${id}`);
  }

  revalidatePath(rPath);
}

/**
 * 📦 Bulk imports stores from JSON data.
 * Strips IDs, validates required fields, and inserts as new rows.
 * @param data - Array of store objects.
 * @returns Summary of import results.
 */
export async function importTopStores(
  data: any[],
): Promise<{ count: number; errors: number }> {
  console.log(`📦 Importing ${data.length} stores...`);
  try {
    if (!Array.isArray(data)) {
      throw new Error("Invalid JSON format: Expected an array of stores.");
    }

    // Validate and prepare data (Fail fast)
    const storesToCreate = data.map((item, index) => {
      // Strip ID and system fields (Safe by default)
      const { id, createdAt, updatedAt, ...rest } = item;

      // Basic validation
      if (
        !rest.name ||
        !rest.image ||
        !rest.link ||
        !rest.niche ||
        rest.revenue === undefined ||
        rest.sales === undefined
      ) {
        throw new Error(`Item at index ${index} is missing required fields.`);
      }

      return {
        ...rest,
        revenue: Number(rest.revenue),
        sales: Number(rest.sales),
      };
    });

    const result = await prisma.topStore.createMany({
      data: storesToCreate,
    });

    revalidatePath(rPath);
    return { count: result.count, errors: 0 };
  } catch (error) {
    console.error("❌ Error importing stores:", error);
    throw error;
  }
}
