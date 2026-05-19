import Stripe from "stripe";
import { Router, raw } from "express";
import { createOrder, getOrderByStripeSession, getProductById, grantDownloadAccess, updateOrderStatus, updateUserStripeCustomerId, getUserById } from "./db";
import { notifyOwner } from "./_core/notification";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-04-22.dahlia",
});

export const stripeRouter = Router();

// Webhook endpoint — must use raw body for signature verification
stripeRouter.post("/webhook", raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error("[Stripe Webhook] Signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle test events
  if (event.id.startsWith("evt_test_")) {
    console.log("[Webhook] Test event detected, returning verification response");
    return res.json({ verified: true });
  }

  console.log(`[Stripe Webhook] Received event: ${event.type} (${event.id})`);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = parseInt(session.metadata?.user_id || "0");
        const productId = parseInt(session.metadata?.product_id || "0");

        if (!userId || !productId) {
          console.error("[Stripe Webhook] Missing user_id or product_id in metadata");
          break;
        }

        // Update order status
        const existingOrder = await getOrderByStripeSession(session.id);
        if (existingOrder) {
          await updateOrderStatus(existingOrder.id, "completed", session.payment_intent as string);
        }

        // Grant download access
        await grantDownloadAccess({
          userId,
          productId,
          orderId: existingOrder?.id,
        });

        // Update Stripe customer ID on user if available
        if (session.customer) {
          await updateUserStripeCustomerId(userId, session.customer as string);
        }

        // Notify owner of new purchase
        const product = await getProductById(productId);
        await notifyOwner({
          title: "New Purchase",
          content: `User #${userId} purchased "${product?.name || "Unknown"}" for $${session.amount_total ? (session.amount_total / 100).toFixed(2) : "0.00"}`,
        });

        console.log(`[Stripe Webhook] Order completed: user=${userId}, product=${productId}`);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`[Stripe Webhook] Payment failed: ${paymentIntent.id}`);
        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error(`[Stripe Webhook] Error processing ${event.type}:`, error);
  }

  res.json({ received: true });
});

// Create checkout session
export async function createCheckoutSession(params: {
  productId: number;
  userId: number;
  userEmail: string;
  userName: string;
  origin: string;
}) {
  const { productId, userId, userEmail, userName, origin } = params;

  const product = await getProductById(productId);
  if (!product) throw new Error("Product not found");
  if (product.isFree) throw new Error("Cannot checkout free products");

  const priceInCents = Math.round(parseFloat(product.price) * 100);

  // Create order record
  const orderId = await createOrder({
    userId,
    productId,
    amount: product.price,
    currency: product.currency,
    status: "pending",
    customerEmail: userEmail,
  });

  // Create Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: userEmail,
    client_reference_id: userId.toString(),
    allow_promotion_codes: true,
    metadata: {
      user_id: userId.toString(),
      product_id: productId.toString(),
      order_id: orderId.toString(),
      customer_email: userEmail,
      customer_name: userName,
    },
    line_items: [
      {
        price_data: {
          currency: product.currency,
          product_data: {
            name: product.name,
            description: product.shortDescription || undefined,
          },
          unit_amount: priceInCents,
        },
        quantity: 1,
      },
    ],
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/store`,
  });

  // Update order with session ID
  if (session.id) {
    const { getDb } = await import("./db");
    const db = await getDb();
    if (db) {
      const { orders } = await import("../drizzle/schema");
      const { eq } = await import("drizzle-orm");
      await db.update(orders).set({ stripeSessionId: session.id }).where(eq(orders.id, orderId));
    }
  }

  return { url: session.url, sessionId: session.id };
}
