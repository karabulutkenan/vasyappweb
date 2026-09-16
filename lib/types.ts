import type { TestamentContentBlock } from "@/lib/testament-content";

export type VerificationPayload = {
  token: string;
  vasiTckn: string;
  verificationCode: string;
};

export type HeritageItem = {
  id: string;
  title: string;
  blocks: TestamentContentBlock[];
  previewText: string | null;
  ownerName: string | null;
};

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string };

export type DocumentSubmitResult = ActionResult<{
  items: HeritageItem[];
  ownerName: string | null;
}>;
