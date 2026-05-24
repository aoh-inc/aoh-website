import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseRest } from "@/lib/supabase-rest";
import { postToSlack, GMF_MANAGER_CHANNEL } from "@/lib/slack";
import { saveSubscriptionToSupabase } from "@/app/api/checkout/create-session/route";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;
  try {
    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } else {
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err) {
    console.error("Stripe webhook signature failed", err);
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Idempotency — skip already-processed events
  const alreadyProcessed = await markEventProcessed(event.id, event.type);
  if (alreadyProcessed) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case "invoice.paid":
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;
      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      case "charge.dispute.created":
        await handleDisputeCreated(event.data.object as Stripe.Dispute);
        break;
    }
  } catch (err) {
    console.error(`Stripe webhook handler error for ${event.type}`, err);
  }

  return NextResponse.json({ ok: true });
}

// --- Idempotency ---

async function markEventProcessed(eventId: string, eventType: string): Promise<boolean> {
  // Try to insert; if it fails with unique violation, event was already processed
  const result = await supabaseRest("stripe_webhook_events", {
    method: "POST",
    prefer: "return=minimal",
    body: { stripe_event_id: eventId, event_type: eventType },
  });
  // 409 = conflict = already exists = already processed
  if (result.status === 409) return true;
  return false;
}

