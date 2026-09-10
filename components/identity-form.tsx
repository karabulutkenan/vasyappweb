"use client";

import { FormEvent, useState } from "react";
import { AppButton } from "@/components/ui/button";
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
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4" noValidate>
      <input type="hidden" name="token" value={token} />

      <div>
        <label htmlFor="vasi-tckn" className="sr-only">
          Vasi T.C. Kimlik Numarası
        </label>
        <PillField
          id="vasi-tckn"
          icon="badge"
          name="vasiTckn"
          inputMode="numeric"
          autoComplete="off"
          maxLength={11}
          value={vasiTckn}
          disabled={isSubmitting}
          aria-invalid={localError?.includes("Vasi T.C.") ? true : undefined}
          error={Boolean(localError?.includes("Vasi T.C."))}
          placeholder="Vasi T.C. Kimlik No"
          onChange={(event) => {
            setVasiTckn(event.target.value.replace(/\D/g, "").slice(0, 11));
            setLocalError(null);
          }}
        />
      </div>

      <div>
        <label htmlFor="verification-code" className="sr-only">
          Doğrulama Kodu
        </label>
        <PillField
          id="verification-code"
          icon="vpn_key"
          name="verificationCode"
          autoComplete="one-time-code"
          maxLength={16}
          value={verificationCode}
          disabled={isSubmitting}
          error={Boolean(localError && !localError.includes("Vasi T.C."))}
          placeholder="Doğrulama kodu"
          onChange={(event) => {
            setVerificationCode(event.target.value.replace(/[^A-Za-z0-9]/g, ""));
            setLocalError(null);
          }}
        />
      </div>

      {localError ? (
        <p className="px-2 text-[14px] font-bold leading-[1.35] text-error-text" role="alert">
          {localError}
        </p>
      ) : null}

      <div className="mt-auto pt-2">
        <AppButton type="submit" loading={isSubmitting} disabled={isSubmitting}>
          {isSubmitting ? "DOĞRULANIYOR" : "DOĞRULA!"}
        </AppButton>
        <p className="mt-4 text-center text-[12px] font-semibold leading-[1.4] text-auth-helper">
          Bilgileriniz yalnızca doğrulama amacıyla işlenir.
        </p>
      </div>
    </form>
  );
}
