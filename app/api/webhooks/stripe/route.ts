// @app/api/webhooks/stripe/route.ts
import { headers } from "next/headers";
import Stripe from "stripe";

import { env } from "@/env.mjs";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";

// 🔐 Enhanced webhook security with comprehensive event handling
export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }

  // 🛡️ Centralized error handling for Stripe operations
  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSession(
          event.data.object as Stripe.Checkout.Session,
        );
        break;

      case "invoice.payment_succeeded":
        await handleInvoicePayment(event.data.object as Stripe.Invoice);
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdate(
          event.data.object as Stripe.Subscription,
        );
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDelete(
          event.data.object as Stripe.Subscription,
        );
        break;

      default:
        console.warn(`🤖 Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error("🔴 Webhook Error:", error);
    return new Response("Webhook handler failed", { status: 500 });
  }

  return new Response(null, { status: 200 });
}

// 🧠 Core event handlers
async function handleCheckoutSession(session: Stripe.Checkout.Session) {
  if (!session?.metadata?.userId) {
    console.error("🚫 Missing userId in metadata");
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(
    session.subscription as string,
  );

  await prisma.user.update({
    where: { id: session.metadata.userId },
    data: {
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      stripePriceId: subscription.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  });
}

async function handleInvoicePayment(invoice: Stripe.Invoice) {
  if (invoice.billing_reason === "subscription_create") return;

  const subscription = await stripe.subscriptions.retrieve(
    invoice.subscription as string,
  );

  await prisma.user.update({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      stripePriceId: subscription.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  });
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const user = await prisma.user.findUnique({
    where: { stripeCustomerId: subscription.customer as string },
  });

  if (!user) {
    console.error("👤 User not found for subscription update");
    return;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      stripePriceId: subscription.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      ...(subscription.status === "canceled" && {
        stripeSubscriptionId: null,
        stripePriceId: null,
      }),
    },
  });
}

async function handleSubscriptionDelete(subscription: Stripe.Subscription) {
  await prisma.user.updateMany({
    where: { stripeCustomerId: subscription.customer as string },
    data: {
      stripeSubscriptionId: null,
      stripePriceId: null,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  });
}
