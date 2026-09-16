import { fetchHeritageByToken } from "@/lib/heritage";
import {
  MAX_PDF_SIZE_BYTES,
  N8N_TIMEOUT_MS,
  N8N_WEBHOOK_URL,
  SUPABASE_TABLES,
  TESTAMENT_COLUMNS,
} from "@/lib/constants";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { DocumentSubmitResult } from "@/lib/types";
import {
  isPdfFile,
  isValidTckn,
  isValidToken,
  isValidVerificationCode,
  sanitizeDigits,
  sanitizeToken,
  sanitizeVerificationCode,
} from "@/lib/validation";
import { findMatchingVerification } from "@/lib/verify-record";

export const maxDuration = 120;

function jsonResult(result: DocumentSubmitResult, status = 200): Response {
  return Response.json(result, { status });
}

export async function POST(request: Request): Promise<Response> {
  try {
    const formData = await request.formData();
    const token = sanitizeToken(String(formData.get("token") ?? ""));
    const vasiTckn = sanitizeDigits(String(formData.get("vasiTckn") ?? ""));
    const verificationCode = sanitizeVerificationCode(
      String(formData.get("verificationCode") ?? ""),
    );
    const vasiyetSahibiTckn = sanitizeDigits(
      String(formData.get("vasiyetSahibiTckn") ?? ""),
    );
    const fileValue = formData.get("file");

    if (
      !isValidToken(token) ||
      !isValidTckn(vasiTckn) ||
      !isValidVerificationCode(verificationCode)
    ) {
      return jsonResult(
        { ok: false, message: "Vasi doğrulaması geçersiz." },
        400,
      );
    }

    if (!isValidTckn(vasiyetSahibiTckn)) {
      return jsonResult(
        {
          ok: false,
          message: "Vasiyet sahibi T.C. Kimlik Numarası 11 haneli ve geçerli olmalıdır.",
        },
        400,
      );
    }

    if (vasiyetSahibiTckn === vasiTckn) {
      return jsonResult(
        {
          ok: false,
          message: "Vasiyet sahibi kimliği vasi kimliğinden farklı olmalıdır.",
        },
        400,
      );
    }

    if (!(fileValue instanceof File) || fileValue.size === 0) {
      return jsonResult(
        { ok: false, message: "Lütfen Formül C / Ölüm Belgesi PDF dosyasını yükleyin." },
        400,
      );
    }

    if (!isPdfFile(fileValue)) {
      return jsonResult(
        { ok: false, message: "Yalnızca PDF dosyaları kabul edilir." },
        400,
      );
    }

    if (fileValue.size > MAX_PDF_SIZE_BYTES) {
      return jsonResult(
        { ok: false, message: "Dosya boyutu 5 MB sınırını aşıyor." },
        400,
      );
    }

    const matched = await findMatchingVerification({
      token,
      vasiTckn,
      verificationCode,
    });

    if (!matched) {
      return jsonResult(
        { ok: false, message: "Kimlik doğrulaması geçersiz. Lütfen tekrar deneyin." },
        403,
      );
    }

    const outbound = new FormData();
    outbound.append("tckn", vasiyetSahibiTckn);
    outbound.append("file", fileValue, fileValue.name);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), N8N_TIMEOUT_MS);

    try {
      const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        body: outbound,
        signal: controller.signal,
      });

      if (!n8nResponse.ok) {
        return jsonResult({ ok: false, message: "Belge doğrulanamadı" }, 422);
      }

      let n8nResult: {
        is_valid?: unknown;
        pdf_detected?: unknown;
        status?: unknown;
        tckn?: unknown;
      };

      try {
        n8nResult = (await n8nResponse.json()) as typeof n8nResult;
      } catch {
        return jsonResult(
          { ok: false, message: "DOCUMENT_VERIFICATION_FAILED" },
          422,
        );
      }

      const documentOwnerMatches =
        String(n8nResult.tckn ?? "").trim() ===
        String(vasiyetSahibiTckn).trim();

      const isDocumentValid =
        n8nResult.is_valid === true &&
        n8nResult.pdf_detected === true &&
        n8nResult.status === "success" &&
        documentOwnerMatches;

      if (!isDocumentValid) {
        return jsonResult(
          { ok: false, message: "DOCUMENT_VERIFICATION_FAILED" },
          422,
        );
      }
    } catch (error) {
      const aborted = error instanceof Error && error.name === "AbortError";
      return jsonResult(
        {
          ok: false,
          message: aborted
            ? "Belge doğrulama süresi aşıldı. Lütfen tekrar deneyin."
            : "Belge doğrulanamadı",
        },
        422,
      );
    } finally {
      clearTimeout(timeoutId);
    }

    const supabase = getSupabaseAdmin();
    const { data: updatedRows, error: updateError } = await supabase
      .from(SUPABASE_TABLES.testaments)
      .update({ [TESTAMENT_COLUMNS.isVerified]: true })
      .eq(TESTAMENT_COLUMNS.token, token)
      .eq(TESTAMENT_COLUMNS.guardianTckn, vasiTckn)
      .eq("is_active", true)
      .select(TESTAMENT_COLUMNS.id);

    if (updateError || !updatedRows || updatedRows.length === 0) {
      console.error("[submit-document] verification update failed", updateError);
      return jsonResult(
        { ok: false, message: "VERIFICATION_UPDATE_FAILED" },
        500,
      );
    }

    const items = await fetchHeritageByToken(token, vasiTckn);
    return jsonResult({ ok: true, data: { items } });
  } catch {
    return jsonResult(
      {
        ok: false,
        message: "Belge gönderilirken bir hata oluştu. Lütfen tekrar deneyin.",
      },
      500,
    );
  }
}
