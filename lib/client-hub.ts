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

export type ClientMonthlyRecap = {
  label: string;
  requestsSent: number;
  feedbackCaptured: number;
  heldBack: number;
  ownerNote: string;
};

export type ClientVoiceProfile = {
  mode: "Draft only" | "Approval required" | "Safe auto-reply eligible";
  tone: string;
  favoritePhrases: string;
  avoidPhrases: string;
  escalationNotes: string;
};

export type ClientHubPlan =
  | "Get Found"
  | "Stay Found"
  | "Review Power"
  | "AI Ready Bundle"
  | "Client Setup";

export type ClientHubProfile = {
  slug: string;
  businessName: string;
  ownerName: string;
  plan: ClientHubPlan;
  statusLabel: string;
  website: string;
  phone: string;
  email: string;
  googleReviewUrl?: string;
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
  monthlyRecap: ClientMonthlyRecap;
  voiceProfile?: ClientVoiceProfile;
  aiVisibilityPreview: ClientMetric[];
};

export const CLIENT_HUBS: ClientHubProfile[] = [
  {
    slug: "abc-business",
    businessName: "ABC Business",
    ownerName: "Business Owner",
    plan: "Review Power",
    statusLabel: "Setup in progress",
    website: "https://abcbusiness.com",
    phone: "(555) 010-0199",
    email: "owner@abcbusiness.com",
    googleReviewUrl: "",
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
        owner: "GMF",
        status: "done",
        detail: "Name, website, phone, email, category, and service area are on file.",
      },
      {
        label: "Google Business Profile access",
        owner: "Client",
        status: "needed",
        detail: "Client should add GMF as Manager under People and access. No password sharing.",
      },
      {
        label: "Logo and brand",
        owner: "GMF",
        status: "working",
        detail: "GMF checks website favicon, metadata, and public brand assets first. Client can upload a better logo.",
      },
      {
        label: "Google review link",
        owner: "GMF",
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
        owner: "GMF",
        status: "working",
        detail: "Simple email request is drafted in the business voice before first send.",
      },
      {
        label: "Automation setup",
        owner: "GMF",
        status: "working",
        detail: "The review request automation is prepared after contacts and review link are confirmed.",
      },
      {
        label: "Test request",
        owner: "GMF",
        status: "needed",
        detail: "One test review request is sent before the client is marked live.",
      },
      {
        label: "Client live",
        owner: "GMF",
        status: "needed",
        detail: "GMF marks this green after the test request and proof checks pass.",
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
        detail: "GMF sends only setup blockers and final ready summaries.",
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
    monthlyRecap: {
      label: "Last 30 days",
      requestsSent: 0,
      feedbackCaptured: 0,
      heldBack: 0,
      ownerNote: "Monthly recap appears here after the first live send.",
    },
    aiVisibilityPreview: [
      { label: "ChatGPT visibility", value: "Locked", sub: "preview scan available with upgrade" },
      { label: "Review replies", value: "Locked", sub: "AI drafts in client voice" },
      { label: "Local ranking gaps", value: "Locked", sub: "monthly visibility report" },
      { label: "Competitor watch", value: "Locked", sub: "who is gaining attention" },
    ],
  },
  {
    slug: "ai-outsource-hub",
    businessName: "GetMeFound",
    ownerName: "Mike Egidio",
    plan: "Review Power",
    statusLabel: "Setting up",
    website: "https://getmefound.ai",
    phone: "(877) 521-2224",
    email: "mike@getmefound.ai",
    googleReviewUrl: "https://g.page/r/CXoXmnbEDyX7EAE/review",
    location: "United States",
    category: "AI automation and growth services",
    logoText: "GMF",
    brandNote: "GMF logo is already available from the website assets.",
    protection: "Not enabled",
    statusSummary:
      "Review Power is being set up so recent happy customers can be asked for Google reviews.",
    nextClientAction: "Upload recent completed jobs or customers.",
    checklist: [
      {
        label: "Business info confirmed",
        owner: "GMF",
        status: "done",
        detail: "GMF identity, website, phone, and contact are known.",
      },
      {
        label: "Google Business Profile access",
        owner: "GMF",
        status: "done",
        detail: "Google access is confirmed.",
      },
      {
        label: "Logo and brand",
        owner: "GMF",
        status: "done",
        detail: "GMF logo files are in the website assets.",
      },
      {
        label: "Google review link",
        owner: "GMF",
        status: "working",
        detail: "Review link is being captured so requests point to the right place.",
      },
      {
        label: "Recent customer/job list",
        owner: "Client",
        status: "needed",
        detail: "Upload recent completed jobs or customers who should receive review requests.",
      },
      {
        label: "Review request message",
        owner: "GMF",
        status: "working",
        detail: "Review request message is being prepared.",
      },
      {
        label: "Automation setup",
        owner: "GMF",
        status: "working",
        detail: "Review request automation is being prepared.",
      },
      {
        label: "Test request",
        owner: "GMF",
        status: "needed",
        detail: "First review request will be tested before launch.",
      },
      {
        label: "Client live",
        owner: "GMF",
        status: "needed",
        detail: "GMF reports ready after the proof checks pass.",
      },
    ],
    metrics: [
      { label: "Review requests", value: "0", sub: "waiting on customer list" },
      { label: "Google access", value: "Confirmed", sub: "GMF profile" },
      { label: "Automation", value: "Checking", sub: "setup in progress" },
    ],
    uploadRequests: [
      {
        label: "Recent completed jobs or customers",
        status: "needed",
        detail: "Send a spreadsheet, export, invoices, or a clean list from email.",
      },
      {
        label: "Profile screenshots",
        status: "working",
        detail: "Optional if you already know the Google review link.",
      },
      {
        label: "Do-not-contact notes",
        status: "done",
        detail: "No public customer messaging until Mike approves.",
      },
      {
        label: "Best contact for approvals",
        status: "done",
        detail: "Mike receives final GMF summaries.",
      },
    ],
    reviews: {
      status: "Setting up",
      weeklyReviews: 0,
      weeklyGoal: 2,
      requestsSent: 0,
      responseRate: "0%",
      trendLabel: "Behind goal this week",
      lowReviewTips: [
        "Send this week's completed jobs so review requests can go out.",
        "Ask your team to mention the review request before the customer leaves.",
        "Send names of happy customers who are most likely to leave a review.",
      ],
    },
    monthlyRecap: {
      label: "Last 30 days",
      requestsSent: 0,
      feedbackCaptured: 0,
      heldBack: 0,
      ownerNote: "GMF recap appears here after the client-zero send test.",
    },
    aiVisibilityPreview: [
      { label: "ChatGPT visibility", value: "Custom", sub: "GMF internal testing" },
      { label: "Review replies", value: "Locked", sub: "manual approval only" },
      { label: "Local ranking gaps", value: "Pending", sub: "visibility scan next" },
      { label: "Competitor watch", value: "Pending", sub: "Stay Found lane" },
    ],
  },
];

export function getClientHub(slug: string) {
  return CLIENT_HUBS.find((client) => client.slug === slug);
}

export function normalizeClientHubPlan(plan: string | undefined): ClientHubPlan | undefined {
  if (!plan) return undefined;
  if (
    plan === "Get Found" ||
    plan === "Stay Found" ||
    plan === "Review Power" ||
    plan === "AI Ready Bundle" ||
    plan === "Client Setup"
  ) {
    return plan;
  }
  if (plan === "Get Found Refresh") return "Get Found";
  if (plan === "Review Engine" || plan === "Review Voice") return "Review Power";
  if (plan === "Call Protection") return "AI Ready Bundle";
  return undefined;
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
