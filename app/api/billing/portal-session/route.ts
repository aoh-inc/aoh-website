import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  const { customerId } = body as { customerId?: unknown };
  if (typeof customerId !== "string" || !customerId.startsWith("cus_")) {
    return NextResponse.json({ ok: false, error: "Invalid customer ID." }, { status: 400 });
  }

  const origin = req.headers.get("origin") ?? "https://getmefound.ai";

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${origin}/pricing`,
  });

  return NextResponse.json({ ok: true, url: session.url });
}
