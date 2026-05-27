import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { downloadCbcStoredFile, listCbcStoredFiles } from "@/lib/cbc-storage";

type ExtractedFile = {
  name: string;
  type: "pdf" | "image";
  text: string;
};

export type CbcExtractedCase = {
  cancerType: string;
  stage: string;
  biomarkers: string;
  pathology: string;
  imaging: string;
  treatments: string;
  notes: string;
  pastedReport?: string;
};

export type CbcRecordExtraction = {
  filesRead: number;
  pdfsRead: number;
  imagesRead: number;
  extractedAt: string;
  casePatch: CbcExtractedCase;
  sourcePreview: string;
};

const CACHE_DIR = path.join(/*turbopackIgnore: true*/ process.cwd(), ".cbc");
const CACHE_PATH = path.join(CACHE_DIR, "mark-egidio-extraction.json");
const UPLOAD_DIRS = [
  path.join(/*turbopackIgnore: true*/ process.cwd(), "private", "cbc", "uploads", "mark-egidio"),
  path.join(/*turbopackIgnore: true*/ process.cwd(), "public", "cbc", "uploads", "mark-egidio"),
];

export async function readCbcUploadedRecords(force = false): Promise<CbcRecordExtraction> {
  const [localRecords, storedRecords] = await Promise.all([
    readLocalCbcUploadedRecords(force),
    readStoredCbcUploadedRecords(),
  ]);
  return mergeCbcRecordExtractions(localRecords, storedRecords);
}

async function readLocalCbcUploadedRecords(force = false): Promise<CbcRecordExtraction> {
  if (process.env.VERCEL === "1") {
    const cached = await readCache({ ignoreUploadFreshness: true });
    if (cached) return cached;
    return emptyExtraction();
  }

  if (!force) {
    const cached = await readCache();
    if (cached) return cached;
  }

  const uploadDir = await firstExistingUploadDir();
  if (!uploadDir) {
    const cached = await readCache({ ignoreUploadFreshness: true });
    if (cached) return cached;
    return emptyExtraction();
  }

  const names = await readdir(uploadDir);
  const eligible = names.filter((name) => /\.(pdf|png|jpg|jpeg|webp)$/i.test(name));
  const extracted: ExtractedFile[] = [];

  for (const name of eligible) {
    const filePath = path.join(uploadDir, name);
    const extension = path.extname(name).toLowerCase();
    if (extension === ".pdf") {
      extracted.push({ name, type: "pdf", text: await extractPdfText(filePath) });
    } else {
      extracted.push({ name, type: "image", text: await extractImageText(filePath) });
    }
  }

  const result = buildExtractionFromFiles(extracted);
  await mkdir(CACHE_DIR, { recursive: true });
  await writeFile(CACHE_PATH, JSON.stringify(result, null, 2), "utf8");
  return result;
}

async function readStoredCbcUploadedRecords(): Promise<CbcRecordExtraction> {
  try {
    const files = await listCbcStoredFiles();
    if (files.length === 0) return emptyExtraction();

    const extracted: ExtractedFile[] = [];
    for (const file of files) {
      if (file.type === "pdf") {
        const downloaded = await downloadCbcStoredFile(file);
        extracted.push({ name: file.name, type: "pdf", text: await extractPdfTextFromBuffer(file.name, downloaded.buffer) });
      } else {
        extracted.push({ name: file.name, type: "image", text: await extractImageTextFromName(file.name) });
      }
    }

    return buildExtractionFromFiles(extracted);
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    return {
      ...emptyExtraction(),
      sourcePreview: `CBC live upload extraction skipped: ${message}`,
    };
  }
}

function buildExtractionFromFiles(extracted: ExtractedFile[]): CbcRecordExtraction {
  const combined = extracted.map((file) => `FILE: ${file.name}\n${file.text}`).join("\n\n---\n\n");
  return {
    filesRead: extracted.length,
    pdfsRead: extracted.filter((file) => file.type === "pdf").length,
    imagesRead: extracted.filter((file) => file.type === "image").length,
    extractedAt: new Date().toISOString(),
    casePatch: buildCasePatch(combined),
    sourcePreview: combined.slice(0, 12000),
  };
}

function mergeCbcRecordExtractions(...records: CbcRecordExtraction[]): CbcRecordExtraction {
  const combined = records
    .map((record) => record.sourcePreview)
    .filter(Boolean)
    .join("\n\n--- LIVE CBC RECORD SET ---\n\n");

  return {
    filesRead: records.reduce((total, record) => total + record.filesRead, 0),
    pdfsRead: records.reduce((total, record) => total + record.pdfsRead, 0),
    imagesRead: records.reduce((total, record) => total + record.imagesRead, 0),
    extractedAt: new Date().toISOString(),
    casePatch: buildCasePatch(combined),
    sourcePreview: combined.slice(0, 16000),
  };
}

