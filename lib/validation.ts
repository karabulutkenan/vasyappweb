/** Flutter test kodları 6 haneli (ör. IRSQUN); üretim token'ları daha uzun olabilir. */
const TOKEN_PATTERN = /^[A-Za-z0-9._~-]{4,128}$/;
const VERIFICATION_CODE_PATTERN = /^[A-Za-z0-9]{4,16}$/;

export function sanitizeDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function sanitizeToken(value: string): string {
  return value.trim();
}

export function sanitizeVerificationCode(value: string): string {
  return value.trim().replace(/\s+/g, "");
}

export function isValidTckn(raw: string): boolean {
  const tckn = sanitizeDigits(raw);
  if (!/^[1-9][0-9]{10}$/.test(tckn)) {
    return false;
  }

  const digits = tckn.split("").map((digit) => Number(digit));
  const oddSum = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
  const evenSum = digits[1] + digits[3] + digits[5] + digits[7];
  const tenth = ((oddSum * 7 - evenSum) % 10 + 10) % 10;
  if (tenth !== digits[9]) {
    return false;
  }

  const eleventh = digits.slice(0, 10).reduce((sum, digit) => sum + digit, 0) % 10;
  return eleventh === digits[10];
}

export function isValidToken(raw: string): boolean {
  return TOKEN_PATTERN.test(sanitizeToken(raw));
}

export function isValidVerificationCode(raw: string): boolean {
  return VERIFICATION_CODE_PATTERN.test(sanitizeVerificationCode(raw));
}

export function parseSearchToken(
  token: string | string[] | undefined,
): string | null {
  const raw = Array.isArray(token) ? token[0] : token;
  if (!raw) {
    return null;
  }

  const sanitized = sanitizeToken(raw);
  return isValidToken(sanitized) ? sanitized : null;
}

export function maskTckn(raw: string): string {
  const digits = sanitizeDigits(raw);
  if (digits.length < 2) {
    return "•••••••••••";
  }

  return `${"•".repeat(digits.length - 2)}${digits.slice(-2)}`;
}

export function isPdfFile(file: File): boolean {
  const name = file.name.toLowerCase();
  if (!name.endsWith(".pdf")) {
    return false;
  }

  const allowedTypes = new Set([
    "",
    "application/pdf",
    "application/x-pdf",
    "application/octet-stream",
  ]);

  return allowedTypes.has(file.type);
}
