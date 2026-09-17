"use client";

import { FormEvent, useRef, useState } from "react";
import { AppButton } from "@/components/ui/button";
import { MaterialIcon } from "@/components/ui/material-icon";
import { MAX_PDF_SIZE_BYTES, MAX_PDF_SIZE_LABEL } from "@/lib/constants";
import { isPdfFile } from "@/lib/validation";

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
        className={`rounded-[28px] px-5 py-9 text-center transition ${
          isDragging
            ? "bg-header/90 ring-2 ring-primary"
            : "bg-header shadow-[0_18px_40px_rgba(52,73,94,0.28)]"
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
        <label htmlFor="pdf-upload" className="block cursor-pointer text-white">
          <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/15">
            <MaterialIcon name="badge" size={24} className="text-white" />
          </span>
          <span className="block text-[16px] font-extrabold">
            Formül C / Ölüm Belgesi Yükle
          </span>
          <span className="mt-2 block text-[13px] font-semibold leading-[1.45] text-white/85">
            Pdf dosyasını sürükleyip bırakın ya da seçmek için dokunun.
            <br />
            En fazla {MAX_PDF_SIZE_LABEL} ve yalnızca Pdf dosyası.
          </span>
        </label>
      </div>

      {file ? (
        <div className="flex items-center gap-3 rounded-[22px] border border-white/55 bg-white/70 px-3.5 py-3 backdrop-blur-md">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-heart/15 text-heart">
            <MaterialIcon name="check_circle" filled size={22} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-extrabold text-header">
              {file.name}
            </p>
            <p className="text-[12px] font-semibold text-outline">
              {formatSize(file.size)}
            </p>
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

      <AppButton
        type="submit"
        variant="accent"
        loading={isSubmitting}
        disabled={isSubmitting || !file}
      >
        {isSubmitting ? "GÖNDERİLİYOR" : "SİSTEME GÖNDER"}
      </AppButton>
    </form>
  );
}
