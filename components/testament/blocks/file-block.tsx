import { MaterialIcon } from "@/components/ui/material-icon";
import { formatFileSize } from "@/lib/testament-content";

type FileBlockProps = {
  url: string;
  kind: "pdf" | "file";
  name: string;
  mimeType?: string;
  sizeBytes?: number;
  title?: string;
};

function typeLabel(kind: "pdf" | "file", mimeType?: string): string {
  if (kind === "pdf") {
    return "PDF";
  }
  if (mimeType?.includes("word") || mimeType?.includes("document")) {
    return "Belge";
  }
  if (mimeType?.includes("sheet") || mimeType?.includes("excel")) {
    return "Tablo";
  }
  if (mimeType?.includes("zip") || mimeType?.includes("compressed")) {
    return "Arşiv";
  }
  return "Dosya";
}

export function FileBlock({
  url,
  kind,
  name,
  mimeType,
  sizeBytes,
  title,
}: FileBlockProps) {
  const sizeLabel = formatFileSize(sizeBytes);
  const label = typeLabel(kind, mimeType);
  const meta = [label, sizeLabel].filter(Boolean).join(" · ");

  return (
    <section className="flex w-full flex-col gap-4 rounded-[22px] border border-header/10 bg-white p-4 shadow-[0_10px_30px_rgba(52,73,94,0.06)] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-chip text-header">
          <MaterialIcon
            name={kind === "pdf" ? "picture_as_pdf" : "draft"}
            size={26}
          />
        </span>
        <div className="min-w-0">
          <p className="truncate text-[15px] font-extrabold text-header">
            {title || name}
          </p>
          <p className="mt-1 text-[13px] font-semibold text-outline">{meta}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 sm:shrink-0">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center justify-center rounded-pill bg-header px-4 text-[14px] font-bold text-white transition hover:bg-header-hover"
        >
          Görüntüle
        </a>
        <a
          href={url}
          download={name}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center justify-center rounded-pill border border-header/20 bg-canvas px-4 text-[14px] font-bold text-header transition hover:bg-header/[0.04]"
        >
          İndir
        </a>
      </div>
    </section>
  );
}