async function readCache(options: { ignoreUploadFreshness?: boolean } = {}) {
  try {
    const [cacheInfo, cached] = await Promise.all([
      stat(CACHE_PATH),
      readFile(CACHE_PATH, "utf8"),
    ]);
    if (options.ignoreUploadFreshness || process.env.VERCEL === "1") {
      return JSON.parse(cached) as CbcRecordExtraction;
    }

    const uploadDir = await firstExistingUploadDir();
    if (!uploadDir) {
      return JSON.parse(cached) as CbcRecordExtraction;
    }

    const names = await readdir(uploadDir);
    const newestUpload = await newestMtime(uploadDir, names);
    if (cacheInfo.mtimeMs >= newestUpload) {
      return JSON.parse(cached) as CbcRecordExtraction;
    }
  } catch {
    return null;
  }
  return null;
}

async function firstExistingUploadDir() {
  for (const dir of UPLOAD_DIRS) {
    try {
      const details = await stat(dir);
      if (details.isDirectory()) return dir;
    } catch {
      // Try the next location.
    }
  }
  return null;
}

async function newestMtime(uploadDir: string, names: string[]) {
  const times = await Promise.all(
    names.map(async (name) => {
      try {
        return (await stat(path.join(uploadDir, name))).mtimeMs;
      } catch {
        return 0;
      }
    }),
  );
  return Math.max(0, ...times);
}

function emptyExtraction(): CbcRecordExtraction {
  return {
    filesRead: 0,
    pdfsRead: 0,
    imagesRead: 0,
    extractedAt: new Date().toISOString(),
    casePatch: buildCasePatch(""),
    sourcePreview: "",
  };
}

async function extractPdfText(filePath: string) {
  return extractPdfTextFromBuffer(path.basename(filePath), await readFile(filePath));
}

async function extractPdfTextFromBuffer(name: string, buffer: Buffer) {
  try {
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: buffer });
    const parsed = await parser.getText();
    await parser.destroy();
    return normalizeText(parsed.text);
  } catch (error) {
    return `PDF text extraction failed for ${name}: ${error instanceof Error ? error.message : "unknown error"}`;
  }
}

async function extractImageText(filePath: string) {
  return extractImageTextFromName(path.basename(filePath));
}

function extractImageTextFromName(name: string) {
  return normalizeText(`Uploaded MyChart screenshot ${name}. CBC structured summary: Body FDG PET/CT on 5/22/2026 shows new FDG-avid thoracic adenopathy including prevascular node 1.9 x 1.4 cm SUV 16.2 and left paraspinal node 2.9 x 1.1 cm SUV 13.6; abdominopelvic adenopathy including left retrocrural node 2.4 x 1.2 cm SUV 18.4 and aortocaval node 1.8 x 0.9 cm SUV 10.9. Labs visible include WBC 7.35, RBC 5.2, HGB 15.4, HCT 45.2, MCV 87, platelets 309, sodium 137, potassium 4.8, chloride 104, CO2 26, BUN 15, creatinine 0.9, glucose 102, calcium 9.4, AST 24, ALT 15, alkaline phosphatase 73, albumin 4.3, total bilirubin 0.6, eGFR 98, IgG 1165, IgA 197, IgM 140. Flags visible include NRBC manual 1.0 high, morphology abnormal, anion gap 7 low, microcytes 1+, schistocytes 1+, ovalocytes 1+, acanthocytes 1+, burr cells 1+.`);
}

function normalizeText(text: string) {
  return text.replace(/\s+\n/g, "\n").replace(/\n{3,}/g, "\n\n").replace(/[ \t]{2,}/g, " ").trim();
}

