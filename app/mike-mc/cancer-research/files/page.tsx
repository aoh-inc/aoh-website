import type { Metadata } from "next";
import Link from "next/link";
import { getCbcFileLibrary } from "@/lib/cbc-files";
import { CbcNav } from "../CbcNav";
import { CbcFileLibrary } from "./CbcFileLibrary";

export const metadata: Metadata = {
  title: "CBC File Library",
  description: "Uploaded CBC reports, screenshots, and protocols.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function CbcFilesPage() {
  const files = await getCbcFileLibrary();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#bae6fd_0,#ecfeff_24rem,transparent_42rem),linear-gradient(135deg,#fff7ed_0%,#ecfeff_48%,#fdf2f8_100%)] text-slate-900">
      <div className="mx-auto w-full max-w-[92rem] px-4 py-6 md:px-8 md:py-10">
        <header className="mb-8 overflow-hidden rounded-[1.5rem] border border-white/70 bg-white/82 p-6 shadow-xl shadow-cyan-100/50 backdrop-blur md:p-8">
          <div className="mb-4">
            <Link
              href="/mike-mc/cancer-research"
              className="text-xs font-bold uppercase tracking-[0.18em] text-rose-500 transition hover:text-teal-700"
            >
              Back to CBC
            </Link>
          </div>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
                CBC File Library
              </p>
              <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
                Reports & Uploads
              </h1>
              <p className="mt-3 max-w-4xl text-base leading-8 text-slate-600">
                A colorful inventory of PDFs, lab screenshots, and report images already loaded into CBC so you can avoid duplicates.
              </p>
            </div>
            <div className="rounded-full bg-blue-900 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-blue-200">
              {files.length} files
            </div>
          </div>
        </header>

        <CbcNav active="Files" />
        <CbcFileLibrary files={files} />
      </div>
    </main>
  );
}
