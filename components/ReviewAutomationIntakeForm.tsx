"use client";

import { useRef, useState } from "react";
import { track } from "@vercel/analytics";
import { validateEmail } from "@/lib/email-validation";

type AccessStatus = "added" | "need_help" | "not_sure";
type AccessRole = "manager" | "owner" | "not_sure";
type ServiceIntent = "review_automation" | "gbp_update" | "ai_visibility" | "not_sure";

type FormState = {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  gbpLink: string;
  accessStatus: AccessStatus;
  accessRole: AccessRole;
  serviceIntent: ServiceIntent;
  customerSystem: string;
  notes: string;
  authorized: boolean;
};

const initialState: FormState = {
  businessName: "",
  contactName: "",
  email: "",
  phone: "",
  website: "",
  gbpLink: "",
  accessStatus: "added",
  accessRole: "manager",
  serviceIntent: "review_automation",
  customerSystem: "",
  notes: "",
  authorized: false,
};

export function ReviewAutomationIntakeForm({ inviteEmail }: { inviteEmail: string }) {
  const [form, setForm] = useState<FormState>(initialState);
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if ((honeypotRef.current?.value ?? "").trim()) {
      setSubmitted(true);
      return;
    }

    if (form.businessName.trim().length < 2) {
      setError("Add the business name.");
      return;
    }
    if (form.contactName.trim().length < 2) {
      setError("Add your name.");
      return;
    }
    const emailCheck = validateEmail(form.email);
    if (!emailCheck.ok) {
      setError(emailCheck.error);
      return;
    }
    if (!form.authorized) {
      setError("Confirm you are authorized to request setup for this business.");
      return;
    }

    setPending(true);
    try {
      const response = await fetch("/api/intake/review-automation", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...form, inviteEmail, websiteTrap: honeypotRef.current?.value ?? "" }),
      });
      const data = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        setError(data.error ?? "Something went wrong. Try again.");
        return;
      }
      track("review_automation_intake_submit");
      setSubmitted(true);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setPending(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-white p-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
          Intake received
        </p>
        <h2 className="mt-3 text-2xl font-semibold">We have the setup packet.</h2>
        <p className="mt-3 max-w-2xl leading-7 text-slate-600">
          Manager will route this to Profile Manager for Google profile access, Reviews Manager
          for review automation, and GHL Expert for HighLevel setup.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-6 md:p-8" noValidate>
      <div className="grid gap-5 md:grid-cols-2">
        <TextField
          id="businessName"
          label="Business name"
          value={form.businessName}
          onChange={(value) => update("businessName", value)}
          required
        />
        <TextField
          id="contactName"
          label="Your name"
          value={form.contactName}
          onChange={(value) => update("contactName", value)}
          required
        />
        <TextField
          id="email"
          label="Business email"
          type="email"
          value={form.email}
          onChange={(value) => update("email", value)}
          required
        />
        <TextField
          id="phone"
          label="Phone"
          type="tel"
          value={form.phone}
          onChange={(value) => update("phone", value)}
        />
        <TextField
          id="website"
          label="Website"
          type="url"
          value={form.website}
          onChange={(value) => update("website", value)}
          placeholder="https://"
        />
        <TextField
          id="gbpLink"
          label="Google Business Profile link or business search name"
          value={form.gbpLink}
          onChange={(value) => update("gbpLink", value)}
        />
      </div>

      <fieldset className="mt-8">
        <legend className="text-sm font-semibold text-slate-950">Google Business Profile access</legend>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Add <span className="font-mono text-slate-950">{inviteEmail}</span> as Manager. Use Owner only if
          GetMeFound specifically asked for ownership work.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <RadioCard
            name="accessStatus"
            value="added"
            checked={form.accessStatus === "added"}
            label="Access added"
            description="You already sent the invite."
            onChange={() => update("accessStatus", "added")}
          />
          <RadioCard
            name="accessStatus"
            value="need_help"
            checked={form.accessStatus === "need_help"}
            label="Need help"
            description="You want setup help."
            onChange={() => update("accessStatus", "need_help")}
          />
          <RadioCard
            name="accessStatus"
            value="not_sure"
            checked={form.accessStatus === "not_sure"}
            label="Not sure"
            description="We should verify."
            onChange={() => update("accessStatus", "not_sure")}
          />
        </div>
      </fieldset>

      <fieldset className="mt-8">
        <legend className="text-sm font-semibold text-slate-950">Access role selected</legend>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <RadioCard
            name="accessRole"
            value="manager"
            checked={form.accessRole === "manager"}
            label="Manager"
            description="Recommended."
            onChange={() => update("accessRole", "manager")}
          />
          <RadioCard
            name="accessRole"
            value="owner"
            checked={form.accessRole === "owner"}
            label="Owner"
            description="Only if requested."
            onChange={() => update("accessRole", "owner")}
          />
          <RadioCard
            name="accessRole"
            value="not_sure"
            checked={form.accessRole === "not_sure"}
            label="Not sure"
            description="We will check."
            onChange={() => update("accessRole", "not_sure")}
          />
        </div>
      </fieldset>

      <label htmlFor="serviceIntent" className="mt-8 block text-sm font-semibold text-slate-950">
        Main setup requested
      </label>
      <select
        id="serviceIntent"
        value={form.serviceIntent}
        onChange={(event) => update("serviceIntent", event.target.value as ServiceIntent)}
        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
      >
        <option value="review_automation">Stay Found</option>
        <option value="gbp_update">Google profile update</option>
        <option value="ai_visibility">Always Ready</option>
        <option value="not_sure">Not sure</option>
      </select>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <TextField
          id="customerSystem"
          label="Customer system, CRM, or POS"
          value={form.customerSystem}
          onChange={(value) => update("customerSystem", value)}
          placeholder="HighLevel, Square, Jobber, ServiceTitan..."
        />
        <TextArea
          id="notes"
          label="Anything we should know?"
          value={form.notes}
          onChange={(value) => update("notes", value)}
        />
      </div>

      <label className="mt-6 flex gap-3 text-sm leading-6 text-slate-700">
        <input
          type="checkbox"
          checked={form.authorized}
          onChange={(event) => update("authorized", event.target.checked)}
          className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-700"
        />
        <span>I am authorized to request setup for this business.</span>
      </label>

      <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden">
        <label htmlFor="intake-website-trap">Leave blank</label>
        <input id="intake-website-trap" ref={honeypotRef} tabIndex={-1} autoComplete="off" />
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm font-medium text-[var(--color-error)]">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 w-full rounded-lg bg-emerald-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Submitting..." : "Submit setup intake"}
      </button>
    </form>
  );
}

function TextField({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="text-sm font-semibold text-slate-950">
        {label}
        {required ? <span className="text-emerald-700"> *</span> : null}
      </span>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
      />
    </label>
  );
}

function TextArea({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="text-sm font-semibold text-slate-950">{label}</span>
      <textarea
        id={id}
        rows={4}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full resize-none rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
      />
    </label>
  );
}

function RadioCard({
  name,
  value,
  checked,
  label,
  description,
  onChange,
}: {
  name: string;
  value: string;
  checked: boolean;
  label: string;
  description: string;
  onChange: () => void;
}) {
  return (
    <label
      className={`block rounded-lg border p-4 text-sm transition ${
        checked ? "border-emerald-700 bg-emerald-50" : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span className="font-semibold text-slate-950">{label}</span>
      <span className="mt-1 block text-slate-600">{description}</span>
    </label>
  );
}
