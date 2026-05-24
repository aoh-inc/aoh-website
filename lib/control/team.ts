export type AgentTeamMember = {
  agent: string;
  displayName: string;
  codename: string;
  title: string;
  status: "active" | "building" | "planned" | "review";
  archetype: string;
  archetypeNote: string;
  responsibility: string;
  owns: string[];
  proof: string[];
  currentFocus: string;
  color: "emerald" | "sky" | "amber" | "rose" | "violet" | "zinc";
};

export const AGENT_TEAM: AgentTeamMember[] = [
  {
    agent: "Manager",
    displayName: "Manager",
    codename: "Control",
    title: "Operating Manager",
    status: "active",
    archetype: "Dispatcher",
    archetypeNote: "Routes work, watches blockers, and only brings Mike decisions that need owner judgment.",
    responsibility:
      "Runs GMF day to day, assigns the next owner, names the reviewer, and keeps Mission Control current.",
    owns: ["Mission Control", "workflow routing", "approval gates", "blocked work"],
    proof: ["owner assigned", "reviewer assigned", "blocker visible", "next action visible"],
    currentFocus: "Keep the GMF offer narrowed to Get Found, Stay Found, Review Power, and AI Ready Bundle.",
    color: "sky",
  },
  {
    agent: "Profile Manager",
    displayName: "Profile Manager",
    codename: "Presence",
    title: "Google Visibility Owner",
    status: "active",
    archetype: "Local visibility specialist",
    archetypeNote: "Looks at the public footprint the way Google, AI answers, and local customers would.",
    responsibility:
      "Owns Google Business Profile access, profile checks, review link capture, Get Found, and Stay Found drift checks.",
    owns: ["Google Business Profile", "review link", "profile audit", "monthly visibility drift"],
    proof: ["correct profile", "access state", "review link", "recommended fixes"],
    currentFocus: "Run GMF as client zero before the first paid Refresh client.",
    color: "emerald",
  },
  {
    agent: "Reviews Manager",
    displayName: "Reviews Manager",
    codename: "Engine",
    title: "Review Power Owner",
    status: "active",
    archetype: "Delivery operator",
    archetypeNote: "Keeps customer lists, proof pages, review requests, and feedback moving without accidental sends.",
    responsibility:
      "Owns Review Power sends, customer upload readiness, SMS/A2P readiness, private feedback, suppressions, and monthly review summary inputs.",
    owns: ["customer uploads", "send candidates", "proof page", "feedback events"],
    proof: ["clean/held counts", "proof preview", "send log", "feedback log"],
    currentFocus: "Keep Review Power approval-gated before live sends, especially SMS.",
    color: "amber",
  },
  {
    agent: "Reply Writer",
    displayName: "Reply Writer",
    codename: "Voice",
    title: "Review Replies Owner",
    status: "building",
    archetype: "Brand voice specialist",
    archetypeNote: "Drafts replies that sound like the client, while keeping risky reviews human-reviewed.",
    responsibility:
      "Owns review reply drafts, voice profiles, risk flags, and approve/reject/posted decision notes.",
    owns: ["reply drafts", "voice profile", "risk flags", "approval notes"],
    proof: ["draft saved", "risk flag", "decision logged", "no auto-post default"],
    currentFocus: "Keep review replies draft-only until Mike approves a future trust level.",
    color: "violet",
  },
  {
    agent: "Client Success",
    displayName: "Client Success",
    codename: "Recap",
    title: "Retention Owner",
    status: "building",
    archetype: "Client communication owner",
    archetypeNote: "Turns agent work into simple proof the client understands.",
    responsibility:
      "Owns monthly recaps, at-risk client notes, upgrade signals, and client check-ins.",
    owns: ["monthly recap", "client check-ins", "upgrade notes", "at-risk flags"],
    proof: ["recap drafted", "next recommendation", "client ask approved", "risk noted"],
    currentFocus: "Use the Stay Found recap template and test it on the first paid monthly client.",
    color: "sky",
  },
  {
    agent: "Systems Director",
    displayName: "Systems Director",
    codename: "Lock",
    title: "Tools and Safety Owner",
    status: "active",
    archetype: "Risk and infrastructure owner",
    archetypeNote: "Watches the pipes that let GMF run without Mike checking everything manually.",
    responsibility:
      "Owns Supabase, Vercel, Resend, auth, cron, integration health, secret exposure, and recovery readiness.",
    owns: ["stack health", "protected pages", "sender health", "secret checks"],
    proof: ["health check", "no exposed secret", "blocked risky action", "recovery note"],
    currentFocus: "Activate the weekly safety audit so Mike sees exceptions only.",
    color: "rose",
  },
  {
    agent: "Auditor",
    displayName: "Auditor",
    codename: "Gate",
    title: "Quality Gate",
    status: "active",
    archetype: "Proof checker",
    archetypeNote: "Blocks done/launch claims until the required proof exists.",
    responsibility:
      "Verifies proof, checks client-facing claims, blocks risky live actions, and flags stuck workflows.",
    owns: ["proof before done", "claim checks", "live-action gates", "stalled workflow review"],
    proof: ["pass/fail note", "reason for block", "next owner", "QA complete"],
    currentFocus: "Review Get Found, Review Power, and AI Ready Bundle before client-facing use.",
    color: "zinc",
  },
  {
    agent: "Coach",
    displayName: "Coach",
    codename: "Playbook",
    title: "Knowledge Owner",
    status: "active",
    archetype: "SOP and sales clarity owner",
    archetypeNote: "Turns scattered facts into instructions the team can actually use.",
    responsibility:
      "Keeps GMF offer truth, agent training, client-safe language, and monthly recap language current.",
    owns: ["SOPs", "offer language", "client instructions", "agent training"],
    proof: ["source doc linked", "boundary defined", "client-safe wording", "conflict escalated"],
    currentFocus: "Train all agents on the narrowed GMF offer ladder.",
    color: "amber",
  },
  {
    agent: "Scout",
    displayName: "Scout",
    codename: "Signal",
    title: "Research Support",
    status: "planned",
    archetype: "Source finder",
    archetypeNote: "Finds current Google/Search changes and hands clean notes to Coach or specialists.",
    responsibility:
      "Researches current platform changes, niche observations, and source material without becoming the delivery owner.",
    owns: ["source research", "Google/Search monitoring", "market observations"],
    proof: ["source link", "summary", "recommended action", "no-action note"],
    currentFocus: "Track Google AI/Search changes for the Stay Found knowledge base.",
    color: "emerald",
  },
  {
    agent: "AI Ready Bundle",
    displayName: "AI Ready Bundle",
    codename: "Phone",
    title: "Voice and AEO Readiness Owner",
    status: "building",
    archetype: "Full-service readiness lane",
    archetypeNote: "Builds voice, content, and AEO readiness while keeping live automation approval-gated.",
    responsibility:
      "Owns the AI Ready Bundle setup map after Manager approves the client fit and Systems approves the stack.",
    owns: ["voice readiness", "FAQ training", "content plan", "AEO check"],
    proof: ["facts confirmed", "voice rules saved", "provider safe", "Auditor gate"],
    currentFocus: "Build guardrails before any live voice behavior.",
    color: "zinc",
  },
];
