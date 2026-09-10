"use server";

import type { ActionResult } from "@/lib/types";
import {
  isValidTckn,
  isValidToken,
  isValidVerificationCode,
  sanitizeDigits,
  sanitizeToken,
  sanitizeVerificationCode,
} from "@/lib/validation";
import { findMatchingVerification } from "@/lib/verify-record";

export async function verifyIdentity(input: {
  token: string;
  vasiTckn: string;
  verificationCode: string;
}): Promise<ActionResult<{ vasiTckn: string; token: string }>> {
  try {
    const token = sanitizeToken(input.token);
    const vasiTckn = sanitizeDigits(input.vasiTckn);
    const verificationCode = sanitizeVerificationCode(input.verificationCode);

    if (!isValidToken(token)) {
      return { ok: false, message: "Doğrulama bağlantısı geçersiz." };
    }

    if (!isValidTckn(vasiTckn)) {
      return {
        ok: false,
        message: "Vasi T.C. Kimlik Numarası 11 haneli ve geçerli olmalıdır.",
      };
    }

    if (!isValidVerificationCode(verificationCode)) {
      return { ok: false, message: "Doğrulama kodu geçersiz." };
    }

    const matched = await findMatchingVerification({
      token,
      vasiTckn,
      verificationCode,
    });

    if (!matched) {
      return {
        ok: false,
        message: "Vasi kimliği veya doğrulama kodu bu bağlantı ile eşleşmedi.",
      };
    }

    return { ok: true, data: { vasiTckn, token } };
  } catch (error) {
    console.error("[verifyIdentity]", error);
    const message =
      error instanceof Error
        ? error.message
        : "Doğrulama sırasında bir hata oluştu. Lütfen tekrar deneyin.";
    return { ok: false, message };
  }
}
