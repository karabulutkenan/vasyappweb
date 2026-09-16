import { SUPABASE_TABLES, TESTAMENT_COLUMNS } from "@/lib/constants";
import { getSupabaseAdmin } from "@/lib/supabase";
import {
  extractPreviewText,
  parseTestamentContent,
} from "@/lib/testament-content";
import type { HeritageItem } from "@/lib/types";

type TestamentRow = {
  id: string;
  verification_token: string | null;
  title: string | null;
  content: string | null;
  is_verified: boolean | null;
};

/**
 * Returns verified, active testaments for the guardian+token pair only.
 * Security filters must stay intact.
 */
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

  return (data ?? []).map((row) => {
    const blocks = parseTestamentContent(row.content);
    return {
      id: row.id,
      title: row.title?.trim() || "Vasiyet",
      blocks,
      previewText: extractPreviewText(blocks),
    };
  });
}
