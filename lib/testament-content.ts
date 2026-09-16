/**
 * Testament content parsing.
 *
 * Confirmed production shape today:
 * - content: string JSON `{ "text": "..." }` OR plain text
 *
 * Optional / forward-compatible shapes (rendered only if present):
 * - blocks / items / media / attachments arrays with type + url fields
 * - images / videos / audios / files / links arrays
 *
 * Does not invent DB columns or storage paths.
 */

export type TestamentContentBlock =
  | {
      id: string;
      type: "text";
      text: string;
      title?: string;
    }
  | {
      id: string;
      type: "image";
      url: string;
      title?: string;
      description?: string;
      alt?: string;
    }
  | {
      id: string;
      type: "video";
      url: string;
      title?: string;
      description?: string;
      poster?: string;
    }
  | {
      id: string;
      type: "audio";
      url: string;
      title?: string;
      description?: string;
    }
  | {
      id: string;
      type: "pdf" | "file";
      url: string;
      name?: string;
      mimeType?: string;
      sizeBytes?: number;
      title?: string;
    }
  | {
      id: string;
      type: "link";
      url: string;
      title?: string;
      description?: string;
    };

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

function asNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

/** Only allow http(s) media/download URLs. */
export function isSafeHttpUrl(raw: string): boolean {
  try {
    const url = new URL(raw);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function readUrl(record: Record<string, unknown>): string | undefined {
  const candidates = [
    record.url,
    record.src,
    record.href,
    record.path,
    record.publicUrl,
    record.public_url,
    record.fileUrl,
    record.file_url,
  ];

  for (const candidate of candidates) {
    const value = asTrimmedString(candidate);
    if (value && isSafeHttpUrl(value)) {
      return value;
    }
  }

  return undefined;
}

function normalizeType(raw: unknown, url?: string, mime?: string): string {
  const explicit = asTrimmedString(raw)?.toLowerCase();
  if (explicit) {
    if (["text", "message", "note", "letter"].includes(explicit)) {
      return "text";
    }
    if (["image", "photo", "picture", "img"].includes(explicit)) {
      return "image";
    }
    if (["video", "movie"].includes(explicit)) {
      return "video";
    }
    if (["audio", "voice", "sound"].includes(explicit)) {
      return "audio";
    }
    if (["pdf", "document"].includes(explicit)) {
      return explicit === "pdf" || mime?.includes("pdf") ? "pdf" : "file";
    }
    if (["file", "attachment", "document"].includes(explicit)) {
      return mime?.includes("pdf") || url?.toLowerCase().endsWith(".pdf")
        ? "pdf"
        : "file";
    }
    if (["link", "url", "website"].includes(explicit)) {
      return "link";
    }
  }

  const mimeType = mime?.toLowerCase() ?? "";
  if (mimeType.startsWith("image/")) {
    return "image";
  }
  if (mimeType.startsWith("video/")) {
    return "video";
  }
  if (mimeType.startsWith("audio/")) {
    return "audio";
  }
  if (mimeType.includes("pdf") || url?.toLowerCase().includes(".pdf")) {
    return "pdf";
  }

  if (url) {
    const lower = url.toLowerCase();
    if (/\.(png|jpe?g|gif|webp|avif|svg)(\?|$)/.test(lower)) {
      return "image";
    }
    if (/\.(mp4|webm|mov|m4v)(\?|$)/.test(lower)) {
      return "video";
    }
    if (/\.(mp3|wav|ogg|m4a|aac)(\?|$)/.test(lower)) {
      return "audio";
    }
    if (/\.pdf(\?|$)/.test(lower)) {
      return "pdf";
    }
  }

  return "file";
}

function toBlock(
  value: unknown,
  index: number,
  fallbackType?: string,
): TestamentContentBlock | null {
  if (typeof value === "string") {
    const text = value.trim();
    if (!text) {
      return null;
    }
    return { id: `text-${index}`, type: "text", text };
  }

  if (!isRecord(value)) {
    return null;
  }

  const mimeType = asTrimmedString(value.mimeType ?? value.mime_type ?? value.contentType);
  const url = readUrl(value);
  const title = asTrimmedString(value.title ?? value.name ?? value.label);
  const description = asTrimmedString(
    value.description ?? value.caption ?? value.subtitle,
  );
  const text =
    asTrimmedString(value.text) ??
    asTrimmedString(value.body) ??
    asTrimmedString(value.message) ??
    asTrimmedString(value.content);

  const type = normalizeType(
    value.type ?? value.kind ?? fallbackType,
    url,
    mimeType,
  );

  if (type === "text") {
    if (!text) {
      return null;
    }
    return {
      id: `text-${index}`,
      type: "text",
      text,
      title,
    };
  }

  if (!url) {
    // Text-only object without type still usable
    if (text) {
      return { id: `text-${index}`, type: "text", text, title };
    }
    return null;
  }

  if (type === "image") {
    return {
      id: `image-${index}`,
      type: "image",
      url,
      title,
      description,
      alt: asTrimmedString(value.alt) ?? title ?? "Vasiyet fotoğrafı",
    };
  }

  if (type === "video") {
    return {
      id: `video-${index}`,
      type: "video",
      url,
      title,
      description,
      poster: (() => {
        const poster = asTrimmedString(value.poster ?? value.thumbnail ?? value.thumb);
        return poster && isSafeHttpUrl(poster) ? poster : undefined;
      })(),
    };
  }

  if (type === "audio") {
    return {
      id: `audio-${index}`,
      type: "audio",
      url,
      title,
      description,
    };
  }

  if (type === "link") {
    return {
      id: `link-${index}`,
      type: "link",
      url,
      title: title ?? url,
      description,
    };
  }

  if (type === "pdf") {
    return {
      id: `pdf-${index}`,
      type: "pdf",
      url,
      name: title ?? asTrimmedString(value.fileName ?? value.file_name) ?? "Belge.pdf",
      mimeType: mimeType ?? "application/pdf",
      sizeBytes: asNumber(value.size ?? value.sizeBytes ?? value.size_bytes),
      title,
    };
  }

  return {
    id: `file-${index}`,
    type: "file",
    url,
    name: title ?? asTrimmedString(value.fileName ?? value.file_name) ?? "Dosya",
    mimeType,
    sizeBytes: asNumber(value.size ?? value.sizeBytes ?? value.size_bytes),
    title,
  };
}

function pushUnique(
  target: TestamentContentBlock[],
  block: TestamentContentBlock | null,
) {
  if (!block) {
    return;
  }
  target.push(block);
}

function parseArray(
  value: unknown,
  fallbackType: string | undefined,
  startIndex: number,
): TestamentContentBlock[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const blocks: TestamentContentBlock[] = [];
  value.forEach((item, offset) => {
    pushUnique(blocks, toBlock(item, startIndex + offset, fallbackType));
  });
  return blocks;
}

export function parseTestamentContent(
  content: string | null,
): TestamentContentBlock[] {
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

    if (Array.isArray(parsed)) {
      return parseArray(parsed, undefined, 0);
    }

    if (!isRecord(parsed)) {
      return [{ id: "text-0", type: "text", text: trimmed }];
    }

    const blocks: TestamentContentBlock[] = [];
    let index = 0;

    const rootText =
      asTrimmedString(parsed.text) ??
      asTrimmedString(parsed.body) ??
      asTrimmedString(parsed.message) ??
      asTrimmedString(parsed.letter);

    if (rootText) {
      pushUnique(blocks, {
        id: `text-${index++}`,
        type: "text",
        text: rootText,
        title: asTrimmedString(parsed.title),
      });
    }

    const nestedKeys: Array<{ key: string; fallback?: string }> = [
      { key: "blocks" },
      { key: "items" },
      { key: "content" },
      { key: "media" },
      { key: "attachments" },
      { key: "images", fallback: "image" },
      { key: "photos", fallback: "image" },
      { key: "videos", fallback: "video" },
      { key: "audios", fallback: "audio" },
      { key: "audio", fallback: "audio" },
      { key: "files", fallback: "file" },
      { key: "documents", fallback: "file" },
      { key: "links", fallback: "link" },
    ];

    for (const { key, fallback } of nestedKeys) {
      const nested = parsed[key];
      if (nested === undefined) {
        continue;
      }
      // Avoid re-parsing root `content` string if it was the whole JSON source
      if (key === "content" && typeof nested === "string") {
        continue;
      }
      const parsedNested = parseArray(nested, fallback, index);
      parsedNested.forEach((block) => {
        blocks.push({ ...block, id: `${block.type}-${index++}` });
      });
    }

    if (blocks.length > 0) {
      return blocks;
    }

    // Unknown JSON object without usable fields — do not dump raw JSON to UI
    return [];
  } catch {
    return [{ id: "text-0", type: "text", text: trimmed }];
  }
}

export function extractPreviewText(blocks: TestamentContentBlock[]): string | null {
  const textBlock = blocks.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    return null;
  }
  return textBlock.text;
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
