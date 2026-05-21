export type ClientHubStatus = "done" | "working" | "needed" | "locked";

export type ClientChecklistItem = {
  label: string;
  owner: string;
  status: ClientHubStatus;
  detail: string;
};

export type ClientUploadRequest = {
  label: string;
  status: ClientHubStatus;
  detail: string;
};

export type ClientNextStep = {
  step: string;
  status: ClientHubStatus;
  job: string;
  output: string;
};

export type ClientMetric = {
  label: string;
  value: string;
  sub: string;
};

export type ReviewAutomationStatus = {
  status: string;
  weeklyReviews: number;
  weeklyGoal: number;
  requestsSent: number;
  responseRate: string;
  trendLabel: string;
  lowReviewTips: string[];
};

export type ClientHubProfile = {
  slug: string;
  businessName: string;
  ownerName: string;
  plan: "Review Automation" | "AI Visibility" | "Client Setup";
  statusLabel: string;
  website: string;
  phone: string;
  email: string;
  location: string;
  category: string;
  logoText: string;
  brandNote: string;
  protection: "Not enabled" | "Requested" | "Enabled";
  statusSummary: string;
  nextClientAction: string;
  checklist: ClientChecklistItem[];
  metrics: ClientMetric[];
  uploadRequests: ClientUploadRequest[];
  reviews: ReviewAutomationStatus;
  aiVisibilityPreview: ClientMetric[];
  nextSteps: ClientNextStep[];
};

const sharedNextSteps: ClientNextStep[] = [
  {
    step: "Setup review",
    status: "working",
    job: "AOH reviews the signup and intake details.",
    output: "You get a simple ready, waiting, or needs-help status.",
  },
  {
    step: "Google profile check",
    status: "working",
    job: "AOH checks Google Business Profile access and profile health.",
    output: "We confirm access, profile gaps, and the review link before launch.",
  },
  {
    step: "Review request setup",
    status: "needed",
    job: "AOH prepares who should receive review requests and when.",
    output: "You only need to provide recent completed jobs or customers.",
  },
  {
    step: "Automation build",
    status: "working",
    job: "AOH builds the email review request automation.",
    output: "Nothing sends until the test and launch checks pass.",
  },
  {
    step: "Launch proof",
    status: "needed",
    job: "AOH runs the final proof check.",
    output: "You see proof of the first test before the setup is marked live.",
  },
];

