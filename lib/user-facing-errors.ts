const ERROR_MAP: Record<string, string> = {
  DOCUMENT_OWNER_MISMATCH:
    "Yüklediğiniz belge bu vasiyet kaydının sahibiyle eşleşmiyor.",
  DOCUMENT_VERIFICATION_FAILED:
    "Belge resmi sistemlerde doğrulanamadı. Lütfen geçerli bir belge ile tekrar deneyin.",
  VERIFICATION_UPDATE_FAILED:
    "Doğrulama tamamlanamadı. Lütfen kısa süre sonra tekrar deneyin.",
};

export function toUserFacingMessage(raw: string | null | undefined): string {
  if (!raw) {
    return "Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.";
  }

  const trimmed = raw.trim();
  if (!trimmed) {
    return "Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.";
  }

  return ERROR_MAP[trimmed] ?? trimmed;
}
