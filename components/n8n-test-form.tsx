"use client";

import { FormEvent, useRef, useState } from "react";
import { AuthShell } from "@/components/ui/auth-shell";
import { AppButton } from "@/components/ui/button";
import { IconWell } from "@/components/ui/icon-well";
import { MaterialIcon } from "@/components/ui/material-icon";
import { PillField } from "@/components/ui/pill-field";
import {
  MAX_PDF_SIZE_BYTES,
  MAX_PDF_SIZE_LABEL,
  N8N_TEST_WEBHOOK_DISPLAY,
} from "@/lib/constants";
import { isPdfFile, isValidTckn, sanitizeDigits } from "@/lib/validation";

type ResultState =
  | { tone: "success" | "error"; message: string }
  | null;

export function N8nTestForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [tckn, setTckn] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<ResultState>(null);

  function acceptFile(nextFile: File | undefined) {
    if (!nextFile) {
      return;
    }

    if (!isPdfFile(nextFile)) {
      setFile(null);
      setResult({ tone: "error", message: "Yalnızca PDF kabul edilir." });
      return;
    }

    if (nextFile.size > MAX_PDF_SIZE_BYTES) {
      setFile(null);
      setResult({
        tone: "error",
        message: `Dosya boyutu ${MAX_PDF_SIZE_LABEL} sınırını aşıyor.`,
      });
      return;
    }

    setFile(nextFile);
    setResult(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(null);

    const cleaned = sanitizeDigits(tckn);
    if (!isValidTckn(cleaned)) {
      setResult({
        tone: "error",
        message: "T.C. Kimlik Numarası 11 haneli ve geçerli olmalıdır.",
      });
      return;
    }

    if (!file) {
      setResult({ tone: "error", message: "PDF dosyası seçin." });
      return;
    }

    const formData = new FormData();
    formData.append("tckn", cleaned);
    formData.append("file", file, file.name);

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/n8n-test", {
        method: "POST",
        body: formData,
      });
      const payload = (await response.json()) as {
        ok: boolean;
        message: string;
      };

      setResult({
        tone: payload.ok ? "success" : "error",
        message: payload.message,
      });
    } catch {
      setResult({
        tone: "error",
        message: "İstek gönderilemedi. Sunucu / n8n erişimini kontrol edin.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell
      eyebrow="BELGE DOĞRULAMA TESTİ"
      description="Geçici n8n testi: vasiyet sahibi TCKN + PDF gönderilir. Mobil doğrulama akışından bağımsızdır."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <PillField
          id="n8n-tckn"
          icon="badge"
          label="Vasiyet sahibi T.C. Kimlik No"
          inputMode="numeric"
          maxLength={11}
          value={tckn}
          disabled={isSubmitting}
          placeholder="11 haneli TCKN"
          onChange={(event) => {
            setTckn(event.target.value.replace(/\D/g, "").slice(0, 11));
            setResult(null);
          }}
        />

        <div>
          <p className="mb-2 px-0.5 text-[13px] font-bold text-header">Belge</p>
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
              id="n8n-pdf"
              type="file"
              accept="application/pdf,.pdf"
              className="sr-only"
              disabled={isSubmitting}
              onChange={(event) => acceptFile(event.target.files?.[0])}
            />
            <label htmlFor="n8n-pdf" className="block cursor-pointer">
              <span className="mx-auto mb-3 flex justify-center">
                <IconWell>
                  <MaterialIcon name="picture_as_pdf" size={22} />
                </IconWell>
              </span>
              <span className="block text-[15px] font-extrabold text-header">
                PDF yükle / sürükle-bırak
              </span>
              <span className="mt-1 block text-[12px] font-semibold text-outline">
                En fazla {MAX_PDF_SIZE_LABEL}, yalnızca PDF
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
              <p className="truncate text-[15px] font-extrabold text-header">
                {file.name}
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

        {result ? (
          <p
            role="alert"
            className={`rounded-card-sm px-3.5 py-3 text-[14px] font-bold ${
              result.tone === "success"
                ? "bg-approved text-header"
                : "bg-[#FDECEC] text-error-text"
            }`}
          >
            {result.message}
          </p>
        ) : null}

        <AppButton
          type="submit"
          loading={isSubmitting}
          disabled={!file || tckn.length !== 11}
        >
          {isSubmitting ? "GÖNDERİLİYOR" : "N8N’E GÖNDER!"}
        </AppButton>

        <p className="break-all text-center text-[11px] font-semibold leading-5 text-outline">
          Hedef: {N8N_TEST_WEBHOOK_DISPLAY}
        </p>
      </form>
    </AuthShell>
  );
}
