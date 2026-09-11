"use client";

import { FormEvent, useRef, useState } from "react";
import { AuthShell } from "@/components/ui/auth-shell";
import { AppButton } from "@/components/ui/button";
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
    <AuthShell eyebrow="BELGE DOĞRULAMA TESTİ">
        <p className="mb-4 text-[15px] font-semibold leading-[1.4] text-auth-helper">
          Geçici n8n testi: vasiyet sahibi TCKN + PDF gönderilir. Mobil doğrulama
          akışından bağımsızdır.
        </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="n8n-tckn"
            className="mb-1.5 block text-sm font-semibold text-white"
          >
            Vasiyet sahibi T.C. Kimlik No
          </label>
          <input
            id="n8n-tckn"
            inputMode="numeric"
            maxLength={11}
            value={tckn}
            disabled={isSubmitting}
            onChange={(event) => {
              setTckn(event.target.value.replace(/\D/g, "").slice(0, 11));
              setResult(null);
            }}
            placeholder="11 haneli TCKN"
            className="h-12 w-full rounded-2xl border-0 bg-white px-4 text-[15px] tracking-[0.14em] text-header outline-none"
          />
        </div>

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
          className={`rounded-3xl border-2 border-dashed px-4 py-8 text-center transition ${
            isDragging
              ? "border-white bg-white/20"
              : "border-white/50 bg-white/10"
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
          <label htmlFor="n8n-pdf" className="block cursor-pointer text-white">
            <span className="block font-semibold">PDF yükle / sürükle-bırak</span>
            <span className="mt-1 block text-sm text-white/80">
              Max {MAX_PDF_SIZE_LABEL}
            </span>
          </label>
        </div>

        {file ? (
          <div className="rounded-2xl bg-white/95 px-4 py-3 text-sm text-header">
            <p className="truncate font-medium">{file.name}</p>
            <button
              type="button"
              className="mt-1 text-sm font-semibold text-logout"
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
            className={`rounded-2xl px-3 py-2 text-sm ${
              result.tone === "success"
                ? "bg-emerald-50 text-emerald-900"
                : "bg-rose-50 text-rose-900"
            }`}
          >
            {result.message}
          </p>
        ) : null}

        <AppButton
          type="submit"
          variant="primary"
          loading={isSubmitting}
          disabled={!file || tckn.length !== 11}
        >
          n8n’e gönder
        </AppButton>
      </form>

      <p className="mt-4 break-all text-center text-[11px] leading-5 text-white/70">
        Hedef: {N8N_TEST_WEBHOOK_DISPLAY}
      </p>
    </AuthShell>
  );
}
