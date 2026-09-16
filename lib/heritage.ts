import { SUPABASE_TABLES, TESTAMENT_COLUMNS } from "@/lib/constants";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { HeritageItem } from "@/lib/types";

type TestamentRow = {
  id: string;
  verification_token: string | null;
  title: string | null;
  content: string | null;
  is_verified: boolean | null;
};

function extractWillText(content: string | null): string | null {
  if (!content) {
    return null;
  }

  try {
    const parsed = JSON.parse(content) as { text?: unknown };
    if (typeof parsed.text === "string" && parsed.text.trim()) {
      return parsed.text.trim();
    }
  } catch {
    // düz metin olabilir
  }

  const trimmed = content.trim();
  return trimmed || null;
}

export async function fetchHeritageByToken(
  token: string,
  guardianTckn: string,
): Promise<HeritageItem[]> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from(SUPABASE_TABLES.testaments)
    .select("id, verification_token, title, content, is_verified")
    .eq(TESTAMENT_COLUMNS.token, token)
    .eq(TESTAMENT_COLUMNS.guardianTckn, guardianTckn)
    .eq(TESTAMENT_COLUMNS.isVerified, true)
    .eq("is_active", true)
    .returns<TestamentRow[]>();

  if (error) {
    console.error("[fetchHeritageByToken]", error);
    throw new Error("Miras kayıtları alınamadı.");
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    token: row.verification_token ?? token,
    title: row.title?.trim() || "Vasiyet kaydı",
    type: "Vasiyet",
    description: extractWillText(row.content),
    amount: null,
    institution: null,
    status: row.is_verified ? "Doğrulandı" : "Beklemede",
  }));
}
