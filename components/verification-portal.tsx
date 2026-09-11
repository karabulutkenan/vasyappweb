"use client";

import { useCallback, useState } from "react";
import { verifyIdentity } from "@/app/actions/verify-identity";
import { DocumentUpload } from "@/components/document-upload";
import { HeritageResults } from "@/components/heritage-results";
import { IdentityForm } from "@/components/identity-form";
import { ToastBanner, type ToastState } from "@/components/toast-banner";
import { AuthShell } from "@/components/ui/auth-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterChip } from "@/components/ui/filter-chip";
import { MaterialIcon } from "@/components/ui/material-icon";
import { PageSheet } from "@/components/ui/page-sheet";
import { ProofOfLifeCard } from "@/components/ui/proof-of-life-card";
import { VerifyingOverlay } from "@/components/verifying-overlay";
import type { DocumentSubmitResult, HeritageItem } from "@/lib/types";
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

function StepChips({ current }: { current: Step }) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      <FilterChip selected={current === "identity"}>Vasi</FilterChip>
      <FilterChip selected={current === "upload"}>Belge</FilterChip>
      <FilterChip selected={current === "results"}>Kayıtlar</FilterChip>
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
        setToast({ tone: "error", message: result.message });
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

  async function handleDocumentSubmit(values: {
    file: File;
    vasiyetSahibiTckn: string;
  }) {
    if (!session) {
      setToast({ tone: "error", message: "Önce vasi doğrulaması yapın." });
      setStep("identity");
      return;
    }

    const formData = new FormData();
    formData.append("token", session.token);
    formData.append("vasiTckn", session.vasiTckn);
    formData.append("verificationCode", session.verificationCode);
    formData.append("vasiyetSahibiTckn", values.vasiyetSahibiTckn);
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
          message: payload.message || "Belge doğrulanamadı",
        });
        setStep("upload");
        return;
      }

      setItems(payload.data.items);
      setStep("results");
      setToast({
        tone: "success",
        message: "Belge doğrulandı. Miras kayıtları listelendi.",
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
            Vasiyet sahibinin T.C. kimlik numarasını girin ve Formül C / ölüm belgesini PDF olarak yükleyin.
          </p>
          <DocumentUpload
            vasiTckn={session?.vasiTckn ?? ""}
            isSubmitting={isSubmittingDocument}
            onSubmit={handleDocumentSubmit}
            onError={(message) => setToast({ tone: "error", message })}
          />
        </PageSheet>
      ) : null}

      {token && step === "results" ? (
        <PageSheet title="Doğrulama tamamlandı">
          <StepChips current="results" />
          <ProofOfLifeCard
            tone="healthy"
            title="Her şey yolunda"
            trailing={<MaterialIcon name="favorite" filled size={22} className="text-heart" />}
          />
          <p className="mb-4 mt-4 text-[14px] font-semibold leading-[1.4] text-outline">
            Aşağıdaki kayıtlar yalnızca görüntüleme amaçlıdır ve değiştirilemez.
          </p>
          <HeritageResults items={items} />
        </PageSheet>
      ) : null}
    </>
  );
}
