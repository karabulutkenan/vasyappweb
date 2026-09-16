import type { TestamentContentBlock } from "@/lib/testament-content";

export type VerificationPayload = {
  token: string;
  vasiTckn: string;
  verificationCode: string;
};

/**
 * Guardian-facing testament summary after successful verification.
 * Technical fields (token, TCKN, is_verified) must not be rendered in UI.
 */
export type HeritageItem = {
  id: string;
  title: string;
  blocks: TestamentContentBlock[];
  /** Optional preview excerpt for list cards */
  previewText: string | null;
};

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string };

export type DocumentSubmitResult = ActionResult<{ items: HeritageItem[] }>;
