"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type CaseProfile = {
  id: string;
  label: string;
  cancerType: string;
  stage: string;
  biomarkers: string;
  pathology: string;
  imaging: string;
  treatments: string;
  location: string;
  notes: string;
  pastedReport: string;
};

type MissionStep = {
  title: string;
  detail: string;
  status: "ready" | "needs-info" | "next";
};

type ChatMessage = {
  id: string;
  role: "cbc" | "user";
  text: string;
};

type ExtractionResult = {
  filesRead: number;
  pdfsRead: number;
  imagesRead: number;
  casePatch: Partial<CaseProfile>;
};

type DoctorQuestion = {
  question: string;
  likelyResponse: string;
  followUps: string[];
};

type WorkbenchView = "overview" | "case" | "reports" | "doctor" | "packet";

const STORAGE_KEY = "cbc_cases_v1";

const EMPTY_CASE: CaseProfile = {
  id: "case-1",
  label: "My brother",
  cancerType: "",
  stage: "",
  biomarkers: "",
  pathology: "",
  imaging: "",
  treatments: "",
  location: "",
  notes: "",
  pastedReport: "",
};

const BROTHER_PRIOR_HISTORY = {
  cancerType:
    "Prior lymphoma history: diffuse large B-cell lymphoma (DLBCL) in 2019, gastric MALT lymphoma in 2023; current concern noted as FDG-avid thoracic adenopathy / possible recurrence pending biopsy.",
  treatments:
    "2019: DLBCL treated with splenectomy and four rounds of R-CHOP / Rituximab-CHOP, reported successful. 2023: MALT lymphoma in the stomach treated with 19 days of targeted radiation, reported successful.",
  notes:
    "Prior cancer history extracted from shared chat screenshots:\n\n2019: Had DLBCL. After splenectomy, four rounds of R-CHOP were successful.\n\n2023: Had MALT lymphoma in the stomach. Completed 19 days of targeted radiation, which was successful. Oncologist reportedly said it was a different type of lymphoma.\n\nShared-chat context also mentioned PET findings described as FDG-avid thoracic adenopathy and concern for possible recurrence, with biopsy still essential before concluding recurrence.",
};

const BROTHER_CASE: CaseProfile = {
  ...EMPTY_CASE,
  ...BROTHER_PRIOR_HISTORY,
};

const BIOMARKER_PATTERNS = [
  "EGFR",
  "ALK",
  "ROS1",
  "BRAF",
  "KRAS",
  "NRAS",
  "HER2",
  "ERBB2",
  "BRCA1",
  "BRCA2",
  "MSI",
  "MMR",
  "PD-L1",
  "PDL1",
  "NTRK",
  "RET",
  "MET",
  "PIK3CA",
  "IDH1",
  "IDH2",
  "FLT3",
  "TP53",
];

