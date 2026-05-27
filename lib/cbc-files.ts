import { listCbcStoredFiles } from "@/lib/cbc-storage";

export type CbcUploadedFile = {
  id: string;
  name: string;
  href: string;
  type: "pdf" | "image";
  group: "Protocol" | "Lab screenshots" | "Imaging / report";
  source: string;
  uploadedAt: string;
  sizeBytes: number;
  note: string;
};

export function protectedCbcFileHref(name: string) {
  void name;
  return "";
}

export const CBC_UPLOADED_FILES: CbcUploadedFile[] = [
  {
    id: "egidio-mark-cgvs-final",
    name: "Egidio, Mark CGVS final.pdf",
    href: protectedCbcFileHref("Egidio, Mark CGVS final.pdf"),
    type: "pdf",
    group: "Protocol",
    source: "Provided local PDF",
    uploadedAt: "2026-05-26",
    sizeBytes: 59952,
    note: "CGVS final PDF.",
  },
  {
    id: "dr-fitzgerald-mark-protocol-2024",
    name: "DrFitzgeraldMarkProtocol2024.pdf",
    href: protectedCbcFileHref("DrFitzgeraldMarkProtocol2024.pdf"),
    type: "pdf",
    group: "Protocol",
    source: "Provided local PDF",
    uploadedAt: "2026-05-26",
    sizeBytes: 81165,
    note: "Dr. Fitzgerald protocol PDF.",
  },
  ...[
    "1000034732.png",
    "1000034733.png",
    "1000034734.png",
    "1000034735.png",
    "1000034736.png",
    "1000034737.png",
    "1000034738.png",
    "1000034739.png",
    "1000034740.png",
    "1000034741.png",
    "1000034742.png",
    "1000034743.png",
    "1000034744.png",
    "1000034745.png",
    "1000034746.png",
    "1000034747.png",
    "1000034748.png",
  ].map((name, index) => ({
    id: name.replace(".png", ""),
    name,
    href: protectedCbcFileHref(name),
    type: "image" as const,
    group: "Lab screenshots" as const,
    source: "Provided local screenshot",
    uploadedAt: "2026-05-26",
    sizeBytes: [
      347583, 341085, 328071, 308902, 262350, 250091, 259434, 261146, 269109,
      338983, 234650, 261850, 261850, 269859, 258969, 280818, 225037,
    ][index],
    note: "MyChart/test-results screenshot.",
  })),
];

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export async function getCbcFileLibrary() {
  const liveFiles = await listCbcStoredFiles().catch((error) => {
    console.error("CBC file library could not read live uploads.", error);
    return [];
  });
  const names = new Set(CBC_UPLOADED_FILES.map((file) => file.name.toLowerCase()));
  const liveLibraryFiles: CbcUploadedFile[] = liveFiles
    .filter((file) => !names.has(file.name.toLowerCase()))
    .map((file) => ({
      id: `live-${file.id}`,
      name: file.name,
      href: protectedCbcFileHref(file.name),
      type: file.type,
      group: file.type === "pdf" ? "Imaging / report" : "Lab screenshots",
      source: "Live private upload",
      uploadedAt: file.uploadedAt.slice(0, 10),
      sizeBytes: file.sizeBytes,
      note:
        file.type === "pdf"
          ? "Live private upload. CBC reads this PDF when updating the case and answering questions."
          : "Live private upload. CBC indexes this image and includes it in the case context.",
    }));

  return [...CBC_UPLOADED_FILES, ...liveLibraryFiles];
}
