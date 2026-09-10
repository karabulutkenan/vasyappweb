import {
  MAX_PDF_SIZE_BYTES,
  N8N_TIMEOUT_MS,
} from "@/lib/constants";
import {
  isPdfFile,
  isValidTckn,
  sanitizeDigits,
} from "@/lib/validation";

export const maxDuration = 120;

const N8N_TEST_WEBHOOK_URL =
  process.env.N8N_TEST_WEBHOOK_URL ??
  process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL ??
  "https://n8n.kenankarabulut.com/webhook-test/vasy-verify";

type TestResult =
  | { ok: true; message: string; status: number }
  | { ok: false; message: string };

function json(result: TestResult, status = 200): Response {
  return Response.json(result, { status });
}

export async function POST(request: Request): Promise<Response> {
  try {
    const formData = await request.formData();
    const tckn = sanitizeDigits(String(formData.get("tckn") ?? ""));
    const fileValue = formData.get("file");

    if (!isValidTckn(tckn)) {
      return json(
        {
          ok: false,
          message: "T.C. Kimlik Numarası 11 haneli ve geçerli olmalıdır.",
        },
        400,
      );
    }

    if (!(fileValue instanceof File) || fileValue.size === 0) {
      return json({ ok: false, message: "PDF dosyası gerekli." }, 400);
    }

    if (!isPdfFile(fileValue)) {
      return json({ ok: false, message: "Yalnızca PDF kabul edilir." }, 400);
    }

    if (fileValue.size > MAX_PDF_SIZE_BYTES) {
      return json({ ok: false, message: "Dosya boyutu 5 MB sınırını aşıyor." }, 400);
    }

    const outbound = new FormData();
    outbound.append("tckn", tckn);
    outbound.append("file", fileValue, fileValue.name);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), N8N_TIMEOUT_MS);

    try {
      const n8nResponse = await fetch(N8N_TEST_WEBHOOK_URL, {
        method: "POST",
        body: outbound,
        signal: controller.signal,
      });

      const bodyText = await n8nResponse.text().catch(() => "");

      if (!n8nResponse.ok) {
        return json(
          {
            ok: false,
            message: `n8n hata döndü (HTTP ${n8nResponse.status})${
              bodyText ? `: ${bodyText.slice(0, 200)}` : ""
            }`,
          },
          422,
        );
      }

      return json({
        ok: true,
        status: n8nResponse.status,
        message: `n8n test başarılı (HTTP ${n8nResponse.status})${
          bodyText ? ` — ${bodyText.slice(0, 160)}` : ""
        }`,
      });
    } catch (error) {
      const aborted = error instanceof Error && error.name === "AbortError";
      return json(
        {
          ok: false,
          message: aborted
            ? "n8n zaman aşımı (90 sn)."
            : `n8n'e ulaşılamadı: ${
                error instanceof Error ? error.message : "bilinmeyen hata"
              }`,
        },
        422,
      );
    } finally {
      clearTimeout(timeoutId);
    }
  } catch {
    return json(
      { ok: false, message: "Test isteği gönderilemedi." },
      500,
    );
  }
}
