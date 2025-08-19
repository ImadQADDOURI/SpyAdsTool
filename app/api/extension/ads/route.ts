// @/app/api/extension/ads/route.ts

import { NextResponse, type NextRequest } from "next/server";
import {
  getExtensionSavedAds,
  removeAdFromBoard,
  saveAdToBoard,
} from "@/actions/savedAds";

import { AdData } from "@/types/ad";
// Import your server actions
import { getCurrentUser } from "@/lib/session";

// --- Configuration ---
// Define a specific board name for ads saved/unsaved via the extension
const EXTENSION_BOARD_NAME = "Extension Saves";

// --- Helper Function ---
// Maps the result object from server actions to appropriate HTTP responses
const handleActionResult = (
  result: { success?: boolean; error?: string },
  successStatus = 200,
) => {
  if (result.success) {
    // ✅ Success case
    return NextResponse.json(
      { message: "Operation successful" },
      { status: successStatus },
    );
  }

  // ❌ Error case
  const errorMessage = result.error || "An unknown error occurred";
  let statusCode = 500; // Default: Internal Server Error

  // Map specific error messages from server actions to HTTP status codes
  if (errorMessage === "Unauthorized") {
    statusCode = 401; // Unauthorized
  } else if (
    errorMessage === "Missing required fields" ||
    errorMessage.startsWith("Invalid")
  ) {
    statusCode = 400; // Bad Request (e.g., validation failed)
  } else if (
    errorMessage === "Failed to save ad" ||
    errorMessage === "Failed to remove ad"
  ) {
    // Keep as 500, as it indicates a server-side DB or processing issue
    statusCode = 500;
  }
  // Add more specific error mappings here if your server actions return other distinct errors

  console.error(
    `🚨 [API /extension/ads] Action failed with status ${statusCode}: ${errorMessage}`,
  );
  return NextResponse.json({ message: errorMessage }, { status: statusCode });
};

// --- API Handlers ---

/**
 * ❤️ GET Handler: Fetches the list of saved ads (ID and imageUrl) for the authenticated user
 * from their "Extension Saves" board.
 */
export async function GET() {
  console.log(`📬 [API /extension/ads] Received GET request for saved ads.`);
  try {
    // 🕵️‍♂️ Step 1: Authenticate the user
    const user = await getCurrentUser();
    if (!user || !user.id) {
      console.log("🚫 [API /extension/ads] Unauthorized: No session found.");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ❤️ Step 2: Fetch the saved ad data using the new helper
    const savedAds = await getExtensionSavedAds(user.id);
    console.log(
      `✅ [API /extension/ads] Found ${savedAds.length} saved ads in 'Extension Saves' for ${user.email}.`,
    );

    // 📦 Step 3: Return the array of ad objects
    return NextResponse.json({ savedAds: savedAds }, { status: 200 });
  } catch (error) {
    console.error(
      "🚨 [API /extension/ads] Unexpected error fetching saved ads:",
      error,
    );
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
/**
 * 💾 POST Handler: Saves an ad sent from the Chrome Extension.
 * Expects JSON body: { ad_archive_id: string, adData: AdData }
 */
export async function POST(request: NextRequest) {
  console.log(`📬 [API /extension/ads] Received POST request to save ad.`);

  let payload;
  try {
    payload = await request.json();
  } catch (error) {
    console.error(
      "🚨 [API /extension/ads] Failed to parse request JSON:",
      error,
    );
    return NextResponse.json(
      { message: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  const { ad_archive_id, adData } = payload;

  // Basic validation on received data
  if (!ad_archive_id || typeof ad_archive_id !== "string") {
    console.warn(
      "⚠️ [API /extension/ads] POST validation failed: Missing or invalid ad_archive_id",
    );
    return NextResponse.json(
      { message: "Missing or invalid 'ad_archive_id'" },
      { status: 400 },
    );
  }
  if (!adData) {
    console.warn(
      "⚠️ [API /extension/ads] POST validation failed: Missing adData",
    );
    return NextResponse.json({ message: "Missing 'adData'" }, { status: 400 });
  }

  console.log(
    `📄 [API /extension/ads] Attempting to save ad ${ad_archive_id} to board '${EXTENSION_BOARD_NAME}'.`,
  );

  try {
    // Call the server action to save the ad
    const result = await saveAdToBoard(
      ad_archive_id,
      EXTENSION_BOARD_NAME,
      adData as AdData,
    );
    console.log(
      `✅ [API /extension/ads] saveAdToBoard result for ${ad_archive_id}:`,
      result,
    );

    // Use helper to generate response based on action result (201 Created for successful POST)
    return handleActionResult(result, 201);
  } catch (error) {
    // Catch unexpected errors during server action execution
    console.error(
      `🚨 [API /extension/ads] Unexpected error calling saveAdToBoard for ${ad_archive_id}:`,
      error,
    );
    return NextResponse.json(
      { message: "Internal server error during save operation." },
      { status: 500 },
    );
  }
}

/**
 * 🗑️ DELETE Handler: Unsaves/removes an ad specified by the Chrome Extension.
 * Expects query parameter: ?ad_archive_id=<value>
 */
export async function DELETE(request: NextRequest) {
  console.log(`📬 [API /extension/ads] Received DELETE request to unsave ad.`);

  // Extract ad_archive_id from URL query parameters
  const ad_archive_id = request.nextUrl.searchParams.get("ad_archive_id");

  // Basic validation on the query parameter
  if (!ad_archive_id || typeof ad_archive_id !== "string") {
    console.warn(
      "⚠️ [API /extension/ads] DELETE validation failed: Missing or invalid 'ad_archive_id' query parameter.",
    );
    return NextResponse.json(
      { message: "Missing or invalid 'ad_archive_id' query parameter" },
      { status: 400 },
    );
  }

  console.log(
    `📄 [API /extension/ads] Attempting to remove ad ${ad_archive_id} from board '${EXTENSION_BOARD_NAME}'.`,
  );

  try {
    // Call the server action to remove the ad
    const result = await removeAdFromBoard(ad_archive_id, EXTENSION_BOARD_NAME);
    console.log(
      `✅ [API /extension/ads] removeAdFromBoard result for ${ad_archive_id}:`,
      result,
    );

    // Use helper to generate response based on action result (200 OK for successful DELETE)
    return handleActionResult(result, 200);
  } catch (error) {
    // Catch unexpected errors during server action execution
    console.error(
      `🚨 [API /extension/ads] Unexpected error calling removeAdFromBoard for ${ad_archive_id}:`,
      error,
    );
    return NextResponse.json(
      { message: "Internal server error during remove operation." },
      { status: 500 },
    );
  }
}

// 💡 Optional: Implement OPTIONS handler if needed for CORS preflight requests,
// although Next.js headers configuration in next.config.js might handle this.
// export async function OPTIONS() {
//   // Handle CORS preflight checks
//   // You might need to return specific headers depending on your CORS setup
//   return new NextResponse(null, { status: 200 });
// }
