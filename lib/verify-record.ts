import {
  GUARDIAN_COLUMNS,
  PROFILE_COLUMNS,
  SUPABASE_TABLES,
  TESTAMENT_COLUMNS,
} from "@/lib/constants";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { VerificationPayload } from "@/lib/types";

export type TestamentMatchRow = {
  id: string;
  verification_token: string;
  guardian_tckn: string | null;
  owner_id: string | null;
};

/**
 * Flutter: URL ?token=IRSQUN ve üretilen kod aynı değer.
 * DB: testaments.verification_token + guardian_tckn
 */
export async function findMatchingVerification(
  payload: VerificationPayload,
): Promise<TestamentMatchRow | null> {
  const supabase = getSupabaseAdmin();

  if (payload.verificationCode !== payload.token) {
    return null;
  }

  const { data, error } = await supabase
    .from(SUPABASE_TABLES.testaments)
    .select("id, verification_token, guardian_tckn, owner_id")
    .eq(TESTAMENT_COLUMNS.token, payload.token)
    .eq(TESTAMENT_COLUMNS.guardianTckn, payload.vasiTckn)
    .maybeSingle();

  if (error) {
    console.error("[findMatchingVerification]", error);
    throw new Error(error.message || "Doğrulama kaydı sorgulanamadı.");
  }

  return (data as TestamentMatchRow | null) ?? null;
}

/**
 * Token → vasi görünen adı (yalnızca selamlama; TCKN dönmez).
 * Link zaten ilgili vasiye özel gönderildiği için isim gösterilebilir.
 */
export async function fetchGuardianDisplayNameByToken(
  token: string,
): Promise<string | null> {
  const supabase = getSupabaseAdmin();

  const { data: testament, error } = await supabase
    .from(SUPABASE_TABLES.testaments)
    .select("guardian_tckn, owner_id")
    .eq(TESTAMENT_COLUMNS.token, token)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[fetchGuardianDisplayNameByToken]", error);
    return null;
  }

  const row = testament as {
    guardian_tckn?: string | null;
    owner_id?: string | null;
  } | null;

  const tckn = row?.guardian_tckn?.trim() ?? "";
  const ownerId = row?.owner_id?.trim() ?? "";
  if (!tckn || !ownerId) {
    return null;
  }

  const { data: guardian, error: guardianError } = await supabase
    .from(SUPABASE_TABLES.guardians)
    .select(GUARDIAN_COLUMNS.fullName)
    .eq(GUARDIAN_COLUMNS.ownerId, ownerId)
    .eq(GUARDIAN_COLUMNS.tcKimlikNo, tckn)
    .maybeSingle();

  if (guardianError) {
    console.error("[fetchGuardianDisplayNameByToken:guardian]", guardianError);
    return null;
  }

  const name = (guardian as { full_name?: string | null } | null)?.full_name;
  if (typeof name !== "string" || !name.trim()) {
    return null;
  }

  // Selamlamada ilk ad yeterli
  return name.trim().split(/\s+/)[0] ?? null;
}

/**
 * Testament owner_id → profiles.tc_kimlik_no
 * TCKN bulunamazsa null döner (çağıran güvenli hata verir).
 */
export async function fetchOwnerTcKimlikNo(
  ownerId: string,
): Promise<string | null> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from(SUPABASE_TABLES.profiles)
    .select(PROFILE_COLUMNS.tcKimlikNo)
    .eq(PROFILE_COLUMNS.id, ownerId)
    .maybeSingle();

  if (error) {
    console.error("[fetchOwnerTcKimlikNo]", error);
    return null;
  }

  const row = data as { tc_kimlik_no?: string | null } | null;
  const tckn = row?.tc_kimlik_no;
  if (typeof tckn !== "string" || !tckn.trim()) {
    return null;
  }

  return tckn.trim();
}