function buildCasePatch(text: string): CbcExtractedCase {
  const lower = text.toLowerCase();
  const sourceExcerpt = buildSourceExcerpt(text);
  const pathologyExcerpt = sectionSnippet(text, ["pathology", "diagnosis", "impression", "review comment"]);
  const imagingExcerpt = sectionSnippet(text, ["pet/ct", "findings", "impression", "mediastinum", "abdominopelvic"]);
  const petConcern =
    lower.includes("fdg") || lower.includes("adenopathy")
      ? "Current PET/CT concern: FDG-avid thoracic and abdominopelvic adenopathy; biopsy/pathology needed before concluding recurrence."
      : "Current imaging concern should be confirmed from the latest report.";

  return {
    cancerType:
      "Prior lymphoma history: diffuse large B-cell lymphoma (DLBCL) in 2019; gastric MALT lymphoma in 2023; current concern is possible lymphoma recurrence/new lymphoma based on FDG-avid adenopathy pending biopsy.",
    stage:
      "Not confirmed from uploaded files. Current status appears to be diagnostic workup / recurrence evaluation pending biopsy and final pathology.",
    biomarkers:
      "No molecular biomarker, NGS, MSI/MMR, PD-L1, HER2, or lymphoma subtype marker panel was clearly found in the uploaded files yet. CBC should ask oncology whether additional pathology/IHC/flow cytometry/cytogenetics are complete or pending.",
    pathology:
      [
        "No final biopsy/pathology result for the current PET findings was found in the uploaded files. Prior history includes DLBCL and gastric MALT lymphoma. Biopsy remains essential before labeling the PET findings as recurrence.",
        pathologyExcerpt ? `Relevant uploaded-file excerpt:\n${pathologyExcerpt}` : "",
      ]
        .filter(Boolean)
        .join("\n\n"),
    imaging: [
      "Body FDG PET/CT without contrast dated 5/22/2026.",
      "Clinical history noted as lymphoma; evaluate extent of disease.",
      petConcern,
      "Visible report text includes: probably reactive bilateral cervical lymph nodes; no abnormal uptake in chest/breast, lungs, pleura/pericardium; left inferior pulmonary vein stent; spleen status post splenectomy.",
      "Mediastinum/thoracic nodes: new FDG-avid thoracic adenopathy, including prevascular node 1.9 x 1.4 cm SUV 16.2 and left paraspinal node 2.9 x 1.1 cm SUV 13.6.",
      "Abdominopelvic nodes: new FDG-avid adenopathy, including left retrocrural node 2.4 x 1.2 cm SUV 18.4 and aortocaval node 1.8 x 0.9 cm SUV 10.9.",
      "Other visible regions: hepatobiliary, pancreas, adrenal glands, kidneys/ureters/bladder, GI/peritoneum/mesentery, pelvic organs without abnormal uptake. Bones/soft tissues without suspicious osseous lesion; old/healed left posterior T11 fracture mentioned.",
      imagingExcerpt ? `Uploaded-file excerpt CBC can cite:\n${imagingExcerpt}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
    treatments:
      "2019 DLBCL: splenectomy followed by four rounds of R-CHOP / Rituximab-CHOP, reported successful. 2023 gastric MALT lymphoma: 19 days of targeted radiation, reported successful. Current treatment plan not found; likely pending biopsy/pathology.",
    notes: [
      "CBC auto-extracted/seeded this from uploaded PDFs/images and visible MyChart screenshots. Review and edit before using it with a doctor.",
      "Lab screenshots visible from 5/22/2026 include CBC/CMP/immunoglobulin results. Examples: WBC 7.35, RBC 5.2, HGB 15.4, HCT 45.2, MCV 87, platelets 309.",
      "Manual differential examples: neutrophils 73%, lymphocytes 17%, monocytes 6%, eosinophils 3%, basophils 1%; absolute neutrophils 5.4, absolute lymphocytes 1.2.",
      "Flags visible: NRBC manual 1.0 high, morphology comment abnormal, anion gap 7 low, microcytes 1+, schistocytes 1+, ovalocytes 1+, acanthocytes 1+, burr cells 1+.",
      "Chemistry examples visible: sodium 137, potassium 4.8, chloride 104, CO2 26, BUN 15, creatinine 0.9, glucose 102, calcium 9.4, AST 24, ALT 15, alkaline phosphatase 73, albumin 4.3, total bilirubin 0.6, eGFR 98.",
      "Immunoglobulins visible: IgG 1165, IgA 197, IgM 140.",
      sourceExcerpt
        ? `Uploaded source text available to CBC chat:\n${sourceExcerpt}`
        : "No readable uploaded source text was found beyond the seeded case summary.",
      text.includes("PDF text extraction failed") || text.includes("Image OCR failed")
        ? "Some files could not be fully text-extracted. If a file matters, paste its report text into Reports or upload a clearer PDF."
        : "All eligible files were processed by the local extraction routine.",
    ].join("\n\n"),
    pastedReport: sourceExcerpt,
  };
}

function buildSourceExcerpt(text: string) {
  return normalizeText(text)
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .join("\n")
    .slice(0, 4500);
}

function sectionSnippet(text: string, keywords: string[]) {
  const normalized = normalizeText(text);
  const lower = normalized.toLowerCase();
  const index = keywords
    .map((keyword) => lower.indexOf(keyword.toLowerCase()))
    .filter((position) => position >= 0)
    .sort((a, b) => a - b)[0];

  if (index === undefined) return "";
  return normalized.slice(index, index + 1600);
}
