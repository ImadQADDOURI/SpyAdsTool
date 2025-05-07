// @app/api/subscription/route.ts

import { NextRequest, NextResponse } from "next/server";

import { SubscriptionResponse } from "types"; // Assuming 'types' is a project alias or relative path
import { getCurrentUser } from "@/lib/session";
import { getUserSubscriptionPlan } from "@/lib/subscription";

/**
 * 🔒 Secure API route to fetch user subscription data.
 * This route prioritizes data freshness by not implementing caching.
 * It handles both authenticated requests and external queries with userId.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // 🔍 Extract optional userId from the query parameters
    const { searchParams } = new URL(req.url);
    const requestedUserId = searchParams.get("userId");

    // 🔐 Auth check - fetch current user when no specific userId is requested
    const currentUser = await getCurrentUser();

    // 🧩 Determine which user ID to use
    const userId = requestedUserId || currentUser?.id;

    // ⛔ If no user ID available, return unauthorized
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    // 🧪 Development bypass mode - provides automatic access for testing
    if (process.env.NEXT_PUBLIC_SUBSCRIPTION_BYPASS === "true") {
      // Create a mock subscription response for development
      const mockResponse: SubscriptionResponse = {
        subscription: null, // No actual subscription details in bypass mode
        userHasAccess: true, // Auto-grant access in development
      };
      console.log("✅ [Subscription API] Development bypass active.");
      return NextResponse.json(mockResponse);
    }

    // 📊 Get detailed subscription data. This will now always fetch fresh data.
    const subscriptionPlan = await getUserSubscriptionPlan(userId);

    // 🔑 Determine access - a user has access if their plan is paid and still valid
    const userHasAccess = subscriptionPlan.isPaid;

    // 📤 Return subscription data and access status
    const response: SubscriptionResponse = {
      subscription: subscriptionPlan,
      userHasAccess,
    };

    // 🚫 Cache-Control header removed to ensure data freshness on every request.
    // Vercel and other CDNs will not cache this response by default.
    return NextResponse.json(response);
  } catch (error) {
    // 💥 Detailed error handling with appropriate status codes
    console.error("💀 [Subscription API Error]:", error);

    if (error instanceof Error) {
      // Handle specific error messages from getUserSubscriptionPlan
      if (error.message === "User not found") {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      if (error.message === "Authentication required") {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 },
        );
      }
    }

    // Generic server error for other cases
    return NextResponse.json(
      { error: "Failed to fetch subscription data" },
      { status: 500 },
    );
  }
}
