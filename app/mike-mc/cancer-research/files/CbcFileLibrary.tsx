"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { formatFileSize, type CbcUploadedFile } from "@/lib/cbc-files";

type UploadResult = {
  uploaded: string[];
  skipped: string[];
  rejected: string[];
  error?: string;
  message?: string;
};

export function CbcFileLibrary({ files }: { files: CbcUploadedFile[] }) {
  const router = useRouter();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const existingNames = useMemo(() => new Set(files.map((file) => file.name.toLowerCase())), [files]);
  const staged = selectedFiles.map((file) => ({
    name: file.name,
    size: file.size,
    duplicate: existingNames.has(file.name.toLowerCase()),
  }));

  async function uploadFiles() {
    setError("");
    setResult(null);
    if (selectedFiles.length === 0) return;

    const form = new FormData();
    for (const file of selectedFiles) form.append("files", file);

    const response = await fetch("/api/cbc/files", {
      method: "POST",
      body: form,
    });
    const body = (await response.json().catch(() => null)) as UploadResult | null;

    if (!response.ok) {
      setError(body?.error ?? "CBC could not add those files.");
      return;
    }

    if (body) setResult(body);
    setSelectedFiles([]);
    startTransition(() => router.refresh());
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[24rem_minmax(0,1fr)]">
      <aside className="space-y-4">
        <section className="rounded-[1.25rem] border border-amber-200 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-5 shadow-xl shadow-amber-100/50">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-rose-600">Add files</p>
            <span
              className="rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1 text-[11px] font-black leading-none text-teal-900"
              title="File upload, library view, and duplicate checks are utility tasks. No highest-tier reasoning needed."
            >
              AI Utility
            </span>
          </div>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">Upload to CBC</h2>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            Add Mark&apos;s PDFs or report screenshots here. CBC stores new files privately, lists them below, and reads them into the case summary and chat context.
          </p>
          <label className="mt-5 block rounded-2xl border-2 border-dashed border-blue-300 bg-white/80 p-5 text-center shadow-inner">
            <span className="block text-sm font-bold text-blue-900">Choose files</span>
            <span className="mt-1 block text-xs leading-5 text-slate-500">PDF, PNG, JPG, JPEG, or WEBP</span>
            <input
              type="file"
              multiple
              accept=".pdf,.png,.jpg,.jpeg,.webp"
              onChange={(event) => setSelectedFiles(Array.from(event.target.files ?? []))}
              className="sr-only"
            />
          </label>
          <button
            type="button"
            onClick={uploadFiles}
            disabled={selectedFiles.length === 0 || isPending}
            style={{ backgroundColor: "#0b2a6f", borderColor: "#061a45" }}
            className="mt-4 w-full rounded-xl border px-5 py-3 text-sm font-bold text-white shadow-xl shadow-blue-300/70 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Submit selected files to CBC
          </button>
          {error && <p className="mt-3 rounded-lg bg-rose-100 p-3 text-sm font-semibold text-rose-800">{error}</p>}
          {result && (
            <div className="mt-3 rounded-xl border border-white/80 bg-white/80 p-3 text-sm leading-6 text-slate-700">
              <p><strong>Uploaded:</strong> {result.uploaded.length || 0}</p>
              <p><strong>Duplicates skipped:</strong> {result.skipped.length || 0}</p>
              <p><strong>Rejected:</strong> {result.rejected.length || 0}</p>
              {result.message && <p className="mt-2 font-semibold text-blue-900">{result.message}</p>}
            </div>
          )}
        </section>

        <section className="rounded-[1.25rem] border border-cyan-200 bg-gradient-to-br from-cyan-50 to-teal-50 p-5 shadow-lg shadow-cyan-100/50">
          <h2 className="text-sm font-black text-slate-950">Selected file check</h2>
          {staged.length === 0 ? (
            <p className="mt-3 text-sm leading-6 text-slate-600">Pick files above and CBC will show which ones are already in the library.</p>
          ) : (
            <div className="mt-3 space-y-2">
              {staged.map((file) => (
                <div key={file.name} className="rounded-xl border border-white/80 bg-white/85 p-3">
                  <p className="break-words text-sm font-bold text-slate-900">{file.name}</p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-500">{formatFileSize(file.size)}</span>
                    <span className={`rounded-full px-2 py-1 text-xs font-bold ${file.duplicate ? "bg-amber-100 text-amber-900" : "bg-teal-100 text-teal-800"}`}>
                      {file.duplicate ? "duplicate" : "new"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </aside>

      <main className="space-y-5">
        <section className="rounded-[1.25rem] border border-white/70 bg-white/86 p-5 shadow-xl shadow-rose-100/40">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">CBC file library</p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <h2 className="text-3xl font-black tracking-tight text-slate-950">{files.length} files loaded</h2>
                <span
                  className="rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1 text-[11px] font-black leading-none text-teal-900"
                  title="CBC uses lightweight file indexing here, reserving the strongest model for recommendations."
                >
                  AI Utility
                </span>
              </div>
            </div>
            <div className="rounded-full bg-blue-900 px-4 py-2 text-sm font-bold text-white">
              Duplicate check by filename
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {files.map((file) => (
            <article key={file.name} className="overflow-hidden rounded-[1.2rem] border border-white/80 bg-white/90 shadow-lg shadow-cyan-100/40">
              <div className={`flex h-56 items-center justify-center p-6 text-center text-white ${file.type === "pdf" ? "bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700" : "bg-gradient-to-br from-teal-700 via-cyan-700 to-amber-500"}`}>
                <div>
                  <p className="text-5xl font-black">{file.type === "pdf" ? "PDF" : "IMG"}</p>
                  <p className="mt-2 text-sm font-bold opacity-85">{file.group}</p>
                  <p className="mt-3 rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs font-black uppercase tracking-[0.12em]">
                    Protected file
                  </p>
                </div>
              </div>
              <div className="p-4">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h3 className="break-words text-sm font-black leading-5 text-slate-950">{file.name}</h3>
                  <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-900">
                    {file.type}
                  </span>
                </div>
                <p className="text-sm leading-6 text-slate-600">{file.note}</p>
                <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-500">
                  <span>{formatFileSize(file.sizeBytes)}</span>
                  <span>{file.uploadedAt}</span>
                </div>
                {file.href ? (
                  <a
                    href={file.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex rounded-xl bg-blue-900 px-4 py-2 text-sm font-bold text-white shadow-md shadow-blue-200 transition hover:bg-blue-800"
                  >
                    Open protected file
                  </a>
                ) : (
                  <p className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-900">
                    Protected in CBC. Used for case updates.
                  </p>
                )}
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
