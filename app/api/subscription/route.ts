import { NextRequest, NextResponse } from "next/server";

import { SubscriptionResponse } from "types";
import { getCurrentUser } from "@/lib/session";
import { getUserSubscriptionPlan } from "@/lib/subscription";

/**
 * Secure API route to fetch user subscription data
 * Handles both authenticated requests and external queries with userId
 * Uses a 24-hour cache strategy
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

      return NextResponse.json(mockResponse);
    }

    // 📊 Get detailed subscription data
    const subscriptionPlan = await getUserSubscriptionPlan(userId);

    // 🔑 Determine access - a user has access if their plan is paid and still valid
    const userHasAccess = subscriptionPlan.isPaid;

    // 📤 Return subscription data and access status with cache headers
    const response: SubscriptionResponse = {
      subscription: subscriptionPlan,
      userHasAccess,
    };

    return NextResponse.json(response, {
      headers: {
        // Cache for 24 hours, but allow stale data for 48 hours while revalidating in background
        "Cache-Control":
          "public, s-maxage=86400, stale-while-revalidate=172800",
      },
    });
  } catch (error) {
    // 💥 Detailed error handling with appropriate status codes
    console.error("Subscription API error:", error);

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
