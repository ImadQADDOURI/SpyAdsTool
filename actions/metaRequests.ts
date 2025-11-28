// actions\metaRequests.ts
"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { fetchMeta } from "@/components/adTool/meta/fetchMeta";

{
  /*
    ✅ Overview

| Action    | Function                                         | Description                                  |
| --------- | ------------------------------------------------ | -------------------------------------------- |
| 📋 List   | `listMetaRequests()`                             | Fetch all configs                            |
| ➕ Create  | `createMetaRequest(data)`                        | Add new config                               |
| ✏️ Edit   | `updateMetaRequest(id, data)`                    | Update config                                |
| ❌ Delete  | `deleteMetaRequest(id)`                          | Remove config                                |
| 🔄 Toggle | `toggleMetaRequest(id)`                          | Activate/deactivate                          |
| ⚙️ Test   | `testMetaRequest(name, variables?, includeRaw?)` | Run a config and get extracted + raw results |

    */
}

export async function listMetaRequests() {
  try {
    const requests = await prisma.metaGraphQLRequest.findMany({
      orderBy: { created_at: "desc" },
    });
    return { success: true, data: requests };
  } catch (error: any) {
    console.error("❌ listMetaRequests error:", error);
    return { success: false, error: error.message };
  }
}

export async function createMetaRequest(data: {
  name: string;
  friendly_name?: string;
  doc_id?: string;
  base_request: any;
  fields_to_extract: any;
}) {
  try {
    const request = await prisma.metaGraphQLRequest.create({
      data: {
        name: data.name,
        friendly_name: data.friendly_name || null,
        doc_id: data.doc_id || null,
        base_request: data.base_request,
        fields_to_extract: data.fields_to_extract,
      },
    });
    revalidatePath("/dashboard/meta"); // Adjust to your route
    return { success: true, data: request };
  } catch (error: any) {
    console.error("❌ createMetaRequest error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateMetaRequest(
  id: string,
  data: {
    name?: string;
    friendly_name?: string;
    doc_id?: string;
    base_request?: any;
    fields_to_extract?: any;
  },
) {
  try {
    const request = await prisma.metaGraphQLRequest.update({
      where: { id },
      data,
    });
    revalidatePath("/dashboard/meta");
    return { success: true, data: request };
  } catch (error: any) {
    console.error("❌ updateMetaRequest error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteMetaRequest(id: string) {
  try {
    await prisma.metaGraphQLRequest.delete({ where: { id } });
    revalidatePath("/dashboard/meta");
    return { success: true };
  } catch (error: any) {
    console.error("❌ deleteMetaRequest error:", error);
    return { success: false, error: error.message };
  }
}

export async function toggleMetaRequest(id: string) {
  try {
    const req = await prisma.metaGraphQLRequest.findUnique({ where: { id } });
    if (!req) throw new Error("Request not found");

    const updated = await prisma.metaGraphQLRequest.update({
      where: { id },
      data: { is_active: !req.is_active },
    });
    revalidatePath("/dashboard/meta");
    return { success: true, data: updated };
  } catch (error: any) {
    console.error("❌ toggleMetaRequest error:", error);
    return { success: false, error: error.message };
  }
}

export async function testMetaRequest(
  id: string,
  variables?: Record<string, any>,
  includeRaw: boolean = true,
) {
  try {
    const result = await fetchMeta({ id }, { variables, includeRaw });
    {
      /*
      
    console.log("🔍 Result structure:", {
      hasExtracted: !!result.extracted,
      extractedType: typeof result.extracted,
      isArray: Array.isArray(result.extracted),
      extractedKeys: result.extracted ? Object.keys(result.extracted) : [],
      extractedValue: result.extracted,
    }); 
    */
    }
    return { success: true, result };
  } catch (error: any) {
    console.error("❌ testMetaRequest error:", error);
    return { success: false, error: error.message };
  }
}