export function CancerResearchWorkbench({
  view = "overview",
  basePath = "/mike-mc/cancer-research",
}: {
  view?: WorkbenchView;
  basePath?: string;
}) {
  const [cases, setCases] = useState<CaseProfile[]>([BROTHER_CASE]);
  const [activeId, setActiveId] = useState("case-1");
  const [loaded, setLoaded] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [shareStatus, setShareStatus] = useState("");
  const [caseStatus, setCaseStatus] = useState("");
  const [selectedMissionIndex, setSelectedMissionIndex] = useState(0);
  const [selectedResearchIndex, setSelectedResearchIndex] = useState(0);
  const [extractionStatus, setExtractionStatus] = useState("CBC is checking uploaded files for Mark's case details...");
  const autoExtractionStarted = useRef(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "cbc-welcome",
      role: "cbc",
      text: "I'm CBC. Tell me what you want to understand first: the diagnosis, the report, possible treatment paths, trials, or what to ask the oncologist.",
    },
  ]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as CaseProfile[];
        if (Array.isArray(saved) && saved.length > 0) {
          const markCase = saved.find((item) => item.id === "case-1") ?? saved[0];
          setCases([{ ...BROTHER_CASE, ...markCase, id: "case-1", label: markCase.label || "Mark" }]);
          setActiveId("case-1");
        }
      }
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
  }, [cases, loaded]);

  useEffect(() => {
    if (!loaded || autoExtractionStarted.current) return;
    autoExtractionStarted.current = true;
    void extractUploadedRecords(false);
    // CBC should run the uploaded-record reader once after local case data loads.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  const activeCase = cases.find((item) => item.id === activeId) ?? cases[0];
  const allText = Object.values(activeCase).join(" ");
  const detectedMarkers = useMemo(() => detectBiomarkers(allText), [allText]);
  const missing = requiredGaps(activeCase);
  const query = buildQuery(activeCase, detectedMarkers);
  const mission = buildMission(activeCase, detectedMarkers);
  const readyCount = mission.filter((step) => step.status === "ready").length;
  const selectedMission = mission[selectedMissionIndex] ?? mission[0];
  const sourceLinks = buildSourceLinks(activeCase, query);
  const selectedResearch = sourceLinks[selectedResearchIndex] ?? sourceLinks[0];
  const doctorQuestions = buildOncologistQuestions(activeCase, detectedMarkers);
  const reportSummary = summarizeReport(activeCase.pastedReport, detectedMarkers);
  const sharePack = buildSharePack({ profile: activeCase, detectedMarkers, missing, doctorQuestions, query });
  const showChat = view === "overview";
  const showCase = view === "case";
  const showReports = view === "reports";
  const showInsights = view === "overview";
  const showDoctor = view === "doctor";
  const showPacket = view === "packet";

  function updateActive(patch: Partial<CaseProfile>) {
    setCases((current) => current.map((item) => (item.id === activeCase.id ? { ...item, ...patch } : item)));
  }

  function mergeExtractedCase(patch: Partial<CaseProfile>, overwrite: boolean) {
    setCases((current) =>
      current.map((item) => {
        if (item.id !== activeCase.id) return item;
        const next = { ...item };
        for (const key of Object.keys(patch) as Array<keyof CaseProfile>) {
          const incoming = patch[key];
          if (typeof incoming !== "string") continue;
          const currentValue = String(next[key] ?? "").trim();
          const shouldFill =
            overwrite ||
            !currentValue ||
            currentValue === String(BROTHER_CASE[key] ?? "").trim() ||
            currentValue === String(EMPTY_CASE[key] ?? "").trim();
          if (shouldFill) {
            next[key] = incoming as never;
          }
        }
        return next;
      }),
    );
  }

  async function extractUploadedRecords(force: boolean) {
    setExtractionStatus(force ? "CBC is re-reading the uploaded files..." : "CBC is checking uploaded files for Mark's case details...");
    try {
      const response = await fetch("/api/cbc/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ force }),
      });
      if (!response.ok) throw new Error("Could not extract uploaded records.");
      const result = (await response.json()) as ExtractionResult;
      mergeExtractedCase(result.casePatch, force);
      setExtractionStatus(
        `CBC read ${result.filesRead} uploaded files (${result.pdfsRead} PDFs, ${result.imagesRead} images) and filled Mark's case. Review/edit, then save.`,
      );
    } catch (error) {
      setExtractionStatus(error instanceof Error ? error.message : "CBC could not extract the uploaded files.");
    }
  }

  function applyReportToNotes() {
    if (!activeCase.pastedReport.trim()) return;
    const update: Partial<CaseProfile> = {};
    if (!activeCase.pathology.trim()) update.pathology = activeCase.pastedReport.slice(0, 1600);
    else update.notes = [activeCase.notes, activeCase.pastedReport].filter(Boolean).join("\n\n");
    updateActive(update);
    setMessages((current) => [
      ...current,
      {
        id: `cbc-report-${current.length}`,
        role: "cbc",
        text: `I submitted this report into the active case. I'll use it when explaining the Battle Map, missing items, trial-search terms, and oncologist questions. Report length: ${activeCase.pastedReport.length.toLocaleString()} characters.`,
      },
    ]);
  }

  function updateBattleMapChat() {
    const summary = [
      activeCase.cancerType ? `Cancer/history: ${activeCase.cancerType}` : "Cancer/history: not entered yet",
      activeCase.stage ? `Stage/grade: ${activeCase.stage}` : "Stage/grade: not entered yet",
      detectedMarkers.length ? `Markers detected: ${detectedMarkers.join(", ")}` : "Markers detected: none yet",
      activeCase.treatments ? "Treatment history is entered." : "Treatment history still needs details.",
      missing.length ? `Missing next: ${missing.join(", ")}` : "Core fields are filled.",
    ].join("\n");

    setMessages((current) => [
      ...current,
      {
        id: `cbc-map-${current.length}`,
        role: "cbc",
        text: `I updated the CBC Battle Map from what you entered. ${summary}`,
      },
    ]);
  }

  function saveCaseChanges() {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
    setCaseStatus("Saved. CBC will use this edited case in chat, questions, and the share packet.");
    updateBattleMapChat();
  }

  async function copySharePack() {
    await navigator.clipboard.writeText(sharePack);
    setShareStatus("Copied CBC share pack.");
  }

  function downloadSharePack() {
    const blob = new Blob([sharePack], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cbc-share-pack.txt";
    link.click();
    URL.revokeObjectURL(url);
    setShareStatus("Downloaded CBC share pack.");
  }

  function printSharePack() {
    window.print();
    setShareStatus("Opened print dialog.");
  }

  async function sendChat(raw: string) {
    const text = raw.trim();
    if (!text) return;

    const userId = `user-${Date.now()}`;
    const pendingId = `cbc-${Date.now()}`;
    const fallbackReply = generateCbcReply({
      question: text,
      profile: activeCase,
      missing,
      detectedMarkers,
      doctorQuestions,
      query,
    });

    setMessages((current) => [
      ...current,
      { id: userId, role: "user", text },
      {
        id: pendingId,
        role: "cbc",
        text: "Reading Mark's case fields and uploaded-file excerpts...",
      },
    ]);
    setChatInput("");

    try {
      const response = await fetch("/api/cbc/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text, profile: activeCase }),
      });
      const body = (await response.json().catch(() => null)) as { answer?: string; error?: string } | null;
      if (!response.ok || !body?.answer) throw new Error(body?.error ?? "CBC AI could not answer.");

      setMessages((current) =>
        current.map((message) => (message.id === pendingId ? { ...message, text: body.answer ?? fallbackReply } : message)),
      );
    } catch {
      setMessages((current) =>
        current.map((message) =>
          message.id === pendingId
            ? {
                ...message,
                text: `${fallbackReply}\n\nCBC could not reach the live AI answer route, so this answer used the local case helper.`,
              }
            : message,
        ),
      );
    }
  }

  function openSelectedResearch() {
    if (!selectedResearch) return;
    window.open(selectedResearch.href, "_blank", "noopener,noreferrer");
  }

  if (view === "overview") {
    return (
      <MarkHomeExperience
        activeCase={activeCase}
        readyCount={readyCount}
        detectedMarkers={detectedMarkers}
        missing={missing}
        mission={mission}
        selectedMissionIndex={selectedMissionIndex}
        selectedMission={selectedMission}
        onSelectMission={setSelectedMissionIndex}
        onMissionAsk={() => sendChat(`Help me with this battle map step: ${selectedMission.title}`)}
        basePath={basePath}
        links={sourceLinks}
        selectedResearchIndex={selectedResearchIndex}
        onSelectResearch={setSelectedResearchIndex}
        onOpenResearch={openSelectedResearch}
        messages={messages}
        chatInput={chatInput}
        onChatInputChange={setChatInput}
        onSendChat={sendChat}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 xl:grid-cols-[21rem_minmax(0,1fr)]">
        <aside className="space-y-4">
          <section className="rounded-xl border border-rose-100 bg-white/90 p-4 shadow-md shadow-rose-100/40">
            <h2 className="text-base font-black text-slate-950">Mark&apos;s case</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              {activeCase.cancerType || "CBC is loading Mark's uploaded records."}
            </p>
          </section>

          <MissionControlPanel
            mission={mission}
            readyCount={readyCount}
            selectedIndex={selectedMissionIndex}
            selectedMission={selectedMission}
            onSelect={setSelectedMissionIndex}
            onAsk={() => sendChat(`Help me with this battle map step: ${selectedMission.title}`)}
          />

          <ResearchLauncherControl
            links={sourceLinks}
            selectedIndex={selectedResearchIndex}
            onSelect={setSelectedResearchIndex}
            onOpen={openSelectedResearch}
          />
        </aside>

        <main className="space-y-6">
          {showChat && (
            <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <EncouragementPanel />
              <TodaysFocusPanel selectedMission={selectedMission} onAsk={() => sendChat(`Help me with this next move: ${selectedMission.title}`)} />
            </section>
          )}

          {showChat && <section id="chat" className="rounded-xl border border-teal-100 bg-gradient-to-br from-white via-teal-50/70 to-cyan-50 p-5 shadow-lg shadow-cyan-100/50 md:p-6">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">CBC chat</p>
                  <AiLevelBadge level="Deep reasoning" detail="GPT-5.1 Thinking/high for recommendations when connected" />
                </div>
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">Ask CBC where to start</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  This local chat reads the active case fields and helps organize next steps. It does not send data anywhere yet.
                </p>
              </div>
              <div className="rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm leading-6 text-rose-950">
                Best first ask: &quot;What are we missing?&quot; or &quot;What should we ask the oncologist?&quot;
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-white/80 bg-white/80 p-3 shadow-inner">
              <div className="max-h-[28rem] space-y-3 overflow-y-auto p-1">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[82%] rounded-2xl px-4 py-3 text-base leading-8 shadow-sm ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-teal-700 to-cyan-700 text-white"
                          : "border border-amber-100 bg-amber-50 text-slate-800"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  "What are we missing?",
                  "Explain the battle map",
                  "What should we ask the oncologist?",
                  "How do we search trials?",
                ].map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => sendChat(prompt)}
                    className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-sm font-bold text-rose-900 transition hover:bg-rose-100"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <form
                className="mt-3 flex gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  sendChat(chatInput);
                }}
              >
                <input
                  value={chatInput}
                  onChange={(event) => setChatInput(event.target.value)}
                  placeholder="Ask CBC about this case..."
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-950 outline-none placeholder:text-slate-500 focus:border-teal-500"
                />
              <button
                type="submit"
                  style={{ backgroundColor: "#0b2a6f", borderColor: "#061a45" }}
                  className="rounded-xl border px-5 py-3 text-sm font-bold text-white shadow-xl shadow-blue-300/70 transition hover:brightness-110"
                >
                  Send
                </button>
              </form>
            </div>
          </section>}

          {showCase && <section id="case" className="rounded-[1.35rem] border border-orange-200/70 bg-gradient-to-br from-orange-50 via-white to-cyan-50 p-5 shadow-xl shadow-orange-100/50 md:p-6">
            <div className="flex flex-col gap-2 border-b border-slate-100 pb-5 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-rose-600">Step 1</p>
                  <AiLevelBadge level="Utility" detail="Local form data, no paid model needed" tone="utility" />
                </div>
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">Tell CBC what we know</h2>
              </div>
              <p className="max-w-xl rounded-full bg-white/70 px-4 py-2 text-sm leading-6 text-slate-700 shadow-sm">
                CBC can pull from uploaded files first. Then you or Mark can edit this whole section and save it.
              </p>
            </div>

            <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50/80 p-4 shadow-sm">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-black text-blue-950">Uploaded-record reader</p>
                  <p className="mt-1 text-sm leading-6 text-blue-900">{extractionStatus}</p>
                </div>
                <button
                  type="button"
                  onClick={() => void extractUploadedRecords(true)}
                  className="rounded-xl border border-blue-950 bg-blue-900 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-800"
                >
                  Re-read uploaded files
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Field label="Case label" value={activeCase.label} onChange={(label) => updateActive({ label })} />
              <Field label="Cancer type" value={activeCase.cancerType} onChange={(cancerType) => updateActive({ cancerType })} placeholder="Example: metastatic colorectal cancer" />
              <Field label="Stage / grade" value={activeCase.stage} onChange={(stage) => updateActive({ stage })} placeholder="Example: stage IV, grade 3" />
              <Field label="Location for trials" value={activeCase.location} onChange={(location) => updateActive({ location })} placeholder="City/state or travel radius" />
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <TextArea label="Biomarkers / genetics" value={activeCase.biomarkers} onChange={(biomarkers) => updateActive({ biomarkers })} placeholder="KRAS, EGFR, HER2, MSI/MMR, PD-L1, BRCA, NGS results..." />
              <TextArea label="Pathology summary" value={activeCase.pathology} onChange={(pathology) => updateActive({ pathology })} placeholder="Paste diagnosis/impression from pathology." />
              <TextArea label="Imaging findings" value={activeCase.imaging} onChange={(imaging) => updateActive({ imaging })} placeholder="Paste CT/MRI/PET impression." />
              <TextArea label="Treatments tried or planned" value={activeCase.treatments} onChange={(treatments) => updateActive({ treatments })} placeholder="Surgery, chemo, radiation, immunotherapy, targeted therapy..." />
            </div>
            <div className="mt-5 flex flex-col gap-3 rounded-xl border border-teal-200 bg-gradient-to-r from-teal-50 via-cyan-50 to-rose-50 p-4 md:flex-row md:items-center md:justify-between">
              <p className="text-sm leading-6 text-slate-800">
                Edit anything above, then save the whole section. CBC will use the saved case in chat, doctor questions, and the share packet.
              </p>
              <button
                type="button"
                onClick={saveCaseChanges}
                style={{ backgroundColor: "#0b2a6f", borderColor: "#061a45" }}
                className="rounded-xl border px-5 py-3 text-sm font-bold text-white shadow-xl shadow-blue-300/70 transition hover:brightness-110"
              >
                Save case section
              </button>
            </div>
            {caseStatus && <p className="mt-3 rounded-xl bg-white/80 px-4 py-3 text-sm font-bold text-blue-900">{caseStatus}</p>}
          </section>}

          {showReports && <section id="reports" className="rounded-xl border border-rose-100 bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 p-5 shadow-lg shadow-rose-100/40 md:p-6">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_21rem]">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-800">Step 2</p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">Paste a report for CBC to translate</h2>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Paste a pathology, scan, or lab report. This version highlights likely markers and important sections; the next version can add a real AI summary button.
                </p>
                <textarea
                  value={activeCase.pastedReport}
                  onChange={(event) => updateActive({ pastedReport: event.target.value })}
                  placeholder="Paste report text here after removing personal identifiers..."
                  className="mt-4 min-h-44 w-full resize-y rounded-xl border border-teal-200 bg-white px-4 py-3 text-sm leading-7 text-slate-900 outline-none placeholder:text-slate-400 focus:border-teal-500"
                />
                <button
                  type="button"
                  onClick={applyReportToNotes}
                  style={{ backgroundColor: "#0b2a6f", borderColor: "#061a45" }}
                  className="mt-3 rounded-xl border px-5 py-3 text-sm font-bold text-white shadow-xl shadow-blue-300/70 transition hover:brightness-110"
                >
                  Submit report to CBC
                </button>
              </div>
              <div className="rounded-xl border border-white/80 bg-white/90 p-4">
                <h3 className="text-sm font-bold text-slate-950">CBC quick read</h3>
                <div className="mt-3 space-y-3">
                  {reportSummary.map((item) => (
                    <div key={item.title} className="rounded-lg border border-orange-100 bg-orange-50/70 p-3">
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-800">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>}

          {showInsights && <details className="rounded-xl border border-white/80 bg-white/90 p-5 shadow-lg shadow-rose-100/30">
            <summary className="cursor-pointer text-base font-black text-slate-950">
              Case signals CBC is using
            </summary>
            <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr_1.4fr]">
              <div>
                <h3 className="text-sm font-black uppercase tracking-[0.12em] text-slate-500">Detected biomarkers</h3>
                {detectedMarkers.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {detectedMarkers.map((marker) => (
                      <span key={marker} className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm font-black text-teal-900">{marker}</span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-base leading-7 text-slate-700">No common biomarkers detected yet.</p>
                )}
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-[0.12em] text-slate-500">Missing essentials</h3>
                {missing.length > 0 ? (
                  <ul className="mt-2 space-y-2 text-base leading-7 text-slate-800">
                    {missing.map((field) => <li key={field}>{field}</li>)}
                  </ul>
                ) : (
                  <p className="mt-2 text-base font-bold leading-7 text-teal-900">Core fields are filled. CBC can research more precisely now.</p>
                )}
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-[0.12em] text-slate-500">Search phrase</h3>
                <p className="mt-2 max-h-36 overflow-auto break-words rounded-lg bg-slate-50 p-3 font-mono text-sm leading-7 text-slate-800">
                  {query || "Add cancer type and findings to build a research search."}
                </p>
              </div>
            </div>
          </details>}

          {showDoctor && <section id="doctor-questions" className="rounded-xl border border-amber-100 bg-white/90 p-5 shadow-lg shadow-amber-100/40 md:p-6">
            <div className="mb-4">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Doctor visit mode</p>
                <AiLevelBadge level="Highest advice tier" detail="GPT-5.1 Thinking/high when connected" />
              </div>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">Questions CBC would bring to the oncologist</h2>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {doctorQuestions.map((item) => (
                <div key={item.question} className="rounded-xl border border-amber-100 bg-amber-50/70 p-4 text-sm leading-7 text-slate-800">
                  <p className="font-black text-slate-950">{item.question}</p>
                  <p className="mt-3 rounded-lg bg-white/70 p-3 text-slate-700">
                    <span className="font-bold text-amber-900">Likely response: </span>
                    {item.likelyResponse}
                  </p>
                  <div className="mt-3 space-y-2">
                    {item.followUps.map((followUp) => (
                      <p key={followUp} className="rounded-lg border border-white/70 bg-white/80 p-3">
                        <span className="font-bold text-blue-900">Follow-up: </span>
                        {followUp}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>}

          {showPacket && <section className="rounded-xl border border-cyan-100 bg-white/90 p-5 shadow-lg shadow-cyan-100/40 md:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Second opinion prep</p>
              <AiLevelBadge level="Share output" detail="Copy, download, or print" tone="utility" />
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">CBC packet outline</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {[
                ["Diagnosis", activeCase.cancerType || "Not entered yet"],
                ["Stage / grade", activeCase.stage || "Not entered yet"],
                ["Markers", detectedMarkers.length ? detectedMarkers.join(", ") : "Not found yet"],
                ["Treatment history", activeCase.treatments || "Not entered yet"],
                ["Location / travel", activeCase.location || "Not entered yet"],
                ["Next action", missing.length ? `Fill in: ${missing.join(", ")}` : "Open trial and guideline searches"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-cyan-100 bg-cyan-50/70 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{label}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-800">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-blue-100 bg-gradient-to-r from-cyan-50 via-white to-rose-50 p-4">
              <h3 className="text-sm font-black text-slate-950">Share CBC output</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Use this for your brother, a family text, or a second-opinion prep note. It changes as the case data changes.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <ActionButton onClick={copySharePack}>Copy summary</ActionButton>
                <ActionButton onClick={downloadSharePack}>Download .txt</ActionButton>
                <ActionButton onClick={printSharePack}>Print / Save PDF</ActionButton>
              </div>
              {shareStatus && <p className="mt-3 text-sm font-bold text-blue-900">{shareStatus}</p>}
              <pre className="mt-4 max-h-64 overflow-auto whitespace-pre-wrap rounded-xl border border-white/80 bg-white/85 p-4 text-xs leading-6 text-slate-700">
                {sharePack}
              </pre>
            </div>
          </section>}
        </main>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block rounded-xl border border-white/70 bg-white/70 p-3 shadow-sm">
      <span className="text-sm font-black uppercase tracking-[0.14em] text-slate-600">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-orange-100 bg-white px-4 py-3 text-base leading-7 text-slate-950 outline-none transition placeholder:text-slate-500 focus:border-rose-400"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block rounded-xl border border-white/70 bg-white/70 p-3 shadow-sm">
      <span className="text-sm font-black uppercase tracking-[0.14em] text-slate-600">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 min-h-32 w-full resize-y rounded-xl border border-orange-100 bg-white px-4 py-3 text-base leading-8 text-slate-950 outline-none transition placeholder:text-slate-500 focus:border-rose-400"
      />
    </label>
  );
}

function MarkHomeExperience({
  activeCase,
  readyCount,
  detectedMarkers,
  missing,
  mission,
  selectedMissionIndex,
  selectedMission,
  onSelectMission,
  onMissionAsk,
  basePath,
  links,
  selectedResearchIndex,
  onSelectResearch,
  onOpenResearch,
  messages,
  chatInput,
  onChatInputChange,
  onSendChat,
}: {
  activeCase: CaseProfile;
  readyCount: number;
  detectedMarkers: string[];
  missing: string[];
  mission: MissionStep[];
  selectedMissionIndex: number;
  selectedMission: MissionStep;
  onSelectMission: (index: number) => void;
  onMissionAsk: () => void;
  basePath: string;
  links: Array<{ name: string; detail: string; href: string }>;
  selectedResearchIndex: number;
  onSelectResearch: (index: number) => void;
  onOpenResearch: () => void;
  messages: ChatMessage[];
  chatInput: string;
  onChatInputChange: (value: string) => void;
  onSendChat: (value: string) => void;
}) {
  return (
    <div className="space-y-6">
      <section className="cbc-hero overflow-hidden rounded-3xl text-white shadow-2xl shadow-blue-200/60">
        <div className="grid min-w-0 gap-0 xl:grid-cols-5">
          <div className="min-w-0 p-6 md:p-8 xl:col-span-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/25 bg-white/12 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-cyan-50">
                Private command center
              </span>
              <span className="rounded-full border border-white/25 bg-white/12 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-cyan-50">
                19 records loaded
              </span>
            </div>
            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
              Walk into the next oncology visit prepared.
            </h1>
            <p className="mt-4 max-w-xs text-lg font-semibold leading-8 text-cyan-50 sm:max-w-3xl">
              CBC turns uploads, PET findings, prior lymphoma history, labs, and notes into one focused plan: what is known, what is encouraging, what must be proven, and what to ask next.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <HeroMetric label="Case mapped" value={`${readyCount}/4`} />
              <HeroMetric label="Signals found" value={detectedMarkers.length.toString()} />
              <HeroMetric label="Missing" value={missing.length.toString()} />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onSendChat("What should we focus on next?")}
                className="rounded-xl border border-white bg-white px-5 py-3 text-sm font-black text-blue-950 shadow-lg shadow-blue-950/20 transition hover:bg-cyan-50"
              >
                Ask CBC what matters next
              </button>
              <a
                href={`${basePath}/doctor-questions`}
                className="rounded-xl border border-white/30 bg-white/12 px-5 py-3 text-sm font-black text-white transition hover:bg-white/18"
              >
                Prepare doctor questions
              </a>
            </div>
          </div>
          <div className="relative min-w-0 overflow-hidden border-t border-white/20 p-6 xl:col-span-2 xl:border-l xl:border-t-0">
            <HomeBodyLocator />
            <div className="mt-4 rounded-2xl border border-white/70 bg-white p-4 text-slate-950 shadow-2xl shadow-blue-950/20">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-900">Current clinical question</p>
              <p className="mt-2 text-base font-black leading-7">
                Are the 2026 FDG-avid thoracic and abdominopelvic nodes lymphoma recurrence, a new lymphoma process, or something else?
              </p>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
                CBC keeps biopsy/pathology as the proof point, not a guess.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="rounded-[1.5rem] border border-white/70 bg-white/88 p-5 shadow-xl shadow-cyan-100/50">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-900">Case timeline</p>
              <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-950">The story so far</h2>
            </div>
            <a href={`${basePath}/body-map`} className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-black text-blue-950 transition hover:bg-blue-100">
              Open body map
            </a>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {[
              ["2019", "DLBCL", "Splenectomy plus four rounds of R-CHOP were reported successful.", "A past fight with a successful response."],
              ["2023", "Gastric MALT lymphoma", "Targeted stomach radiation was reported successful.", "A second lymphoma history, described as different."],
              ["2026", "PET/CT concern", "FDG-avid nodes were found in thoracic and abdominopelvic regions.", "This is the current question, pending biopsy."],
            ].map(([year, title, detail, meaning], index) => (
              <div key={year} className="relative border-t-4 border-blue-900 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4 shadow-sm">
                <span className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-blue-900 text-sm font-black text-white">{index + 1}</span>
                <p className="text-sm font-black uppercase tracking-[0.16em] text-blue-900">{year}</p>
                <h3 className="mt-2 pr-10 text-xl font-black text-slate-950">{title}</h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">{detail}</p>
                <p className="mt-3 rounded-xl bg-white p-3 text-sm font-bold leading-6 text-teal-900 shadow-sm">{meaning}</p>
              </div>
            ))}
          </div>
        </div>
        <TodaysFocusPanel selectedMission={selectedMission} onAsk={onMissionAsk} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[24rem_minmax(0,1fr)]">
        <MissionControlPanel
          mission={mission}
          readyCount={readyCount}
          selectedIndex={selectedMissionIndex}
          selectedMission={selectedMission}
          basePath={basePath}
          onSelect={onSelectMission}
          onAsk={onMissionAsk}
        />
        <div className="grid gap-4 lg:grid-cols-2">
          <EncouragementPanel />
          <UncertaintyPanel activeCase={activeCase} />
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <ChatDeck messages={messages} chatInput={chatInput} onChatInputChange={onChatInputChange} onSendChat={onSendChat} />
        <div className="space-y-4">
          <ResearchLauncherControl
            links={links}
            selectedIndex={selectedResearchIndex}
            onSelect={onSelectResearch}
            onOpen={onOpenResearch}
          />
          <section className="rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 via-white to-amber-50 p-5 shadow-lg shadow-rose-100/40">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-rose-800">Companion note</p>
            <p className="mt-2 text-base font-bold leading-7 text-slate-800">
              CBC should make the next visit feel less foggy: organized facts, sharper questions, and no false certainty.
            </p>
          </section>
        </div>
      </section>
    </div>
  );
}

function HeroMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="cbc-hero-soft rounded-2xl border p-4 shadow-inner">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-cyan-100">{label}</p>
      <p className="mt-1 text-3xl font-black text-white">{value}</p>
    </div>
  );
}

function HomeBodyLocator() {
  return (
    <div className="relative mx-auto max-w-sm" style={{ height: "26rem" }}>
      <div className="absolute left-1/2 top-8 h-20 w-20 -translate-x-1/2 rounded-full bg-white/75 shadow-xl" />
      <div className="absolute left-1/2 top-28 h-40 w-32 -translate-x-1/2 rounded-full bg-white/70 shadow-xl" />
      <div className="absolute left-1/2 top-56 h-28 w-24 -translate-x-1/2 rounded-full bg-white/70 shadow-xl" />
      <div className="absolute left-[29%] top-32 h-40 w-8 -rotate-12 rounded-full bg-white/60" />
      <div className="absolute right-[29%] top-32 h-40 w-8 rotate-12 rounded-full bg-white/60" />
      <div className="absolute left-[40%] top-[19rem] h-24 w-8 -rotate-3 rounded-full bg-white/60" />
      <div className="absolute right-[40%] top-[19rem] h-24 w-8 rotate-3 rounded-full bg-white/60" />
      {[
        ["Thoracic nodes", "left-[53%] top-[38%] bg-blue-500"],
        ["Stomach history", "left-[56%] top-[52%] bg-amber-400"],
        ["Retrocrural node", "left-[42%] top-[61%] bg-blue-500"],
        ["Aortocaval node", "left-[52%] top-[66%] bg-blue-500"],
      ].map(([label, classes]) => (
        <div key={label} className={`absolute ${classes} h-4 w-4 rounded-full ring-8 ring-white/50`}>
          <span className="absolute left-5 top-[-0.35rem] max-w-28 whitespace-normal rounded-full bg-white px-2 py-1 text-xs font-black leading-tight text-blue-950 shadow-lg">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

function EncouragementPanel() {
  return (
    <section className="rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 via-white to-cyan-50 p-5 shadow-lg shadow-teal-100/40">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-teal-800">Hold onto this</p>
      <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">Encouraging context in the records</h2>
      <p className="mt-2 text-sm font-semibold leading-7 text-slate-700">
        This does not rule out cancer. It does mean there are useful strengths in the file while the PET findings get proven by biopsy.
      </p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {[
          "Prior DLBCL and MALT treatments were reported successful.",
          "Visible kidney and liver chemistry values look broadly stable.",
          "WBC, hemoglobin, hematocrit, and platelets are visible in-range.",
          "IgG, IgA, and IgM are visible in-range on the screenshots.",
        ].map((item) => (
          <div key={item} className="border-l-4 border-teal-600 bg-white px-3 py-2 text-sm font-bold leading-6 text-slate-800 shadow-sm">
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}

function UncertaintyPanel({ activeCase }: { activeCase: CaseProfile }) {
  return (
    <section className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-amber-50 p-5 shadow-lg shadow-blue-100/40">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-900">Do not skip this</p>
      <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">The unknown that changes everything</h2>
      <p className="mt-2 text-sm font-semibold leading-7 text-slate-700">
        PET activity is a signal. Biopsy and pathology decide what it means.
      </p>
      <div className="mt-4 space-y-3">
        {[
          ["Current proof point", activeCase.pathology || "Current biopsy/pathology is not loaded yet."],
          ["Why it matters", "Treatment choices can change depending on whether this is DLBCL recurrence, another lymphoma subtype, inflammation, or something else."],
          ["What CBC will push for", "Exact diagnosis, subtype markers, pathology/IHC/flow/cytogenetics, and whether a second opinion changes the plan."],
        ].map(([label, detail]) => (
          <div key={label} className="border-l-4 border-blue-900 bg-white px-3 py-3 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-blue-900">{label}</p>
            <p className="mt-1 max-h-28 overflow-auto text-sm font-bold leading-6 text-slate-800">{detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ChatDeck({
  messages,
  chatInput,
  onChatInputChange,
  onSendChat,
}: {
  messages: ChatMessage[];
  chatInput: string;
  onChatInputChange: (value: string) => void;
  onSendChat: (value: string) => void;
}) {
  const prompts = [
    "What does this likely point to?",
    "What is encouraging in the records?",
    "What should we ask the oncologist?",
    "What should we not miss?",
  ];
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: messages.length > 1 ? "smooth" : "auto",
      block: "end",
    });
  }, [messages.length]);

  function sendAndRefocus(value: string) {
    if (!value.trim()) return;
    onSendChat(value);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  return (
    <section className="rounded-[1.5rem] border border-teal-200 bg-gradient-to-br from-white via-teal-50 to-cyan-50 p-5 shadow-xl shadow-cyan-100/50">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-800">CBC conversation</p>
            <AiLevelBadge level="Deep reasoning" detail="GPT-5.5/high for recommendations when connected" />
          </div>
          <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-950">Ask it like you would ask a person.</h2>
        </div>
        <p className="max-w-sm text-sm font-semibold leading-6 text-slate-700">
          CBC answers from the uploaded records and saved case summary.
        </p>
      </div>

      <div className="mt-5 rounded-2xl border border-white/80 bg-white/88 p-3 shadow-inner">
        <div
          role="log"
          aria-live="polite"
          aria-relevant="additions text"
          className="max-h-[26rem] space-y-3 overflow-y-auto scroll-smooth p-1"
        >
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[84%] rounded-2xl px-4 py-3 text-base leading-8 shadow-sm ${
                  message.role === "user"
                    ? "bg-blue-900 text-white"
                    : "border border-amber-100 bg-amber-50 text-slate-800"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} aria-hidden="true" />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {prompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => sendAndRefocus(prompt)}
              className="rounded-full border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-black text-teal-950 transition hover:bg-teal-100"
            >
              {prompt}
            </button>
          ))}
        </div>

        <form
          className="mt-3 flex flex-col gap-2 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            sendAndRefocus(chatInput);
          }}
        >
          <input
            ref={inputRef}
            value={chatInput}
            onChange={(event) => onChatInputChange(event.target.value)}
            placeholder="Ask CBC about this case..."
            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-950 outline-none placeholder:text-slate-500 focus:border-teal-500"
          />
          <button
            type="submit"
            className="rounded-xl border border-blue-950 bg-blue-900 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:bg-blue-800"
          >
            Send
          </button>
        </form>
      </div>
    </section>
  );
}

function TodaysFocusPanel({ selectedMission, onAsk }: { selectedMission: MissionStep; onAsk: () => void }) {
  return (
    <section className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-rose-50 p-5 shadow-lg shadow-amber-100/40">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-900">Today&apos;s focus</p>
      <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">{selectedMission.title}</h2>
      <p className="mt-2 text-base font-semibold leading-7 text-slate-800">{selectedMission.detail}</p>
      <p className="mt-4 rounded-xl bg-white p-3 text-sm font-bold leading-6 text-slate-800 shadow-sm">
        {missionActionText(selectedMission)}
      </p>
      <button
        type="button"
        onClick={onAsk}
        className="mt-4 w-full rounded-xl border border-blue-950 bg-blue-900 px-4 py-3 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:bg-blue-800"
      >
        Ask CBC for the next move
      </button>
    </section>
  );
}

function MissionControlPanel({
  mission,
  readyCount,
  selectedIndex,
  selectedMission,
  basePath = "/mike-mc/cancer-research",
  onSelect,
  onAsk,
}: {
  mission: MissionStep[];
  readyCount: number;
  selectedIndex: number;
  selectedMission: MissionStep;
  basePath?: string;
  onSelect: (index: number) => void;
  onAsk: () => void;
}) {
  const percent = Math.round((readyCount / mission.length) * 100);

  return (
    <section className="rounded-2xl border border-blue-200 bg-white p-4 shadow-xl shadow-blue-100/60">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-900">Mission control</p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">Battle Map</h2>
          <p className="mt-1 text-sm font-semibold leading-6 text-slate-700">A live path through the case, not a checklist.</p>
        </div>
        <div className="grid h-20 w-20 place-items-center rounded-full border-[10px] border-blue-100 bg-blue-900 text-center text-white shadow-md">
          <div>
            <p className="text-xl font-black">{percent}%</p>
            <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-cyan-100">mapped</p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        {mission.map((step, index) => {
          const selected = selectedIndex === index;
          return (
            <button
              key={step.title}
              type="button"
              onClick={() => onSelect(index)}
              className={`group flex items-center gap-3 rounded-xl border px-3 py-3 text-left transition ${
                selected
                  ? "border-blue-900 bg-blue-900 text-white shadow-lg shadow-blue-200"
                  : "border-slate-200 bg-slate-50 text-slate-950 hover:border-blue-300 hover:bg-blue-50"
              }`}
            >
              <span className={`h-3 w-3 flex-shrink-0 rounded-full ${statusClass(step.status)}`} />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-black leading-5">{step.title}</span>
                <span className={`mt-0.5 block text-xs font-bold uppercase tracking-[0.1em] ${selected ? "text-cyan-100" : "text-blue-800"}`}>
                  {step.status === "ready" ? "Ready" : step.status === "next" ? "Next move" : "Needs info"}
                </span>
              </span>
              <span className={`text-lg font-black ${selected ? "text-white" : "text-blue-900"}`}>&rsaquo;</span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 border-l-4 border-blue-900 bg-blue-50 p-4">
        <p className="text-sm font-black text-blue-900">Focused step</p>
        <h3 className="mt-1 text-lg font-black text-slate-950">{selectedMission.title}</h3>
        <p className="mt-2 text-sm font-semibold leading-7 text-slate-800">{selectedMission.detail}</p>
      </div>

      <div className="mt-4 grid gap-2">
        <button
          type="button"
          onClick={onAsk}
          className="rounded-xl border border-blue-950 bg-blue-900 px-3 py-2 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:bg-blue-800"
        >
          Ask CBC about this step
        </button>
        <div className="grid grid-cols-2 gap-2">
          <a
            href={selectedMission.status === "needs-info" ? `${basePath}/case` : `${basePath}/doctor-questions`}
            className="rounded-xl border border-teal-200 bg-teal-50 px-3 py-2 text-center text-sm font-black text-teal-950 transition hover:bg-teal-100"
          >
            {selectedMission.status === "needs-info" ? "Fill info" : "Questions"}
          </a>
          <a
            href={`${basePath}/body-map`}
            className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-center text-sm font-black text-amber-950 transition hover:bg-amber-100"
          >
            Body map
          </a>
        </div>
      </div>
    </section>
  );
}

function ResearchLauncherControl({
  links,
  selectedIndex,
  onSelect,
  onOpen,
}: {
  links: Array<{ name: string; detail: string; href: string }>;
  selectedIndex: number;
  onSelect: (index: number) => void;
  onOpen: () => void;
}) {
  const selected = links[selectedIndex] ?? links[0];

  return (
    <section className="rounded-2xl border border-cyan-200 bg-gradient-to-br from-cyan-50 to-white p-4 shadow-lg shadow-cyan-100/50">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-cyan-900">Research launcher</p>
      <h2 className="mt-1 text-xl font-black text-slate-950">Open a trusted source</h2>
      <select
        value={selectedIndex}
        onChange={(event) => onSelect(Number(event.target.value))}
        className="mt-3 w-full rounded-xl border border-cyan-200 bg-white px-3 py-3 text-sm font-bold text-slate-950 outline-none focus:border-blue-700"
      >
        {links.map((link, index) => (
          <option key={link.href} value={index}>
            {link.name}
          </option>
        ))}
      </select>
      <p className="mt-3 min-h-12 text-sm font-semibold leading-6 text-slate-700">{selected?.detail}</p>
      <button
        type="button"
        onClick={onOpen}
        className="mt-3 w-full rounded-xl border border-blue-950 bg-blue-900 px-3 py-3 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:bg-blue-800"
      >
        Launch research
      </button>
    </section>
  );
}

function AiLevelBadge({
  level,
  detail,
  tone = "deep",
}: {
  level: string;
  detail: string;
  tone?: "deep" | "utility";
}) {
  const classes =
    tone === "utility"
      ? "border-teal-200 bg-teal-50 text-teal-900"
      : "border-blue-200 bg-blue-50 text-blue-950";

  return (
    <span
      className={`inline-flex max-w-full items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-black leading-none shadow-sm ${classes}`}
      title={detail}
    >
      <span className="text-[10px] font-bold uppercase tracking-[0.12em] opacity-70">AI</span>
      {level}
    </span>
  );
}

function ActionButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl border border-blue-950 bg-blue-900 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-800"
    >
      {children}
    </button>
  );
}

function statusClass(status: MissionStep["status"]) {
  if (status === "ready") return "bg-teal-500";
  if (status === "next") return "bg-blue-500";
  return "bg-amber-400";
}

function missionActionText(step: MissionStep) {
  if (step.status === "ready") {
    return "This part is usable. The next value is turning it into a doctor question, trial search, or shareable summary.";
  }
  if (step.status === "next") {
    return "This is the next move. Add the missing location/travel detail or open the trial search paths when you are ready.";
  }
  return "CBC needs this before it can reason well. Fill the case page or re-read uploaded files so recommendations get sharper.";
}

function detectBiomarkers(text: string) {
  const upper = text.toUpperCase();
  return BIOMARKER_PATTERNS.filter((marker) => upper.includes(marker.toUpperCase()));
}

function buildQuery(profile: CaseProfile, markers: string[]) {
  return [
    profile.cancerType,
    profile.stage,
    profile.biomarkers || markers.join(" "),
    profile.treatments ? `after ${profile.treatments}` : "",
  ]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildMission(profile: CaseProfile, markers: string[]): MissionStep[] {
  return [
    {
      title: "Understand the diagnosis",
      detail: profile.cancerType ? `${profile.cancerType}${profile.stage ? `, ${profile.stage}` : ""}` : "Start with cancer type and stage.",
      status: profile.cancerType && profile.stage ? "ready" : "needs-info",
    },
    {
      title: "Find the target",
      detail: markers.length ? `CBC found: ${markers.join(", ")}` : "Look for biomarker, genetic, or molecular testing.",
      status: markers.length ? "ready" : "needs-info",
    },
    {
      title: "Map the treatment path",
      detail: profile.treatments ? "Treatment history is captured." : "Add current and past treatments.",
      status: profile.treatments ? "ready" : "needs-info",
    },
    {
      title: "Search trials and options",
      detail: profile.location ? "Location is ready for trial searches." : "Add location or travel radius for trial matching.",
      status: profile.location ? "next" : "needs-info",
    },
  ];
}

function buildSourceLinks(profile: CaseProfile, query: string) {
  const encodedQuery = encodeURIComponent(query || profile.cancerType || "cancer treatment");
  const encodedCondition = encodeURIComponent(profile.cancerType || "cancer");
  const location = profile.location ? `&locn=${encodeURIComponent(profile.location)}` : "";

  return [
    {
      name: "PubMed studies",
      detail: "Recent peer-reviewed papers and reviews.",
      href: `https://pubmed.ncbi.nlm.nih.gov/?term=${encodedQuery}&sort=date`,
    },
    {
      name: "ClinicalTrials.gov",
      detail: "Recruiting and active clinical trials.",
      href: `https://clinicaltrials.gov/search?cond=${encodedCondition}&term=${encodedQuery}${location}`,
    },
    {
      name: "NCI trials",
      detail: "National Cancer Institute trial search.",
      href: `https://www.cancer.gov/research/participate/clinical-trials-search?keyword=${encodedQuery}`,
    },
    {
      name: "FDA oncology approvals",
      detail: "Newly approved drugs and indications.",
      href: `https://www.fda.gov/search?s=${encodedQuery}%20oncology%20approval`,
    },
    {
      name: "NCCN patient guidelines",
      detail: "Plain-English guideline booklets.",
      href: "https://www.nccn.org/patientresources/patient-resources/guidelines-for-patients",
    },
    {
      name: "NCI PDQ summaries",
      detail: "Evidence-reviewed treatment summaries.",
      href: "https://www.cancer.gov/publications/pdq/information-summaries/adult-treatment",
    },
  ];
}

function requiredGaps(profile: CaseProfile) {
  const gaps = [];
  if (!profile.cancerType.trim()) gaps.push("Cancer type");
  if (!profile.stage.trim()) gaps.push("Stage / grade");
  if (!profile.biomarkers.trim()) gaps.push("Biomarker or genetic testing results");
  if (!profile.treatments.trim()) gaps.push("Treatments already tried or planned");
  if (!profile.pathology.trim()) gaps.push("Pathology impression");
  return gaps;
}

function summarizeReport(report: string, markers: string[]) {
  const hasReport = report.trim().length > 0;
  const lower = report.toLowerCase();
  const flags = [
    lower.includes("impression") ? "Impression section detected" : "",
    lower.includes("diagnosis") ? "Diagnosis language detected" : "",
    lower.includes("metastatic") || lower.includes("metastasis") ? "Metastatic wording detected" : "",
    lower.includes("positive") ? "Positive result wording detected" : "",
    lower.includes("negative") ? "Negative result wording detected" : "",
  ].filter(Boolean);

  return [
    {
      title: "Report status",
      detail: hasReport ? `${report.length.toLocaleString()} characters pasted for CBC review.` : "Paste report text to activate the quick read.",
    },
    {
      title: "Signals",
      detail: flags.length ? flags.join(". ") : "CBC will look for diagnosis, impression, metastatic wording, and positive/negative findings.",
    },
    {
      title: "Markers",
      detail: markers.length ? markers.join(", ") : "No common marker terms detected yet.",
    },
  ];
}

function generateCbcReply({
  question,
  profile,
  missing,
  detectedMarkers,
  doctorQuestions,
  query,
}: {
  question: string;
  profile: CaseProfile;
  missing: string[];
  detectedMarkers: string[];
  doctorQuestions: DoctorQuestion[];
  query: string;
}) {
  const ask = question.toLowerCase();
  const cancer = profile.cancerType || "this cancer";
  const stage = profile.stage ? ` (${profile.stage})` : "";
  const markerText = detectedMarkers.length ? detectedMarkers.join(", ") : "no common markers detected yet";

  if (ask.includes("missing") || ask.includes("need") || ask.includes("next")) {
    if (missing.length === 0) {
      return `Good news: the core case fields are filled in. Next I would open the trial searches, compare the cancer type and markers against NCCN/NCI guidance, and build a second-opinion packet. Current research phrase: ${query || cancer}.`;
    }
    return `The biggest missing pieces are: ${missing.join(", ")}. If you only fill in one thing next, I'd look for the pathology impression and biomarker/genetic testing results, because those often determine targeted therapy, immunotherapy, and trial options.`;
  }

  if (ask.includes("what cancer") || ask.includes("diagnosis") || ask.includes("mark has") || ask.includes("mark have")) {
    return `Based on the case CBC has loaded, Mark's history includes diffuse large B-cell lymphoma (DLBCL) in 2019 and gastric MALT lymphoma in 2023. The current uploaded PET/CT information points to FDG-avid thoracic and abdominopelvic adenopathy, which raises concern for possible lymphoma recurrence or a new lymphoma process, but biopsy/pathology is still needed before calling it that. Current case summary: ${cancer}${stage}.`;
  }

  if (ask.includes("trial") || ask.includes("clinical")) {
    return `For trials, we need five things: cancer type, stage, prior treatments, biomarkers, and location/travel radius. For ${cancer}${stage}, CBC currently sees markers as: ${markerText}. Use the ClinicalTrials.gov and NCI trial buttons, then bring promising trials to the oncologist to confirm eligibility.`;
  }

  if (/\bcrt\b/.test(ask) || ask.includes("car-t") || ask.includes("car t") || ask.includes("cart therapy")) {
    return `CBC should have caught that. One important catch: "CRT" can mean different things, so I would clarify the acronym with the oncologist. If you mean CAR-T cell therapy, that is an advanced immune-cell therapy often discussed for relapsed or refractory DLBCL after standard treatments, but eligibility depends on the confirmed biopsy, lymphoma subtype, prior therapies, overall fitness, and whether the cancer expresses the right target such as CD19. If you mean chemoradiation/combined radiation therapy, that is a different treatment path and is not the same as CAR-T.

Questions to ask: 1. Are we talking about CAR-T, chemoradiation/CRT, or something else? 2. If this is DLBCL recurrence, would CAR-T, bispecific antibodies, transplant, or a clinical trial be considered? 3. What pathology/IHC/flow/cytogenetic results are needed before deciding? 4. Should we get a lymphoma specialist or cellular therapy center opinion now, even before treatment starts?`;
  }

  if (ask.includes("doctor") || ask.includes("oncologist") || ask.includes("ask")) {
    return `Here are the first questions I'd bring: 1. ${doctorQuestions[0]?.question} 2. ${doctorQuestions[1]?.question} 3. ${doctorQuestions[2]?.question} 4. ${doctorQuestions[4]?.question} The goal is to ask about standard options, complete biomarker testing, trials, and whether a second opinion would change the plan.`;
  }

  if (ask.includes("battle map") || ask.includes("map") || ask.includes("explain")) {
    return `The battle map is CBC's way of organizing the fight: first understand the exact diagnosis, then find the biological targets like biomarkers, then map current and past treatments, then search trials and second-opinion options. Right now the case is ${cancer}${stage}, and markers found are: ${markerText}.`;
  }

  if (ask.includes("report") || ask.includes("pathology") || ask.includes("scan") || ask.includes("lab")) {
    if (!profile.pastedReport.trim() && !profile.pathology.trim() && !profile.imaging.trim()) {
    return "Paste the report's Impression, Diagnosis, or Findings section into CBC. Start with pathology if you have it. Remove names, birthdays, addresses, account numbers, and insurance IDs before pasting.";
    }
    return `CBC sees report/case text entered. I'd pull out: exact diagnosis, stage/grade, metastatic wording, positive/negative markers, tumor location, and recommended follow-up. Detected markers so far: ${markerText}.`;
  }

  if (ask.includes("cure") || ask.includes("beat") || ask.includes("survive")) {
    return "I'm here to help fight smarter and leave fewer stones unturned. I can't promise a cure, but I can help organize the case, look for standard options, surface trial paths, and prepare stronger questions for the oncology team.";
  }

  if (ask.includes("biomarker") || ask.includes("mutation") || ask.includes("genetic")) {
    return `Biomarkers can matter because some cancers have targeted therapies or immunotherapy clues. CBC currently detects: ${markerText}. If testing is missing or limited, ask the oncologist whether broader NGS, MSI/MMR, PD-L1, HER2, BRCA, EGFR, KRAS, BRAF, ALK, ROS1, NTRK, RET, or MET testing is appropriate for this cancer type.`;
  }

  return `For ${cancer}${stage}, I'd start by making the case file complete, then use the research launchers to check guidelines, recent studies, FDA approvals, and trials. I can help with missing info, report translation, trial search steps, battle map explanation, or oncologist questions.`;
}

function buildOncologistQuestions(profile: CaseProfile, markers: string[]): DoctorQuestion[] {
  const markerText = markers.length > 0 ? markers.join(", ") : "the biomarkers/genetic results";
  const diagnosis = profile.cancerType || "the current cancer diagnosis";
  const priorTreatment = profile.treatments ? "the prior treatment history" : "any prior treatments";
  const trialLocation = profile.location || "our travel radius";

  return [
    {
      question: "What is the exact diagnosis, stage, grade, and treatment goal right now?",
      likelyResponse: "They may confirm the working diagnosis and say the plan depends on pathology, biopsy, staging, or comparison with prior scans.",
      followUps: [
        `What single finding would most change the plan for ${diagnosis}?`,
        "Is the intent curative, disease control, symptom relief, or still undecided until more data is back?",
      ],
    },
    {
      question: "Is biomarker, molecular, or next-generation sequencing testing complete?",
      likelyResponse: "They may say testing is complete, pending, not standard for this lymphoma/cancer type, or only needed after biopsy confirmation.",
      followUps: [
        `If testing is not complete, should we request broader testing for ${markerText}?`,
        "Would blood-based testing add anything, or is tissue from biopsy the better sample?",
      ],
    },
    {
      question: `Based on ${markerText}, are there targeted therapies, immunotherapies, or trial options we should discuss?`,
      likelyResponse: "They may explain that options depend on the final subtype, prior treatments, performance status, and whether disease is localized or widespread.",
      followUps: [
        `How does ${priorTreatment} affect what can be used next?`,
        "Are there options worth considering before standard treatment, or only if standard treatment fails?",
      ],
    },
    {
      question: "What are the standard-of-care options, and what would make you choose one over another?",
      likelyResponse: "They may compare chemotherapy, immunotherapy, radiation, targeted therapy, watchful waiting, or biopsy-first planning depending on the case.",
      followUps: [
        "What result are we hoping to see, and by what date would we know whether it is working?",
        "What side effects or long-term risks matter most for this specific person?",
      ],
    },
    {
      question: "Are there clinical trials we should explore before starting or changing treatment?",
      likelyResponse: "They may say trials are not needed yet, eligibility is unclear, or that trial timing matters before a new therapy begins.",
      followUps: [
        `Can your office search trials near ${trialLocation}, or should we contact a trial center directly?`,
        "Would starting this treatment make him ineligible for any promising trials later?",
      ],
    },
    {
      question: "Would a second opinion at an NCI-designated cancer center be useful for this case?",
      likelyResponse: "They may be supportive, neutral, or say it is reasonable if the diagnosis is rare, recurrent, aggressive, or treatment choices are complex.",
      followUps: [
        "Where would you send your own family member for a second opinion on this exact situation?",
        "Can you send the pathology slides, imaging discs, and treatment history so the second opinion is complete?",
      ],
    },
    {
      question: profile.location
        ? `Which realistic trial sites or specialty centers near ${profile.location} should we contact?`
        : "Which locations should we consider if travel for a trial or second opinion is possible?",
      likelyResponse: "They may name a nearby academic center, recommend staying local, or suggest waiting for biopsy/pathology before contacting centers.",
      followUps: [
        "Who is the best person in your office to help transfer records quickly?",
        "Which records are must-have before that appointment: biopsy, PET/CT, labs, treatment protocol, or pathology slides?",
      ],
    },
    {
      question: "If the current treatment stops working, what is the next plan and when would we know?",
      likelyResponse: "They may describe scan timing, lab monitoring, symptoms to watch, and the next-line treatment path.",
      followUps: [
        "What would count as success, partial response, stable disease, or progression?",
        "At what point should we revisit trials, transplant/CAR-T/advanced therapies, or another specialist?",
      ],
    },
  ];
}

function buildSharePack({
  profile,
  detectedMarkers,
  missing,
  doctorQuestions,
  query,
}: {
  profile: CaseProfile;
  detectedMarkers: string[];
  missing: string[];
  doctorQuestions: DoctorQuestion[];
  query: string;
}) {
  const questionText = doctorQuestions
    .slice(0, 6)
    .map((item, index) => {
      const followUps = item.followUps.map((followUp) => `   - ${followUp}`).join("\n");
      return `${index + 1}. ${item.question}\n   Likely response: ${item.likelyResponse}\n${followUps}`;
    })
    .join("\n\n");

  return [
    "CBC Share Pack",
    "",
    `Case: ${profile.label || "Untitled"}`,
    `Cancer/history: ${profile.cancerType || "Not entered yet"}`,
    `Stage/grade: ${profile.stage || "Not entered yet"}`,
    `Biomarkers detected: ${detectedMarkers.length ? detectedMarkers.join(", ") : "None detected yet"}`,
    `Treatments tried/planned: ${profile.treatments || "Not entered yet"}`,
    `Location/trial radius: ${profile.location || "Not entered yet"}`,
    "",
    `Missing items: ${missing.length ? missing.join(", ") : "Core fields are filled"}`,
    `Research phrase: ${query || "Add cancer type and findings to build a search phrase"}`,
    "",
    "Top Questions For The Oncologist",
    questionText,
    "",
    "Note: CBC organizes questions and research prep. Decisions should be made with the oncology team.",
  ].join("\n");
}
