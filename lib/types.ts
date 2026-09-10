export type VerificationPayload = {
  token: string;
  vasiTckn: string;
  verificationCode: string;
};

export type HeritageItem = {
  id: string;
  token: string;
  title: string;
  type: string | null;
  description: string | null;
  amount: number | string | null;
  institution: string | null;
  status: string | null;
};

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string };

export type DocumentSubmitResult = ActionResult<{ items: HeritageItem[] }>;
