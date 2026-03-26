// app/api/extension/ads/import/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { upsertAdRecord } from "@/actions/adController";

export async function POST(request: NextRequest) {
  console.log(
    `📬 [API /extension/ads/import] Received raw ad ingestion request.`,
  );

  // --- 1. Security Check ---
  // Check the API key from headers (x-api-key or Authorization)
  const authHeader = request.headers.get("authorization");
  const apiKeyHeader = request.headers.get("x-api-key");
  const providedKey = apiKeyHeader || authHeader?.replace("Bearer ", "");

  const expectedKey = process.env.CHROME_EXTENSION_API_KEY;

  if (!expectedKey) {
    console.error(
      "🚨 CHROME_EXTENSION_API_KEY is not defined in env variables!",
    );
    return NextResponse.json(
      { message: "Server configuration error" },
      { status: 500 },
    );
  }

  if (providedKey !== expectedKey) {
    console.warn(
      "🚫[API /extension/ads/import] Unauthorized ingestion attempt.",
    );
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // --- 2. Parse Payload ---
  let payload;
  try {
    payload = await request.json();
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  // Support arrays (batch import) or single ad objects
  const adsToProcess = Array.isArray(payload) ? payload : [payload];
  const results = { successful: 0, failed: 0, errors: [] as string[] };

  // --- 3. Process Ads ---
  for (const item of adsToProcess) {
    const { ad_archive_id, adData, country } = item;

    if (!ad_archive_id || !adData) {
      results.failed++;
      results.errors.push(`Missing ad_archive_id or adData for item.`);
      continue;
    }

    // Call the server action
    const result = await upsertAdRecord(ad_archive_id, adData, country);

    if (result.success) {
      results.successful++;
    } else {
      results.failed++;
      results.errors.push(`Failed to import ${ad_archive_id}: ${result.error}`);
    }
  }

  console.log(
    `✅ [API /extension/ads/import] Processed ${adsToProcess.length} ads. Success: ${results.successful}, Failed: ${results.failed}`,
  );

  // --- 4. Return Response ---
  if (results.successful === 0 && results.failed > 0) {
    return NextResponse.json(
      { message: "Failed to process ads", details: results.errors },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { message: "Ingestion complete", results },
    { status: 201 }, // 201 Created
  );
}
