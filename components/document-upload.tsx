"use client";

import { FormEvent, useRef, useState } from "react";
import { MAX_PDF_SIZE_BYTES, MAX_PDF_SIZE_LABEL } from "@/lib/constants";
import { isPdfFile } from "@/lib/validation";
import { AppButton } from "@/components/ui/button";
import { IconWell } from "@/components/ui/icon-well";
import { MaterialIcon } from "@/components/ui/material-icon";

type DocumentUploadProps = {
  isSubmitting: boolean;
  onSubmit: (values: { file: File }) => Promise<void>;
  onError: (message: string) => void;
};

function formatSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentUpload({
  isSubmitting,
  onSubmit,
  onError,
}: DocumentUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  function acceptFile(nextFile: File | undefined) {
    if (!nextFile) {
      return;
    }

    if (!isPdfFile(nextFile)) {
      setFile(null);
      onError("Yalnızca PDF dosyaları kabul edilir.");
      return;
    }

    if (nextFile.size > MAX_PDF_SIZE_BYTES) {
      setFile(null);
      onError(`Dosya boyutu ${MAX_PDF_SIZE_LABEL} sınırını aşıyor.`);
      return;
    }

    setFile(nextFile);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      onError("Lütfen Formül C / Ölüm Belgesi PDF dosyasını yükleyin.");
      return;
    }

    await onSubmit({ file });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.8px] text-outline">
          Belge
        </p>
        <div
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setIsDragging(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            acceptFile(event.dataTransfer.files[0]);
          }}
          className={`rounded-card-md bg-field px-5 py-8 text-center ring-1 transition-colors ${
            isDragging
              ? "bg-primary-container ring-primary"
              : "ring-secondary-container"
          }`}
        >
          <input
            ref={inputRef}
            id="pdf-upload"
            type="file"
            name="file"
            accept="application/pdf,.pdf"
            className="sr-only"
            disabled={isSubmitting}
            onChange={(event) => acceptFile(event.target.files?.[0])}
          />
          <label htmlFor="pdf-upload" className="block cursor-pointer">
            <span className="mx-auto mb-4 flex justify-center">
              <IconWell>
                <MaterialIcon name="picture_as_pdf" size={22} />
              </IconWell>
            </span>
            <span className="block text-[15px] font-extrabold text-header">
              Formül C / Ölüm Belgesi Yükle
            </span>
            <span className="mt-2 block text-[12px] font-semibold leading-[1.4] text-outline">
              PDF dosyasını sürükleyip bırakın veya seçmek için dokunun.
              <br />
              En fazla {MAX_PDF_SIZE_LABEL}, yalnızca PDF.
            </span>
          </label>
        </div>
      </div>

      {file ? (
        <div className="flex items-center gap-3 rounded-card-sm bg-approved px-3.5 py-3">
          <IconWell className="bg-heart/15 text-heart">
            <MaterialIcon name="check_circle" filled size={22} />
          </IconWell>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-extrabold text-header">{file.name}</p>
            <p className="text-[12px] font-semibold text-outline">{formatSize(file.size)}</p>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-pill px-3 py-1.5 text-[12px] font-bold text-logout hover:bg-logout/8"
            onClick={() => {
              setFile(null);
              if (inputRef.current) {
                inputRef.current.value = "";
              }
            }}
          >
            Kaldır
          </button>
        </div>
      ) : null}

      <div className="pt-1">
        <AppButton
          type="submit"
          icon="send"
          loading={isSubmitting}
          disabled={isSubmitting || !file}
        >
          {isSubmitting ? "GÖNDERİLİYOR" : "SİSTEME GÖNDER!"}
        </AppButton>
      </div>
    </form>
  );
}