// --- Event handlers ---

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const productSlug = session.metadata?.product_slug ?? "unknown";
  const productName = session.metadata?.product_name ?? "Unknown";
  const customerEmail = session.customer_details?.email ?? null;
  const customerName = session.customer_details?.name ?? null;
  const amountTotal = session.amount_total ? session.amount_total / 100 : null;
  const stripeCustomerId = typeof session.customer === "string" ? session.customer : null;

  // If this was a subscription checkout, fetch and save the subscription
  if (session.mode === "subscription" && typeof session.subscription === "string") {
    const sub = await stripe.subscriptions.retrieve(session.subscription);
    await saveSubscriptionToSupabase(sub, customerEmail, customerName);
  }

  await Promise.allSettled([
    supabaseRest("stripe_orders", {
      method: "POST",
      prefer: "return=minimal",
      body: {
        stripe_session_id: session.id,
        product_slug: productSlug,
        product_name: productName,
        customer_email: customerEmail,
        customer_name: customerName,
        amount_total: amountTotal,
        mode: session.mode,
        stripe_customer_id: stripeCustomerId,
        created_at: new Date().toISOString(),
      },
    }),
    postToSlack(
      GMF_MANAGER_CHANNEL,
      `*New ${session.mode === "subscription" ? "subscription" : "one-time payment"} — ${productName}*

*Customer:* ${customerName ?? "not provided"} — ${customerEmail ?? "no email"}
*Amount:* ${amountTotal != null ? `$${amountTotal.toFixed(2)}` : "unknown"}
*Plan:* ${productName}
*Stripe session:* ${session.id}

Manager — new paying client. Start onboarding: collect business details, confirm GBP access, set up their service. Escalate to Mike only if onboarding is blocked.`,
    ),
  ]);
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  // Skip the first invoice — already handled by checkout.session.completed
  if (invoice.billing_reason === "subscription_create") return;

  const sub = typeof invoice.subscription === "string" ? invoice.subscription : invoice.subscription?.id;
  const customerId = typeof invoice.customer === "string" ? invoice.customer : null;
  const customerEmail = invoice.customer_email;
  const amount = invoice.amount_paid / 100;

  // Update subscription status to active in Supabase
  if (sub) {
    await supabaseRest(`stripe_subscriptions?stripe_subscription_id=eq.${sub}`, {
      method: "PATCH",
      prefer: "return=minimal",
      body: { status: "active", updated_at: new Date().toISOString() },
    });
  }

  // Quiet Slack log — just a billing pulse, not an action item
  await postToSlack(
    GMF_MANAGER_CHANNEL,
    `Recurring payment collected — ${customerEmail ?? customerId} — $${amount.toFixed(2)} — sub ${sub}`,
  );
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const sub = typeof invoice.subscription === "string" ? invoice.subscription : invoice.subscription?.id;
  const customerId = typeof invoice.customer === "string" ? invoice.customer : null;
  const customerEmail = invoice.customer_email;
  const amount = invoice.amount_due / 100;
  const attemptCount = invoice.attempt_count ?? 1;
  const nextRetry = invoice.next_payment_attempt
    ? new Date(invoice.next_payment_attempt * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : null;

  // Update subscription status to past_due
  if (sub) {
    await supabaseRest(`stripe_subscriptions?stripe_subscription_id=eq.${sub}`, {
      method: "PATCH",
      prefer: "return=minimal",
      body: { status: "past_due", updated_at: new Date().toISOString() },
    });
  }

  const urgency = attemptCount >= 3 ? "🚨 *URGENT*" : "⚠️";
  const retryLine = nextRetry ? `Next retry: ${nextRetry}.` : "No more retries scheduled — cancellation imminent.";

  await postToSlack(
    GMF_MANAGER_CHANNEL,
    `${urgency} *Payment failed — attempt ${attemptCount}*

*Customer:* ${customerEmail ?? customerId}
*Amount due:* $${amount.toFixed(2)}
*Subscription:* ${sub}
${retryLine}

Manager — reach out to the client to update their payment method. ${attemptCount >= 3 ? "Escalate to Mike if no response after two attempts." : "Soft message first — link them to update their card."}`,
  );
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = typeof subscription.customer === "string" ? subscription.customer : null;
  const priceId = subscription.items.data[0]?.price?.id ?? null;
  const cancelAtPeriodEnd = subscription.cancel_at_period_end;
  const periodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000).toISOString()
    : null;

  await supabaseRest(`stripe_subscriptions?stripe_subscription_id=eq.${subscription.id}`, {
    method: "PATCH",
    prefer: "return=minimal",
    body: {
      status: subscription.status,
      cancel_at_period_end: cancelAtPeriodEnd,
      current_period_end: periodEnd,
      updated_at: new Date().toISOString(),
    },
  });

  // Only post to Slack if customer scheduled cancellation
  if (cancelAtPeriodEnd) {
    await postToSlack(
      GMF_MANAGER_CHANNEL,
      `Subscription cancellation scheduled — customer ${customerId} — ends ${periodEnd ? new Date(periodEnd).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "at period end"}.

Manager — consider a win-back message before the period ends. Do not push hard. One genuine check-in only.`,
    );
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = typeof subscription.customer === "string" ? subscription.customer : null;

  await supabaseRest(`stripe_subscriptions?stripe_subscription_id=eq.${subscription.id}`, {
    method: "PATCH",
    prefer: "return=minimal",
    body: { status: "canceled", updated_at: new Date().toISOString() },
  });

  await postToSlack(
    GMF_MANAGER_CHANNEL,
    `Subscription ended — customer ${customerId} — sub ${subscription.id}.

Manager — service is now inactive. One win-back outreach allowed; do not spam. Log outcome in Supabase client record.`,
  );
}

async function handleDisputeCreated(dispute: Stripe.Dispute) {
  const chargeId = typeof dispute.charge === "string" ? dispute.charge : dispute.charge?.id;
  const amount = dispute.amount / 100;
  const reason = dispute.reason;
  const dueBy = dispute.evidence_details?.due_by
    ? new Date(dispute.evidence_details.due_by * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "check Stripe";

  await postToSlack(
    GMF_MANAGER_CHANNEL,
    `🚨 *DISPUTE FILED — escalate to Mike immediately*

*Amount:* $${amount.toFixed(2)}
*Reason:* ${reason}
*Charge:* ${chargeId}
*Evidence due by:* ${dueBy}

This requires Mike. Do not handle autonomously. Forward to Mike with the charge ID and dispute ID (${dispute.id}) now.`,
  );
}
