// @/actions/stores.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { type Store } from "@prisma/client";

import { prisma } from "@/lib/db";

const rPath = "/stores-config";

// 🚀 Get all stores
export async function getStores(): Promise<Store[]> {
  try {
    return await prisma.store.findMany({
      orderBy: { revenue: "desc" },
    });
  } catch (error) {
    throw new Error("Failed to fetch stores");
  }
}

// ✨ Create a new store
export async function createStore(formData: FormData) {
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
    await prisma.store.create({ data });
  } catch (error) {
    throw new Error("Failed to create store");
  }

  revalidatePath(rPath);
  redirect(rPath);
}

// 🔄 Update a store
export async function updateStore(id: string, formData: FormData) {
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
    await prisma.store.update({
      where: { id },
      data,
    });
  } catch (error) {
    throw new Error(`Failed to update store ${id}`);
  }

  revalidatePath(rPath);
  redirect(rPath);
}

// 🗑️ Delete a store
export async function deleteStore(id: string) {
  try {
    await prisma.store.delete({ where: { id } });
  } catch (error) {
    throw new Error(`Failed to delete store ${id}`);
  }

  revalidatePath(rPath);
}

/**
 * 📦 Bulk imports stores from JSON data.
 * Strips IDs, validates required fields, and inserts as new rows.
 * @param data - Array of store objects.
 * @returns Summary of import results.
 */
export async function importStores(
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

    const result = await prisma.store.createMany({
      data: storesToCreate,
    });

    revalidatePath(rPath);
    return { count: result.count, errors: 0 };
  } catch (error) {
    console.error("❌ Error importing stores:", error);
    throw error;
  }
}
