"use client";

import { useCallback, useState } from "react";
import { verifyIdentity } from "@/app/actions/verify-identity";
import { DocumentUpload } from "@/components/document-upload";
import { DigitalLegacyExperience } from "@/components/legacy/digital-legacy-experience";
import { IdentityForm } from "@/components/identity-form";
import { ToastBanner, type ToastState } from "@/components/toast-banner";
import { AuthShell } from "@/components/ui/auth-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { VerifyingOverlay } from "@/components/verifying-overlay";
import type { DocumentSubmitResult, HeritageItem } from "@/lib/types";
import { toUserFacingMessage } from "@/lib/user-facing-errors";

type Step = "identity" | "upload" | "results";

type VerifiedSession = {
  token: string;
  vasiTckn: string;
  verificationCode: string;
};

type VerificationPortalProps = {
  token: string | null;
  /** Yalnızca 1. adım selamlaması; 2. adımda gösterilmez. */
  guardianName: string | null;
};

export function VerificationPortal({
  token,
  guardianName,
}: VerificationPortalProps) {
  const [step, setStep] = useState<Step>("identity");
  const [session, setSession] = useState<VerifiedSession | null>(null);
  const [items, setItems] = useState<HeritageItem[]>([]);
  const [ownerName, setOwnerName] = useState<string | null>(null);
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
      setOwnerName(payload.data.ownerName);
      setStep("results");
    } catch {
      setToast({ tone: "error", message: "Belge doğrulanamadı" });
      setStep("upload");
    } finally {
      setIsSubmittingDocument(false);
    }
  }

  const identityTitle = guardianName
    ? `Merhaba, ${guardianName}`
    : "Merhaba";

  return (
    <>
      <ToastBanner toast={toast} onDismiss={dismissToast} />
      {isSubmittingDocument ? <VerifyingOverlay /> : null}

      {!token ? (
        <AuthShell
          title="Bu sayfa açılamadı"
          description="Doğrulama yalnızca VASY uygulamasından iletilen bağlantı ile yapılabilir. Lütfen uygulamadaki bağlantıyı kullanın."
        >
          <EmptyState
            align="start"
            icon="link_off"
            title="Geçersiz bağlantı"
            description="Lütfen uygulamadaki doğrulama bağlantısını kullanın."
          />
        </AuthShell>
      ) : null}

      {token && step === "identity" ? (
        <AuthShell
          title={identityTitle}
          description="Lütfen T.C. Kimlik No ve size özel oluşturulan 6 haneli kod numaranızı giriniz."
        >
          <IdentityForm
            token={token}
            isSubmitting={isVerifyingIdentity}
            onSubmit={handleIdentitySubmit}
          />
        </AuthShell>
      ) : null}

      {token && step === "upload" ? (
        <AuthShell
          eyebrow="SADECE BİR ADIM KALDI"
          title="Vasiliğiniz doğrulanmıştır!"
          description="Bu bölümde E-Devletten edineceğiniz ölüm belgesini sisteme yüklemeniz gerekmektedir."
        >
          <DocumentUpload
            isSubmitting={isSubmittingDocument}
            onSubmit={handleDocumentSubmit}
            onError={(message) =>
              setToast({ tone: "error", message: toUserFacingMessage(message) })
            }
          />
        </AuthShell>
      ) : null}

      {token && step === "results" ? (
        <DigitalLegacyExperience items={items} ownerName={ownerName} />
      ) : null}
    </>
  );
}
