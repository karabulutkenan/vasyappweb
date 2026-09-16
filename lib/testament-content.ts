/**
 * Flutter `vasy_will_v1` content format (live Supabase):
 * {
 *   v: "vasy_will_v1",
 *   text: string,
 *   quill_delta_json?: string,
 *   attachment_paths?: string[],  // often Android local cache paths today
 *   guardian_id?: string
 * }
 */

export type MediaKind = "image" | "video" | "audio" | "pdf" | "file";

export type ResolvedMedia = {
  id: string;
  kind: MediaKind;
  fileName: string;
  /** Playable http(s) URL when available */
  url: string | null;
  /** True when path is device-local / unresolved storage */
  unavailable: boolean;
  unavailableReason: string | null;
  title: string;
};

export type TestamentContentBlock =
  | {
      id: string;
      type: "text";
      text: string;
      title?: string;
    }
  | ({
      type: "image" | "video" | "audio" | "pdf" | "file";
    } & ResolvedMedia);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asTrimmedString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function isSafeHttpUrl(raw: string): boolean {
  try {
    const url = new URL(raw);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function fileNameFromPath(path: string): string {
  const cleaned = path.replace(/\\/g, "/");
  const parts = cleaned.split("/").filter(Boolean);
  return parts[parts.length - 1] || "dosya";
}

export function detectMediaKind(pathOrName: string): MediaKind {
  const lower = pathOrName.toLowerCase();
  if (/\.(png|jpe?g|gif|webp|avif|heic|bmp)(\?|$)/.test(lower)) {
    return "image";
  }
  if (/\.(mp4|webm|mov|m4v|mkv)(\?|$)/.test(lower)) {
    return "video";
  }
  if (/\.(mp3|wav|ogg|m4a|aac|flac)(\?|$)/.test(lower)) {
    return "audio";
  }
  if (/\.pdf(\?|$)/.test(lower)) {
    return "pdf";
  }
  return "file";
}

export function isDeviceLocalPath(path: string): boolean {
  const lower = path.toLowerCase();
  return (
    lower.startsWith("/data/user/") ||
    lower.startsWith("/storage/") ||
    lower.startsWith("file:") ||
    lower.includes("/cache/") ||
    lower.includes("com.example.vasyapp")
  );
}

/** Relative storage object path (bucket/path or path only). */
export function looksLikeStorageObjectPath(path: string): boolean {
  if (isSafeHttpUrl(path) || isDeviceLocalPath(path)) {
    return false;
  }
  const cleaned = path.replace(/^\/+/, "");
  return cleaned.includes("/") || /\.[a-z0-9]+$/i.test(cleaned);
}

export function formatFileSize(bytes: number | undefined): string | null {
  if (bytes === undefined || !Number.isFinite(bytes) || bytes < 0) {
    return null;
  }
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function extractPreviewText(blocks: TestamentContentBlock[]): string | null {
  const textBlock = blocks.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    return null;
  }
  return textBlock.text;
}

type UrlResolver = (objectPath: string) => Promise<string | null>;

async function resolveAttachment(
  path: string,
  index: number,
  resolveStorageUrl?: UrlResolver,
): Promise<TestamentContentBlock> {
  const fileName = fileNameFromPath(path);
  const kind = detectMediaKind(fileName || path);
  const id = `${kind}-${index}`;
  const title =
    kind === "image"
      ? "Fotoğraf"
      : kind === "video"
        ? "Video"
        : kind === "audio"
          ? "Ses kaydı"
          : kind === "pdf"
            ? "PDF belgesi"
            : "Dosya";

  if (isSafeHttpUrl(path)) {
    return {
      id,
      type: kind,
      kind,
      fileName,
      url: path,
      unavailable: false,
      unavailableReason: null,
      title: fileName,
    };
  }

  if (isDeviceLocalPath(path)) {
    return {
      id,
      type: kind,
      kind,
      fileName,
      url: null,
      unavailable: true,
      unavailableReason:
        "Bu dosya henüz buluta yüklenmemiş. Mobil uygulama yalnızca cihaz yolunu kaydetmiş.",
      title: fileName,
    };
  }

  if (looksLikeStorageObjectPath(path) && resolveStorageUrl) {
    const url = await resolveStorageUrl(path.replace(/^\/+/, ""));
    if (url) {
      return {
        id,
        type: kind,
        kind,
        fileName,
        url,
        unavailable: false,
        unavailableReason: null,
        title: fileName,
      };
    }
  }

  return {
    id,
    type: kind,
    kind,
    fileName,
    url: null,
    unavailable: true,
    unavailableReason: "Dosya adresi çözülemedi.",
    title: fileName || title,
  };
}

export async function parseTestamentContent(
  content: string | null,
  resolveStorageUrl?: UrlResolver,
): Promise<TestamentContentBlock[]> {
  if (!content) {
    return [];
  }

  const trimmed = content.trim();
  if (!trimmed) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(trimmed);

    if (typeof parsed === "string") {
      const text = parsed.trim();
      return text ? [{ id: "text-0", type: "text", text }] : [];
    }

    if (!isRecord(parsed)) {
      return [{ id: "text-0", type: "text", text: trimmed }];
    }

    const blocks: TestamentContentBlock[] = [];

    const text =
      asTrimmedString(parsed.text) ??
      asTrimmedString(parsed.body) ??
      asTrimmedString(parsed.message);

    if (text) {
      blocks.push({
        id: "text-0",
        type: "text",
        text,
        title: asTrimmedString(parsed.title) ?? "Mesaj",
      });
    }

    const attachments = parsed.attachment_paths;
    if (Array.isArray(attachments)) {
      let index = 0;
      for (const item of attachments) {
        if (typeof item !== "string" || !item.trim()) {
          continue;
        }
        blocks.push(
          await resolveAttachment(item.trim(), index++, resolveStorageUrl),
        );
      }
    }

    return blocks;
  } catch {
    return [{ id: "text-0", type: "text", text: trimmed }];
  }
}
