export const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "tempmail.com",
  "throwaway.email",
  "yopmail.com",
  "sharklasers.com",
]);

export const BLOCKED_PREFIXES = ["test@", "fake@", "spam@"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

export type ValidationResult =
  | { ok: true }
  | { ok: false; error: string };

export function validateEmail(raw: unknown): ValidationResult {
  if (typeof raw !== "string") return { ok: false, error: "Enter a valid email." };
  const email = raw.trim().toLowerCase();
  if (email.length < 6) return { ok: false, error: "Email is too short." };
  if (/\s/.test(email)) return { ok: false, error: "Email cannot contain spaces." };
  if (!EMAIL_RE.test(email)) return { ok: false, error: "Enter a valid email." };

  for (const prefix of BLOCKED_PREFIXES) {
    if (email.startsWith(prefix)) {
      return { ok: false, error: "Use your real business email." };
    }
  }

  const domain = email.split("@")[1];
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return { ok: false, error: "Use your real business email." };
  }

  return { ok: true };
}
