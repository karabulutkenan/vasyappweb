"use client";

import { useCallback, useState } from "react";
import { verifyIdentity } from "@/app/actions/verify-identity";
import { DocumentUpload } from "@/components/document-upload";
import { IdentityForm } from "@/components/identity-form";
import { TestamentViewer } from "@/components/testament/testament-viewer";
import { ToastBanner, type ToastState } from "@/components/toast-banner";
import { AuthShell } from "@/components/ui/auth-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterChip } from "@/components/ui/filter-chip";
import { MaterialIcon } from "@/components/ui/material-icon";
import { PageSheet } from "@/components/ui/page-sheet";
import { ProofOfLifeCard } from "@/components/ui/proof-of-life-card";
import { VerifyingOverlay } from "@/components/verifying-overlay";
import type { DocumentSubmitResult, HeritageItem } from "@/lib/types";
import { toUserFacingMessage } from "@/lib/user-facing-errors";
import { maskTckn } from "@/lib/validation";

type Step = "identity" | "upload" | "results";

type VerifiedSession = {
  token: string;
  vasiTckn: string;
  verificationCode: string;
};

type VerificationPortalProps = {
  token: string | null;
};

function StepChips({ current }: { current: Exclude<Step, "results"> }) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      <FilterChip selected={current === "identity"}>Vasi</FilterChip>
      <FilterChip selected={current === "upload"}>Belge</FilterChip>
    </div>
  );
}

export function VerificationPortal({ token }: VerificationPortalProps) {
  const [step, setStep] = useState<Step>("identity");
  const [session, setSession] = useState<VerifiedSession | null>(null);
  const [items, setItems] = useState<HeritageItem[]>([]);
  const [isVerifyingIdentity, setIsVerifyingIdentity] = useState(false);
  const [isSubmittingDocument, setIsSubmittingDocument] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  const dismissToast = useCallback(() => setToast(null), []);

  async function handleIdentitySubmit(values: {
    vasiTckn: string;
    verificationCode: string;
  }) {
    if (!token) {
      setToast({ tone: "error", message: "Doğrulama bağlantısı geçersiz." });
      return;
    }

    setIsVerifyingIdentity(true);
    try {
      const result = await verifyIdentity({
        token,
        vasiTckn: values.vasiTckn,
        verificationCode: values.verificationCode,
      });

      if (!result.ok) {
        setToast({
          tone: "error",
          message: toUserFacingMessage(result.message),
        });
        return;
      }

      setSession({
        token: result.data.token,
        vasiTckn: result.data.vasiTckn,
        verificationCode: values.verificationCode,
      });
      setStep("upload");
      setToast({
        tone: "success",
        message: "Vasi doğrulandı. Vasiyet sahibi belgesini yükleyebilirsiniz.",
      });
    } catch {
      setToast({
        tone: "error",
        message: "Doğrulama sırasında bir hata oluştu. Lütfen tekrar deneyin.",
      });
    } finally {
      setIsVerifyingIdentity(false);
    }
  }

  async function handleDocumentSubmit(values: { file: File }) {
    if (!session) {
      setToast({ tone: "error", message: "Önce vasi doğrulaması yapın." });
      setStep("identity");
      return;
    }

    const formData = new FormData();
    formData.append("token", session.token);
    formData.append("vasiTckn", session.vasiTckn);
    formData.append("verificationCode", session.verificationCode);
    formData.append("file", values.file, values.file.name);

    setIsSubmittingDocument(true);
    try {
      const response = await fetch("/api/submit-document", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as DocumentSubmitResult;

      if (!payload.ok) {
        setToast({
          tone: "error",
          message: toUserFacingMessage(
            payload.message || "Belge doğrulanamadı",
          ),
        });
        setStep("upload");
        return;
      }

      setItems(payload.data.items);
      setStep("results");
      setToast({
        tone: "success",
        message: "İçerikler görüntülemeye hazır.",
      });
    } catch {
      setToast({ tone: "error", message: "Belge doğrulanamadı" });
      setStep("upload");
    } finally {
      setIsSubmittingDocument(false);
    }
  }

  return (
    <>
      <ToastBanner toast={toast} onDismiss={dismissToast} />
      {isSubmittingDocument ? <VerifyingOverlay /> : null}

      {!token ? (
        <AuthShell eyebrow="GEÇERSİZ BAĞLANTI">
          <EmptyState
            align="start"
            icon="link_off"
            title="Bu sayfa açılamadı"
            description="Doğrulama yalnızca VASY uygulamasından iletilen bağlantı ile yapılabilir. Lütfen uygulamadaki bağlantıyı kullanın."
          />
        </AuthShell>
      ) : null}

      {token && step === "identity" ? (
        <AuthShell
          eyebrow="HOŞ GELDİNİZ"
          description="Vasi T.C. kimlik numaranız ve size özel doğrulama kodu ile devam edin."
        >
          <IdentityForm
            token={token}
            isSubmitting={isVerifyingIdentity}
            onSubmit={handleIdentitySubmit}
          />
        </AuthShell>
      ) : null}

      {token && step === "upload" ? (
        <PageSheet title="Belge yükleme">
          <StepChips current="upload" />
          <ProofOfLifeCard
            tone="healthy"
            title="Vasi doğrulandı"
            trailing={
              <span className="flex items-center gap-1 text-[12px] font-bold tracking-[0.08em] text-header">
                {maskTckn(session?.vasiTckn ?? "")}
                <MaterialIcon name="verified" filled size={18} className="text-heart" />
              </span>
            }
          />
          <p className="mb-4 mt-4 text-[14px] font-semibold leading-[1.4] text-outline">
            Formül C / ölüm belgesini PDF olarak yükleyin. Vasiyet sahibi kimliği
            sistem tarafından bağlantıdan doğrulanır.
          </p>
          <DocumentUpload
            isSubmitting={isSubmittingDocument}
            onSubmit={handleDocumentSubmit}
            onError={(message) =>
              setToast({ tone: "error", message: toUserFacingMessage(message) })
            }
          />
        </PageSheet>
      ) : null}

      {token && step === "results" ? (
        <div className="min-h-dvh bg-canvas">
          <div className="mx-auto w-full max-w-[1120px] px-5 pb-12 pt-8 sm:px-8">
            <TestamentViewer items={items} />
          </div>
        </div>
      ) : null}
    </>
  );
}
