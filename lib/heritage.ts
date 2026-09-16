import {
  PROFILE_COLUMNS,
  SUPABASE_TABLES,
  TESTAMENT_COLUMNS,
} from "@/lib/constants";
import { createSignedMediaUrl } from "@/lib/media-resolve";
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
  owner_id: string | null;
};

async function fetchOwnerFullName(ownerId: string): Promise<string | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from(SUPABASE_TABLES.profiles)
    .select(PROFILE_COLUMNS.fullName)
    .eq(PROFILE_COLUMNS.id, ownerId)
    .maybeSingle();

  if (error) {
    console.error("[fetchOwnerFullName]", error);
    return null;
  }

  const row = data as { full_name?: string | null } | null;
  const name = row?.full_name;
  if (typeof name !== "string" || !name.trim()) {
    return null;
  }
  return name.trim();
}

/**
 * Returns verified, active testaments for the guardian+token pair only.
 * Security filters must stay intact.
 */
export async function fetchHeritageByToken(
  token: string,
  guardianTckn: string,
): Promise<{ items: HeritageItem[]; ownerName: string | null }> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from(SUPABASE_TABLES.testaments)
    .select("id, verification_token, title, content, is_verified, owner_id")
    .eq(TESTAMENT_COLUMNS.token, token)
    .eq(TESTAMENT_COLUMNS.guardianTckn, guardianTckn)
    .eq(TESTAMENT_COLUMNS.isVerified, true)
    .eq("is_active", true)
    .returns<TestamentRow[]>();

  if (error) {
    console.error("[fetchHeritageByToken]", error);
    throw new Error("Miras kayıtları alınamadı.");
  }

  const rows = data ?? [];
  const ownerId = rows.find((row) => row.owner_id)?.owner_id ?? null;
  const ownerName = ownerId ? await fetchOwnerFullName(ownerId) : null;

  const items: HeritageItem[] = [];
  for (const row of rows) {
    const blocks = await parseTestamentContent(row.content, createSignedMediaUrl);
    items.push({
      id: row.id,
      title: row.title?.trim() || "Vasiyet",
      blocks,
      previewText: extractPreviewText(blocks),
      ownerName,
    });
  }

  return { items, ownerName };
}
