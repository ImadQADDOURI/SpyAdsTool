// @/app/api/extension/auth/route.ts
import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/session"; // Your existing session helper

/**
 * ✨ API Route Handler for Chrome Extension Authentication Check ✨
 *
 * This GET handler allows the Chrome extension to verify if a user is currently
 * logged into the main web application by checking their session cookie.
 *
 * Returns:
 * - 200 OK: If the user is authenticated, returns user data (id, email, name, role, image).
 * The response structure is flexible for adding more data later (e.g., subscription).
 * - 401 Unauthorized: If the user is not authenticated (no valid session).
 * - 500 Internal Server Error: If there's an unexpected server issue.
 */
export async function GET() {
  try {
    // 🕵️‍♂️ Check for the current user session using your helper
    const user = await getCurrentUser();

    // 🚫 If no user session is found, they are not logged in
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "Unauthorized: User not logged in" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // ✅ User is authenticated! Return relevant user data.
    // 💡 You can easily add more fields here later (e.g., subscription status, favorites count)
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      image: user.image,
      // Add future fields here, e.g.:
      // subscription: user.subscriptionStatus,
      // favoritesCount: user.favorites.length,
    };

    console.log("✅ [API /extension/auth] User Authenticated:", userData.email);
    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    // 🚨 Handle unexpected errors during the process
    console.error("🚨 [API /extension/auth] Error:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

// 💡 Optional: Add POST, PUT, DELETE handlers here if needed for other extension interactions.
