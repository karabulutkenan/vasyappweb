import { SUPABASE_TABLES, TESTAMENT_COLUMNS } from "@/lib/constants";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { VerificationPayload } from "@/lib/types";

type TestamentMatchRow = {
  id: string;
  verification_token: string;
  guardian_tckn: string | null;
};

/**
 * Flutter: URL ?token=IRSQUN ve üretilen kod aynı değer.
 * DB: testaments.verification_token + guardian_tckn
 */
export async function findMatchingVerification(
  payload: VerificationPayload,
): Promise<boolean> {
  const supabase = getSupabaseAdmin();

  if (payload.verificationCode !== payload.token) {
    return false;
  }

  const { data, error } = await supabase
    .from(SUPABASE_TABLES.testaments)
    .select("id, verification_token, guardian_tckn")
    .eq(TESTAMENT_COLUMNS.token, payload.token)
    .eq(TESTAMENT_COLUMNS.guardianTckn, payload.vasiTckn)
    .maybeSingle();

  if (error) {
    console.error("[findMatchingVerification]", error);
    throw new Error(error.message || "Doğrulama kaydı sorgulanamadı.");
  }

  const row = data as TestamentMatchRow | null;
  return row !== null;
}
