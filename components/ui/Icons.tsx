// Lightweight SVG line-icon set — brand consistent, accessible.
// All icons: 24×24 viewBox, stroke-based, aria-hidden by default.

type IconProps = {
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
};

const defaults: IconProps = { "aria-hidden": true };

export function CheckIcon({ className, ...p }: IconProps) {
  return (
    <svg {...defaults} {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function ArrowRightIcon({ className, ...p }: IconProps) {
  return (
    <svg {...defaults} {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export function SearchIcon({ className, ...p }: IconProps) {
  return (
    <svg {...defaults} {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function WrenchIcon({ className, ...p }: IconProps) {
  return (
    <svg {...defaults} {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

export function ChartIcon({ className, ...p }: IconProps) {
  return (
    <svg {...defaults} {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

export function LockIcon({ className, ...p }: IconProps) {
  return (
    <svg {...defaults} {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export function PhoneIcon({ className, ...p }: IconProps) {
  return (
    <svg {...defaults} {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.65 12 19.79 19.79 0 0 1 1.58 3.3A2 2 0 0 1 3.55 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.62a16 16 0 0 0 5.47 5.47l.98-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16a1.97 1.97 0 0 1 1 .92z" />
    </svg>
  );
}

export function StarIcon({ className, ...p }: IconProps) {
  return (
    <svg {...defaults} {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export function ShieldIcon({ className, ...p }: IconProps) {
  return (
    <svg {...defaults} {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

export function DotIcon({ className, ...p }: IconProps) {
  return (
    <svg {...defaults} {...p} viewBox="0 0 6 6" fill="currentColor" className={className}>
      <circle cx="3" cy="3" r="3" />
    </svg>
  );
}
