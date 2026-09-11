"use client";

import { FormEvent, useState } from "react";
import { AppButton } from "@/components/ui/button";
import { MaterialIcon } from "@/components/ui/material-icon";
import { PillField } from "@/components/ui/pill-field";

type IdentityFormProps = {
  token: string;
  isSubmitting: boolean;
  onSubmit: (values: { vasiTckn: string; verificationCode: string }) => Promise<void>;
};

export function IdentityForm({ token, isSubmitting, onSubmit }: IdentityFormProps) {
  const [vasiTckn, setVasiTckn] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLocalError(null);

    if (vasiTckn.length !== 11) {
      setLocalError("Vasi T.C. Kimlik Numarası 11 haneli olmalıdır.");
      return;
    }

    if (verificationCode.trim().length < 4) {
      setLocalError("Vasiye ait doğrulama kodunu eksiksiz girin.");
      return;
    }

    await onSubmit({ vasiTckn, verificationCode: verificationCode.trim() });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <input type="hidden" name="token" value={token} />

      <PillField
        id="vasi-tckn"
        icon="badge"
        label="Vasi T.C. Kimlik No"
        name="vasiTckn"
        inputMode="numeric"
        autoComplete="off"
        maxLength={11}
        value={vasiTckn}
        disabled={isSubmitting}
        aria-invalid={localError?.includes("Vasi T.C.") ? true : undefined}
        error={Boolean(localError?.includes("Vasi T.C."))}
        placeholder="11 haneli kimlik numarası"
        onChange={(event) => {
          setVasiTckn(event.target.value.replace(/\D/g, "").slice(0, 11));
          setLocalError(null);
        }}
      />

      <PillField
        id="verification-code"
        icon="vpn_key"
        label="Doğrulama Kodu"
        name="verificationCode"
        autoComplete="one-time-code"
        maxLength={16}
        value={verificationCode}
        disabled={isSubmitting}
        error={Boolean(localError && !localError.includes("Vasi T.C."))}
        placeholder="Size özel üretilen kod"
        onChange={(event) => {
          setVerificationCode(event.target.value.replace(/[^A-Za-z0-9]/g, ""));
          setLocalError(null);
        }}
      />

      {localError ? (
        <p
          className="flex items-start gap-2 rounded-card-sm bg-[#FDECEC] px-3.5 py-3 text-[14px] font-bold leading-[1.35] text-error-text"
          role="alert"
        >
          <MaterialIcon name="error" filled size={18} className="mt-0.5 shrink-0" />
          <span>{localError}</span>
        </p>
      ) : null}

      <div className="pt-1">
        <AppButton type="submit" loading={isSubmitting} disabled={isSubmitting}>
          {isSubmitting ? "DOĞRULANIYOR" : "DOĞRULA!"}
        </AppButton>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[12px] font-semibold leading-[1.4] text-header/70">
          <MaterialIcon name="verified_user" size={16} className="text-header" />
          Bilgileriniz yalnızca doğrulama amacıyla işlenir.
        </p>
      </div>
    </form>
  );
}
