import {
  MEDIA_STORAGE_BUCKET,
  SIGNED_URL_EXPIRES_SEC,
} from "@/lib/constants";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isSafeHttpUrl } from "@/lib/testament-content";

/**
 * Resolve a storage object path to a short-lived signed URL.
 * Does not invent public permanent URLs for private content.
 */
export async function createSignedMediaUrl(
  objectPath: string,
): Promise<string | null> {
  const cleaned = objectPath.replace(/^\/+/, "").trim();
  if (!cleaned || isSafeHttpUrl(cleaned)) {
    return isSafeHttpUrl(cleaned) ? cleaned : null;
  }

  // Ignore accidental bucket-prefixed paths: "avatars/uid/file.jpg"
  const withoutBucket = cleaned.startsWith(`${MEDIA_STORAGE_BUCKET}/`)
    ? cleaned.slice(MEDIA_STORAGE_BUCKET.length + 1)
    : cleaned;

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.storage
      .from(MEDIA_STORAGE_BUCKET)
      .createSignedUrl(withoutBucket, SIGNED_URL_EXPIRES_SEC);

    if (error || !data?.signedUrl) {
      console.error("[createSignedMediaUrl]", error?.message ?? "no url");
      return null;
    }

    return data.signedUrl;
  } catch (error) {
    console.error("[createSignedMediaUrl]", error);
    return null;
  }
}
