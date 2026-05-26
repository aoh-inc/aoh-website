import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getCheckoutProduct } from "@/lib/checkout";
import { supabaseRest } from "@/lib/supabase-rest";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  const { slug } = body as { slug?: unknown };
  if (typeof slug !== "string") {
    return NextResponse.json({ ok: false, error: "Missing product slug." }, { status: 400 });
  }

  const product = getCheckoutProduct(slug);
  if (!product) {
    return NextResponse.json({ ok: false, error: "Product not found." }, { status: 404 });
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    return NextResponse.json({ ok: false, error: "Checkout is not configured." }, { status: 500 });
  }

  const stripe = new Stripe(stripeSecretKey);
  const origin = req.headers.get("origin") ?? "https://getmefound.ai";
  const lineItems = [
    { price: product.stripePriceId, quantity: 1 },
    ...(product.setupPriceId ? [{ price: product.setupPriceId, quantity: 1 }] : []),
  ];

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: product.stripeMode,
    line_items: lineItems,
    success_url: `${origin}/checkout/success?product=${product.slug}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/pricing`,
    metadata: { product_slug: product.slug, product_name: product.name },
    billing_address_collection: "required",
    allow_promotion_codes: false,
    customer_creation: product.stripeMode === "payment" ? "always" : undefined,
  };

  if (product.stripeMode === "subscription") {
    sessionParams.subscription_data = {
      metadata: { product_slug: product.slug, product_name: product.name },
    };
  }

  const session = await stripe.checkout.sessions.create(sessionParams);

  return NextResponse.json({ ok: true, url: session.url });
}

export async function saveSubscriptionToSupabase(subscription: Stripe.Subscription, customerEmail: string | null, customerName: string | null) {
  const priceId = subscription.items.data[0]?.price?.id ?? null;
  const productSlug = subscription.metadata?.product_slug ?? "unknown";
  const productName = subscription.metadata?.product_name ?? "Unknown";
  const customerId = typeof subscription.customer === "string" ? subscription.customer : null;
  const rawPeriodEnd = subscription.items.data[0]?.current_period_end;
  const periodEnd = rawPeriodEnd ? new Date(rawPeriodEnd * 1000).toISOString() : null;

  const result = await supabaseRest("stripe_subscriptions", {
    method: "POST",
    prefer: "return=minimal,resolution=merge-duplicates",
    body: {
      stripe_subscription_id: subscription.id,
      stripe_customer_id: customerId,
      customer_email: customerEmail,
      customer_name: customerName,
      product_slug: productSlug,
      product_name: productName,
      stripe_price_id: priceId,
      status: subscription.status,
      cancel_at_period_end: subscription.cancel_at_period_end,
      current_period_end: periodEnd,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  });

  if (!result.ok) {
    console.error("Failed to save subscription to Supabase", result.error);
  }
}
