import type { Metadata } from "next";
import { ReviewAutomationIntakeForm } from "@/components/ReviewAutomationIntakeForm";

const inviteEmail =
  process.env.NEXT_PUBLIC_GMF_GBP_INVITE_EMAIL?.trim() ||
  process.env.NEXT_PUBLIC_AOH_GBP_INVITE_EMAIL?.trim() ||
  "mike@getmefound.ai";

export const metadata: Metadata = {
  title: "Client Setup Intake - GetMeFound",
  description: "Submit business setup details for Review Power and Google Business Profile access.",
  robots: { index: false, follow: false },
};

export default function ReviewAutomationIntakePage() {
  return (
    <main className="min-h-screen bg-[#f6f7f4] text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 md:grid-cols-[0.9fr_1.1fr] md:py-14">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
              Client setup
            </p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              Review Power intake
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
              Send us the business details we need to verify Google Business Profile access and start setup.
            </p>
          </div>

          <div className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
            <div>
              <span className="font-semibold text-slate-950">Google access email:</span>{" "}
              <span className="font-mono">{inviteEmail}</span>
            </div>
            <div>
              Add this email as <span className="font-semibold">Manager</span> in Google Business Profile
              settings under People and access. No password sharing.
            </div>
            <div className="text-slate-500">
              After this form is submitted, our Manager routes the setup packet to Profile Manager,
              Reviews Manager, and GHL Expert.
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-10 md:grid-cols-[1fr_320px]">
        <ReviewAutomationIntakeForm inviteEmail={inviteEmail} />

        <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold">What happens next</h2>
          <ol className="mt-4 space-y-4 text-sm leading-6 text-slate-600">
            <li>
              <span className="font-semibold text-slate-950">1. Access check</span>
              <br />
              Profile Manager confirms whether GetMeFound can see the Google profile.
            </li>
            <li>
              <span className="font-semibold text-slate-950">2. Setup routing</span>
              <br />
              Reviews Manager prepares the review request flow. Systems Director keeps any legacy GHL handoff limited to export or bridge work.
            </li>
            <li>
              <span className="font-semibold text-slate-950">3. Manager summary</span>
              <br />
              Manager reports ready, blocked, or needs client help.
            </li>
          </ol>
        </aside>
      </section>
    </main>
  );
}