export const CLIENT_HUBS: ClientHubProfile[] = [
  {
    slug: "abc-business",
    businessName: "ABC Business",
    ownerName: "Business Owner",
    plan: "Review Automation",
    statusLabel: "Setup in progress",
    website: "https://abcbusiness.com",
    phone: "(555) 010-0199",
    email: "owner@abcbusiness.com",
    location: "East Coast",
    category: "Local service business",
    logoText: "AB",
    brandNote: "Logo can be auto-checked from the website first. Uploaded brand files always win.",
    protection: "Requested",
    statusSummary:
      "We have enough to start setup. The only client-side item left is confirming Google Business Profile access and uploading the latest customer/job list.",
    nextClientAction: "Confirm GBP access and upload recent completed jobs.",
    checklist: [
      {
        label: "Business info confirmed",
        owner: "AOH",
        status: "done",
        detail: "Name, website, phone, email, category, and service area are on file.",
      },
      {
        label: "Google Business Profile access",
        owner: "Client",
        status: "needed",
        detail: "Client should add AOH as Manager under People and access. No password sharing.",
      },
      {
        label: "Logo and brand",
        owner: "AOH",
        status: "working",
        detail: "AOH checks website favicon, metadata, and public brand assets first. Client can upload a better logo.",
      },
      {
        label: "Google review link",
        owner: "AOH",
        status: "working",
        detail: "Review link is captured after profile access or public profile verification.",
      },
      {
        label: "Recent customer/job list",
        owner: "Client",
        status: "needed",
        detail: "Client uploads completed jobs, invoices, or customers who should receive review requests.",
      },
      {
        label: "Review request message",
        owner: "AOH",
        status: "working",
        detail: "Simple email request is drafted in the business voice before first send.",
      },
      {
        label: "Automation setup",
        owner: "AOH",
        status: "working",
        detail: "The review request automation is prepared after contacts and review link are confirmed.",
      },
      {
        label: "Test request",
        owner: "AOH",
        status: "needed",
        detail: "One test review request is sent before the client is marked live.",
      },
      {
        label: "Client live",
        owner: "AOH",
        status: "needed",
        detail: "AOH marks this green after the test request and proof checks pass.",
      },
    ],
    metrics: [
      { label: "Review requests", value: "0", sub: "waiting on customer list" },
      { label: "Google access", value: "Needs confirm", sub: "client invite step" },
      { label: "Automation", value: "Draft", sub: "not sending yet" },
    ],
    uploadRequests: [
      {
        label: "Recent completed jobs or customers",
        status: "needed",
        detail: "Spreadsheet, export, invoices, or even a clean list from email is fine.",
      },
      {
        label: "Logo or brand files",
        status: "working",
        detail: "Optional if the website has a clear logo. Upload only if the auto-check is wrong.",
      },
      {
        label: "Do-not-contact notes",
        status: "needed",
        detail: "Names, customers, job types, or situations that should never receive a review request.",
      },
      {
        label: "Best contact for approvals",
        status: "done",
        detail: "AOH sends only setup blockers and final ready summaries.",
      },
    ],
    reviews: {
      status: "Setting up",
      weeklyReviews: 0,
      weeklyGoal: 3,
      requestsSent: 0,
      responseRate: "0%",
      trendLabel: "Behind goal this week",
      lowReviewTips: [
        "Upload completed jobs from this week so requests can go out quickly.",
        "Ask your team to mention the review request before the customer leaves.",
        "Send us any happy-customer names you already know should be asked first.",
      ],
    },
    aiVisibilityPreview: [
      { label: "ChatGPT visibility", value: "Locked", sub: "preview scan available with upgrade" },
      { label: "Review replies", value: "Locked", sub: "AI drafts in client voice" },
      { label: "Local ranking gaps", value: "Locked", sub: "monthly visibility report" },
      { label: "Competitor watch", value: "Locked", sub: "who is gaining attention" },
    ],
    nextSteps: sharedNextSteps,
  },
  {
    slug: "ai-outsource-hub",
    businessName: "AI Outsource Hub",
    ownerName: "Mike Egidio",
    plan: "Client Setup",
    statusLabel: "Client-zero test",
    website: "https://aioutsourcehub.com",
    phone: "(877) 521-2224",
    email: "mike@aioutsourcehub.com",
    location: "United States",
    category: "AI automation and growth services",
    logoText: "AOH",
    brandNote: "AOH logo is already available from the website assets.",
    protection: "Not enabled",
    statusSummary:
      "This is the practice client hub for building the client setup process before real client volume arrives.",
    nextClientAction: "Use AOH as the first full test before selling this flow.",
    checklist: [
      {
        label: "Business info confirmed",
        owner: "AOH",
        status: "done",
        detail: "AOH identity, website, phone, and contact are known.",
      },
      {
        label: "Google Business Profile access",
        owner: "AOH",
        status: "done",
        detail: "Client-zero access is already confirmed.",
      },
      {
        label: "Logo and brand",
        owner: "AOH",
        status: "done",
        detail: "AOH logo files are in the website assets.",
      },
      {
        label: "Google review link",
        owner: "AOH",
        status: "working",
        detail: "Capture and store the review link for the AOH practice run.",
      },
      {
        label: "Recent customer/job list",
        owner: "Client",
        status: "needed",
        detail: "Use a safe test list first. Do not message real customers until approved.",
      },
      {
        label: "Review request message",
        owner: "AOH",
        status: "working",
        detail: "Draft the starter message for Mike's approval.",
      },
      {
        label: "Automation setup",
        owner: "AOH",
        status: "working",
        detail: "Check sender, automation, logs, and AI features stay off unless approved.",
      },
      {
        label: "Test request",
        owner: "AOH",
        status: "needed",
        detail: "Send one safe test request before live launch.",
      },
      {
        label: "Client live",
        owner: "AOH",
        status: "needed",
        detail: "AOH reports ready after the proof checks pass.",
      },
    ],
    metrics: [
      { label: "Review requests", value: "Test only", sub: "no real sends yet" },
      { label: "Google access", value: "Confirmed", sub: "AOH profile" },
      { label: "Automation", value: "Checking", sub: "AOH checking" },
    ],
    uploadRequests: [
      {
        label: "Safe test contact list",
        status: "needed",
        detail: "Use internal test contacts before real AOH customers.",
      },
      {
        label: "Profile screenshots",
        status: "working",
        detail: "Access proof, edit area proof, and draft-before-publish proof.",
      },
      {
        label: "Do-not-contact notes",
        status: "done",
        detail: "No public customer messaging until Mike approves.",
      },
      {
        label: "Best contact for approvals",
        status: "done",
        detail: "Mike receives final AOH summaries.",
      },
    ],
    reviews: {
      status: "Client-zero test",
      weeklyReviews: 0,
      weeklyGoal: 2,
      requestsSent: 0,
      responseRate: "0%",
      trendLabel: "Testing before live customer sends",
      lowReviewTips: [
        "Use a safe test contact list before real AOH customers.",
        "Capture the Google review link so the test request points to the right place.",
        "Approve the first safe test before turning this into the client template.",
      ],
    },
    aiVisibilityPreview: [
      { label: "ChatGPT visibility", value: "Custom", sub: "AOH internal testing" },
      { label: "Review replies", value: "Locked", sub: "manual approval only" },
      { label: "Local ranking gaps", value: "Pending", sub: "profile scan next" },
      { label: "Competitor watch", value: "Pending", sub: "AI Visibility lane" },
    ],
    nextSteps: sharedNextSteps,
  },
];

export function getClientHub(slug: string) {
  return CLIENT_HUBS.find((client) => client.slug === slug);
}

export function statusLabel(status: ClientHubStatus) {
  if (status === "done") return "Done";
  if (status === "working") return "Working";
  if (status === "needed") return "Needed";
  return "Locked";
}

export function statusClasses(status: ClientHubStatus) {
  if (status === "done") return "border-emerald-200 bg-emerald-50 text-emerald-800";
  if (status === "working") return "border-sky-200 bg-sky-50 text-sky-800";
  if (status === "needed") return "border-amber-200 bg-amber-50 text-amber-900";
  return "border-slate-200 bg-slate-100 text-slate-600";
}
