import type { Metadata } from "next";
import { CbcFileLibrary } from "@/app/mike-mc/cancer-research/files/CbcFileLibrary";
import { getCbcFileLibrary } from "@/lib/cbc-files";
import { CbcGate } from "../CbcGate";
import { CbcPageShell } from "../CbcPageShell";

export const metadata: Metadata = {
  title: "CBC Files",
  description: "Protected CBC file library.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function CbcFilesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const files = await getCbcFileLibrary();

  return (
    <CbcGate error={params.error} nextPath="/cbc/files">
      <CbcPageShell
        active="Files"
        title="Reports & Uploads"
        subtitle="A protected inventory of PDFs, lab screenshots, and report images already loaded into CBC."
      >
        <CbcFileLibrary files={files} />
      </CbcPageShell>
    </CbcGate>
  );
}
