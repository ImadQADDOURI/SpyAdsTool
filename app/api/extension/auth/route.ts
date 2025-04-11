// @/app/api/extension/auth/route.ts
import { NextResponse } from "next/server";
import { getUserSavedAdIds } from "@/actions/savedAds"; // Import the saved ads helper
import { UserSubscriptionPlan } from "@/types";

import { getCurrentUser } from "@/lib/session"; // Your existing session helper
import { getUserSubscriptionPlan } from "@/lib/subscription"; // Import subscription helper

/**
 * ✨ API Route Handler for Chrome Extension Authentication Check (Final Version) ✨
 *
 * This GET handler allows the Chrome extension to verify if a user is currently
 * logged into the main web application and retrieve essential data for extension functionality.
 * It leverages existing session cookies for authentication.
 *
 * Returns:
 * - 200 OK: If the user is authenticated, returns a JSON object containing:
 * - Basic user info (id, email, name, role, image)
 * - Subscription status (userHasAccess: boolean, planTitle: string)
 * - List of saved ad IDs (savedAdIds: string[])
 * - 401 Unauthorized: If the user is not authenticated (no valid session cookie found).
 * - 500 Internal Server Error: If there's an unexpected server issue during data fetching.
 */
export async function GET() {
  try {
    // 🕵️‍♂️ Step 1: Check for the current user session using the shared helper
    const user = await getCurrentUser();

    // 🚫 Step 2: Validate the session. If no user or user ID, return Unauthorized.
    if (!user || !user.id) {
      console.log(
        "🚫 [API /extension/auth] Unauthorized: No valid session found.",
      );
      return new NextResponse(
        JSON.stringify({ message: "Unauthorized: User not logged in" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // --- User is Authenticated - Proceed to Fetch Additional Data ---
    console.log(
      `✅ [API /extension/auth] User Authenticated: ${user.email} (ID: ${user.id})`,
    );

    // ⚙️ Initialize variables with default values
    let subscriptionPlan: UserSubscriptionPlan | null = null;
    let savedAdIds: string[] = [];
    let userHasAccess = false;
    let planTitle = "Free"; // Default plan title if fetch fails or no plan

    // 💰 Step 3: Fetch user's subscription plan
    try {
      subscriptionPlan = await getUserSubscriptionPlan(user.id);
      // Update access status and plan title based on fetched data
      userHasAccess = subscriptionPlan.isPaid;
      planTitle = subscriptionPlan.title;
      console.log(
        `💰 [API /extension/auth] Subscription for ${user.email}: ${planTitle} (Paid: ${userHasAccess})`,
      );
    } catch (subError) {
      // Log error but allow the request to proceed with default/no subscription info
      console.error(
        `🚨 [API /extension/auth] Error fetching subscription for ${user.email}:`,
        subError,
      );
      // Defaults (userHasAccess = false, planTitle = "Free") will be used
    }

    // ❤️ Step 4: Fetch user's saved ad IDs
    try {
      savedAdIds = await getUserSavedAdIds(user.id);
      console.log(
        `❤️ [API /extension/auth] Found ${savedAdIds.length} saved ad IDs for ${user.email}`,
      );
    } catch (adError) {
      // Log error but allow the request to proceed with an empty ads list
      console.error(
        `🚨 [API /extension/auth] Error fetching saved ads for ${user.email}:`,
        adError,
      );
      // Default (savedAdIds = []) will be used
    }

    // 📦 Step 5: Prepare the final response payload
    const responseData = {
      // --- Basic User Info ---
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      image: user.image,
      // --- Subscription Info ---
      userHasAccess: userHasAccess, // Boolean indicating paid status
      planTitle: planTitle, // String name of the plan (e.g., "Free", "Pro")
      // --- Saved Ads Info ---
      savedAdIds: savedAdIds, // Array of strings (ad_archive_id)
      // 💡 Future data can be easily added here
    };

    // ✅ Step 6: Return the successful response with all fetched data
    console.log(
      `✅ [API /extension/auth] Data prepared for ${user.email}. Sending response.`,
    );
    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    // 🚨 Step 7: Catch-all for unexpected errors during the process
    console.error("🚨 [API /extension/auth] Unexpected General Error:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

// 💡 Optional: Implement OPTIONS handler if needed for CORS preflight requests,
// although Next.js headers configuration often handles this.
// export async function OPTIONS() {
//   return new NextResponse(null, { status: 200 });
// }
