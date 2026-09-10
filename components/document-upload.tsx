"use client";

import { FormEvent, useRef, useState } from "react";
import { MAX_PDF_SIZE_BYTES, MAX_PDF_SIZE_LABEL } from "@/lib/constants";
import { isPdfFile, isValidTckn, sanitizeDigits } from "@/lib/validation";
import { AppButton } from "@/components/ui/button";
import { IconWell } from "@/components/ui/icon-well";
import { MaterialIcon } from "@/components/ui/material-icon";
import { PillField } from "@/components/ui/pill-field";

type DocumentUploadProps = {
  vasiTckn: string;
  isSubmitting: boolean;
  onSubmit: (values: { file: File; vasiyetSahibiTckn: string }) => Promise<void>;
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
  vasiTckn,
  isSubmitting,
  onSubmit,
  onError,
}: DocumentUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [vasiyetSahibiTckn, setVasiyetSahibiTckn] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

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
    setLocalError(null);

    const ownerTckn = sanitizeDigits(vasiyetSahibiTckn);

    if (!isValidTckn(ownerTckn)) {
      setLocalError("Vasiyet sahibi T.C. Kimlik Numarası 11 haneli ve geçerli olmalıdır.");
      return;
    }

    if (ownerTckn === vasiTckn) {
      setLocalError("Vasiyet sahibi kimliği vasi kimliğinden farklı olmalıdır.");
      return;
    }

    if (!file) {
      onError("Lütfen Formül C / Ölüm Belgesi PDF dosyasını yükleyin.");
      return;
    }

    await onSubmit({ file, vasiyetSahibiTckn: ownerTckn });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.8px] text-outline">
          Vasiyet sahibi
        </p>
        <label htmlFor="vasiyet-sahibi-tckn" className="sr-only">
          Vasiyet Sahibi T.C. Kimlik Numarası
        </label>
        <PillField
          id="vasiyet-sahibi-tckn"
          icon="person"
          name="vasiyetSahibiTckn"
          inputMode="numeric"
          autoComplete="off"
          maxLength={11}
          value={vasiyetSahibiTckn}
          disabled={isSubmitting}
          error={Boolean(localError)}
          aria-invalid={localError ? true : undefined}
          placeholder="Vasiyet sahibi T.C. Kimlik No"
          onChange={(event) => {
            setVasiyetSahibiTckn(event.target.value.replace(/\D/g, "").slice(0, 11));
            setLocalError(null);
          }}
        />
      </div>

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
          className={`rounded-card-md bg-field px-5 py-8 text-center transition-colors ${
            isDragging ? "bg-primary-container" : ""
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

      {localError ? (
        <p className="px-2 text-[14px] font-bold leading-[1.35] text-error-text" role="alert">
          {localError}
        </p>
      ) : null}

      <div className="pt-1">
        <AppButton
          type="submit"
          icon="send"
          loading={isSubmitting}
          disabled={isSubmitting || !file || vasiyetSahibiTckn.length !== 11}
        >
          {isSubmitting ? "GÖNDERİLİYOR" : "SİSTEME GÖNDER!"}
        </AppButton>
      </div>
    </form>
  );
}
