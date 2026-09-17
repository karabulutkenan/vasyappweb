"use client";

import { AppButton } from "@/components/ui/button";
import { AuthShell } from "@/components/ui/auth-shell";

type LegacyWelcomeProps = {
  ownerName: string | null;
  onReady: () => void;
};

export function LegacyWelcome({ ownerName, onReady }: LegacyWelcomeProps) {
  const title = ownerName
    ? `${ownerName}’tan size bir mesaj var.`
    : "Size bırakılmış bir vasiyet var.";

  return (
    <div className="animate-[fadeIn_280ms_ease-out]">
      <AuthShell
        variant="content"
        eyebrow="Size bırakılanlar"
        title={title}
        description="Size bıraktığı mesajları ve dijital varlıkları güvenli bir şekilde görüntüleyebilirsiniz. Hazırsanız, sizin için bıraktıklarını açabilirsiniz."
      >
        <AppButton onClick={onReady} icon="arrow_forward">
          Hazırım
        </AppButton>
      </AuthShell>
    </div>
  );
}
