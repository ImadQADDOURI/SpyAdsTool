// @app/api/user/route.ts
import { auth } from "@/auth";

import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";

// 🚦 Safe user deletion with subscription cleanup
export const DELETE = auth(async (req) => {
  if (!req.auth) return new Response("Unauthorized", { status: 401 });

  const { user } = req.auth;
  if (!user) return new Response("Invalid user", { status: 400 });

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { stripeSubscriptionId: true },
    });

    // 1️⃣ Cancel active subscription first
    if (dbUser?.stripeSubscriptionId) {
      await stripe.subscriptions.cancel(dbUser.stripeSubscriptionId);
    }

    // 2️⃣ Delete user after successful cancellation
    await prisma.user.delete({ where: { id: user.id } });

    return new Response("User deleted successfully", { status: 200 });
  } catch (error) {
    console.error("🔴 User deletion error:", error);
    return new Response("Deletion failed", { status: 500 });
  }
});
