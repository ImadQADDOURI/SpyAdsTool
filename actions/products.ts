// actions/products.ts
"use server";

// 🚀 Mark this file as containing server actions
import { revalidatePath } from "next/cache"; // To revalidate cache after mutations
import { type Product } from "@prisma/client"; // Import the generated Product type

import { prisma } from "@/lib/db"; // Assuming your Prisma client is exported from here

// --- Type Definitions ---

// ✨ Define the input type for creating a product (excluding generated fields like id, createdAt, updatedAt)
// Making most fields optional for flexibility during creation, adjust as needed for required fields.
export type CreateProductInput = Omit<
  Product,
  "id" | "createdAt" | "updatedAt"
> & {
  // Ensure required fields are not optional if needed
  image: string;
  title: string;
  link: string;
  // Make optional fields truly optional
  niche?: string | null;
  uploadDate?: Date | null;
  stars?: number | null;
  buyPrice?: number | null;
  sellPrice?: number | null;
  totalSales?: number | null;
  countries?: string[];
};

// ✨ Define the input type for updating a product (id is required, others are optional)
export type UpdateProductInput = Partial<CreateProductInput> & {
  id: string; // ID is required to know which product to update
};

// --- CRUD Operations ---

/**
 * 🛒 Creates a new product in the database.
 * @param data - The data for the new product.
 * @returns The newly created product.
 * @throws Throws an error if creation fails.
 */
export async function createProduct(
  data: CreateProductInput,
): Promise<Product> {
  console.log("🚀 Creating product:", data); // 🪵 Log input data
  try {
    // Basic validation example (can be expanded with Zod)
    if (!data.title || !data.image || !data.link) {
      throw new Error("Title, Image, and Link are required.");
    }

    const newProduct = await prisma.product.create({
      data: {
        ...data,
        // Ensure optional fields are handled correctly (null or value)
        niche: data.niche ?? null,
        uploadDate: data.uploadDate ?? null,
        stars: data.stars ?? null,
        buyPrice: data.buyPrice ?? null,
        sellPrice: data.sellPrice ?? null,
        totalSales: data.totalSales ?? null,
        countries: data.countries ?? [], // Default to empty array if not provided
      },
    });
    console.log("✅ Product created successfully:", newProduct.id);

    // 🔄 Revalidate the path where products are displayed (adjust '/products' as needed)
    revalidatePath("/products"); // Or the specific page path

    return newProduct;
  } catch (error) {
    console.error("❌ Error creating product:", error);
    // Refine error handling based on specific needs (e.g., return error messages)
    throw new Error("Failed to create product.");
  }
}

/**
 * 📄 Retrieves a single product by its unique ID.
 * @param id - The ID of the product to retrieve.
 * @returns The product if found, otherwise null.
 */
export async function getProductById(id: string): Promise<Product | null> {
  console.log("🔍 Fetching product by ID:", id);
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });
    if (product) {
      console.log("✅ Product found:", id);
    } else {
      console.log("❓ Product not found:", id);
    }
    return product;
  } catch (error) {
    console.error("❌ Error fetching product by ID:", id, error);
    // Depending on requirements, you might return null or throw
    return null;
  }
}

/**
 * 📚 Retrieves all products from the database.
 * Add pagination, filtering, sorting arguments as needed later.
 * @returns An array of all products.
 */
export async function getAllProducts(): Promise<Product[]> {
  console.log("📚 Fetching all products...");
  try {
    const products = await prisma.product.findMany({
      // Example: Order by creation date, newest first
      orderBy: {
        createdAt: "desc",
      },
      // Add pagination later: take: 10, skip: 0 etc.
    });
    console.log(`✅ Fetched ${products.length} products.`);
    return products;
  } catch (error) {
    console.error("❌ Error fetching all products:", error);
    return []; // Return empty array on error
  }
}

/**
 * ✏️ Updates an existing product by its ID.
 * @param data - The update data, including the product ID.
 * @returns The updated product.
 * @throws Throws an error if the product is not found or update fails.
 */
export async function updateProduct(
  data: UpdateProductInput,
): Promise<Product> {
  const { id, ...updateData } = data;
  console.log(`✏️ Updating product ID: ${id} with data:`, updateData);
  try {
    // Ensure the product exists before attempting to update
    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      console.warn("❓ Product not found for update:", id);
      throw new Error("Product not found.");
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...updateData,
        // Ensure optional fields that are explicitly set to undefined are handled
        // Prisma typically ignores undefined fields, but being explicit can be clearer
        niche: updateData.niche,
        uploadDate: updateData.uploadDate,
        stars: updateData.stars,
        buyPrice: updateData.buyPrice,
        sellPrice: updateData.sellPrice,
        totalSales: updateData.totalSales,
        countries: updateData.countries,
      },
    });
    console.log("✅ Product updated successfully:", id);

    // 🔄 Revalidate the path
    revalidatePath("/products"); // Or the specific page path
    revalidatePath(`/products/${id}`); // Revalidate specific product page if exists

    return updatedProduct;
  } catch (error) {
    console.error("❌ Error updating product:", id, error);
    // Rethrow or handle specific errors (like not found error)
    if (error instanceof Error && error.message === "Product not found.") {
      throw error;
    }
    throw new Error("Failed to update product.");
  }
}

/**
 * 🗑️ Deletes a product by its unique ID.
 * @param id - The ID of the product to delete.
 * @returns The deleted product data.
 * @throws Throws an error if the product is not found or deletion fails.
 */
export async function deleteProduct(id: string): Promise<Product> {
  console.log("🗑️ Deleting product ID:", id);
  try {
    // Ensure the product exists before attempting to delete (optional but good practice)
    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      console.warn("❓ Product not found for deletion:", id);
      throw new Error("Product not found.");
    }

    const deletedProduct = await prisma.product.delete({
      where: { id },
    });
    console.log("✅ Product deleted successfully:", id);

    // 🔄 Revalidate the path
    revalidatePath("/products"); // Or the specific page path

    return deletedProduct;
  } catch (error) {
    console.error("❌ Error deleting product:", id, error);
    if (error instanceof Error && error.message === "Product not found.") {
      throw error;
    }
    throw new Error("Failed to delete product.");
  }
}

/**
 * 📦 Bulk imports products from JSON data.
 * Strips IDs, validates required fields, and inserts as new rows.
 * @param data - Array of product objects.
 * @returns Summary of import results.
 */
export async function importProducts(
  data: any[],
): Promise<{ count: number; errors: number }> {
  console.log(`📦 Importing ${data.length} products...`);
  try {
    if (!Array.isArray(data)) {
      throw new Error("Invalid JSON format: Expected an array of products.");
    }

    // Validate and prepare data (Fail fast)
    const productsToCreate = data.map((item, index) => {
      // Strip ID and system fields (Safe by default)
      const { id, createdAt, updatedAt, ...rest } = item;

      // Basic validation
      if (!rest.title || !rest.image || !rest.link) {
        throw new Error(
          `Item at index ${index} is missing required fields (title, image, or link).`,
        );
      }

      return {
        ...rest,
        uploadDate: rest.uploadDate ? new Date(rest.uploadDate) : null, // Handle date string
      };
    });

    const result = await prisma.product.createMany({
      data: productsToCreate,
    });

    revalidatePath("/products");
    return { count: result.count, errors: 0 };
  } catch (error) {
    console.error("❌ Error importing products:", error);
    throw error;
  }
}
