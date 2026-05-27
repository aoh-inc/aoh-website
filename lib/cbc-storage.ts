import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { envValue, getSupabaseSecretKey } from "@/lib/getmefound-env";

export type CbcStoredFile = {
  id: string;
  name: string;
  path: string;
  type: "pdf" | "image";
  contentType: string;
  uploadedAt: string;
  sizeBytes: number;
};

export type CbcStoredFileDownload = CbcStoredFile & {
  buffer: Buffer;
};

const CBC_BUCKET = "cbc-medical-files";
const CBC_PREFIX = "mark-egidio";
const MAX_FILE_BYTES = 20 * 1024 * 1024;
const ALLOWED_EXTENSIONS = new Set([".pdf", ".png", ".jpg", ".jpeg", ".webp"]);
const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
]);

let bucketReady = false;
let cachedClient: SupabaseClient | null = null;

export function hasCbcStorageConfig() {
  return Boolean(envValue("NEXT_PUBLIC_SUPABASE_URL") && getSupabaseSecretKey());
}

export async function listCbcStoredFiles(): Promise<CbcStoredFile[]> {
  const client = await getReadyStorageClient();
  const { data, error } = await client.storage.from(CBC_BUCKET).list(CBC_PREFIX, {
    limit: 1000,
    offset: 0,
    sortBy: { column: "created_at", order: "asc" },
  });

  if (error) throw new Error(error.message);

  return (data ?? [])
    .filter((item) => item.name && ALLOWED_EXTENSIONS.has(fileExtension(item.name)))
    .map((item) => {
      const path = `${CBC_PREFIX}/${item.name}`;
      const contentType = String(item.metadata?.mimetype ?? mimeFromName(item.name));
      return {
        id: item.id ?? path,
        name: item.name,
        path,
        type: inferCbcFileType(item.name),
        contentType,
        uploadedAt: item.created_at ?? item.updated_at ?? new Date().toISOString(),
        sizeBytes: Number(item.metadata?.size ?? 0),
      };
    });
}

export async function uploadCbcStoredFiles(files: File[], existingNames: Set<string>) {
  const client = await getReadyStorageClient();
  const uploaded: string[] = [];
  const skipped: string[] = [];
  const rejected: string[] = [];

  const stored = await listCbcStoredFiles().catch(() => []);
  const known = new Set([
    ...Array.from(existingNames, (name) => name.toLowerCase()),
    ...stored.map((file) => file.name.toLowerCase()),
  ]);

  for (const file of files) {
    const safeName = safeCbcFileName(file.name);
    const extension = fileExtension(safeName);
    const contentType = file.type || mimeFromName(safeName);

    if (!safeName || !ALLOWED_EXTENSIONS.has(extension) || !ALLOWED_MIME_TYPES.has(contentType)) {
      rejected.push(file.name);
      continue;
    }

    if (file.size <= 0 || file.size > MAX_FILE_BYTES) {
      rejected.push(file.name);
      continue;
    }

    if (known.has(safeName.toLowerCase()) || known.has(file.name.toLowerCase())) {
      skipped.push(file.name);
      continue;
    }

    const path = `${CBC_PREFIX}/${safeName}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error } = await client.storage.from(CBC_BUCKET).upload(path, buffer, {
      contentType,
      upsert: false,
    });

    if (error) {
      if (error.message.toLowerCase().includes("already exists")) {
        skipped.push(file.name);
        known.add(safeName.toLowerCase());
      } else {
        rejected.push(file.name);
      }
      continue;
    }

    uploaded.push(file.name);
    known.add(safeName.toLowerCase());
  }

  return { uploaded, skipped, rejected };
}

export async function downloadCbcStoredFile(file: CbcStoredFile): Promise<CbcStoredFileDownload> {
  const client = await getReadyStorageClient();
  const { data, error } = await client.storage.from(CBC_BUCKET).download(file.path);
  if (error) throw new Error(error.message);
  if (!data) throw new Error(`CBC could not download ${file.name}.`);

  return {
    ...file,
    buffer: Buffer.from(await data.arrayBuffer()),
  };
}

async function getReadyStorageClient() {
  const client = getCbcStorageClient();
  await ensureCbcBucket(client);
  return client;
}

function getCbcStorageClient() {
  if (cachedClient) return cachedClient;

  const url = supabaseClientUrl(envValue("NEXT_PUBLIC_SUPABASE_URL"));
  const key = getSupabaseSecretKey();
  if (!url || !key) {
    throw new Error("CBC upload storage is not configured.");
  }

  cachedClient = createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  return cachedClient;
}

function supabaseClientUrl(rawUrl: string) {
  return rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
}

async function ensureCbcBucket(client: SupabaseClient) {
  if (bucketReady) return;

  const existing = await client.storage.getBucket(CBC_BUCKET);
  if (!existing.error) {
    bucketReady = true;
    return;
  }

  const created = await client.storage.createBucket(CBC_BUCKET, {
    public: false,
    fileSizeLimit: MAX_FILE_BYTES,
    allowedMimeTypes: Array.from(ALLOWED_MIME_TYPES),
  });

  if (created.error && !created.error.message.toLowerCase().includes("already exists")) {
    throw new Error(created.error.message);
  }

  bucketReady = true;
}

function inferCbcFileType(name: string): "pdf" | "image" {
  return fileExtension(name) === ".pdf" ? "pdf" : "image";
}

function mimeFromName(name: string) {
  switch (fileExtension(name)) {
    case ".pdf":
      return "application/pdf";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    default:
      return "image/jpeg";
  }
}

function fileExtension(name: string) {
  const dotIndex = name.lastIndexOf(".");
  return dotIndex === -1 ? "" : name.slice(dotIndex).toLowerCase();
}

function safeCbcFileName(name: string) {
  const cleaned = name
    .normalize("NFKD")
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "_")
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_+/g, "_")
    .trim();
  return cleaned.slice(0, 180);
}
