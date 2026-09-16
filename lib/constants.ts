export const MAX_PDF_SIZE_BYTES = 5 * 1024 * 1024;
export const MAX_PDF_SIZE_LABEL = "5 MB";

/** Production n8n belge doğrulama webhook'u (sunucu tarafı). */
export const N8N_WEBHOOK_URL =
  process.env.N8N_WEBHOOK_URL ??
  "https://n8n.kenankarabulut.com/webhook/vasy-verify";

export const N8N_TIMEOUT_MS = 90_000;

/**
 * Gerçek VASY şeması:
 * - testaments(verification_token, guardian_tckn, title, content, is_verified, ...)
 * - profiles(tc_kimlik_no, ...)
 */
export const SUPABASE_TABLES = {
  testaments: "testaments",
  profiles: "profiles",
  guardians: "guardians",
} as const;

export const TESTAMENT_COLUMNS = {
  id: "id",
  token: "verification_token",
  guardianTckn: "guardian_tckn",
  title: "title",
  content: "content",
  isVerified: "is_verified",
  ownerId: "owner_id",
} as const;
