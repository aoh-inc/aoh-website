import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getCheckoutProduct } from "@/lib/checkout";
import { supabaseRest } from "@/lib/supabase-rest";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  const { slug, runId, source } = body as { slug?: unknown; runId?: unknown; source?: unknown };
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
  const visibilityReportRunId = typeof runId === "string" ? cleanMetadataValue(runId, 160) : "";
  const leadSource = typeof source === "string" ? cleanMetadataValue(source, 120) : "";
  const lineItems = [
    { price: product.stripePriceId, quantity: 1 },
    ...(product.setupPriceId ? [{ price: product.setupPriceId, quantity: 1 }] : []),
  ];
  const metadata = {
    product_slug: product.slug,
    product_name: product.name,
    ...(visibilityReportRunId ? { visibility_report_run_id: visibilityReportRunId } : {}),
    ...(leadSource ? { lead_source: leadSource } : {}),
  };
  const successUrl =
    `${origin}/checkout/success?product=${encodeURIComponent(product.slug)}` +
    `&session_id={CHECKOUT_SESSION_ID}` +
    (visibilityReportRunId ? `&runId=${encodeURIComponent(visibilityReportRunId)}` : "");

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: product.stripeMode,
    line_items: lineItems,
    success_url: successUrl,
    cancel_url: `${origin}/pricing`,
    metadata,
    billing_address_collection: "required",
    allow_promotion_codes: false,
    customer_creation: product.stripeMode === "payment" ? "always" : undefined,
    payment_method_types: ["card", "link", "us_bank_account"],
    consent_collection: {
      terms_of_service: "required",
    },
    custom_text: {
      submit: {
        message:
          "Delivered in 48 hours · No contract · If any fix isn't right, we fix it. Questions: support@getmefound.ai",
      },
      terms_of_service_acceptance: {
        message: `By completing this purchase you agree to GetMeFound's [Terms of Service](${origin}/terms) and [Privacy Policy](${origin}/privacy). Work guarantee: if any fix isn't done correctly, we fix it — see [Guarantee Policy](${origin}/guarantee).`,
      },
    },
  };

  if (product.stripeMode === "subscription") {
    sessionParams.subscription_data = {
      metadata,
    };
  }

  const session = await stripe.checkout.sessions.create(sessionParams);

  return NextResponse.json({ ok: true, url: session.url });
}

function cleanMetadataValue(value: string, max: number) {
  return value.trim().replace(/[^\w .:@/-]/g, "").slice(0, max);
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
