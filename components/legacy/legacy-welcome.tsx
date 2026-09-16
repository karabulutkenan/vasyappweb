"use client";

import { BrandMark } from "@/components/brand-mark";
import { AppButton } from "@/components/ui/button";

type LegacyWelcomeProps = {
  ownerName: string | null;
  onReady: () => void;
};

export function LegacyWelcome({ ownerName, onReady }: LegacyWelcomeProps) {
  const headline = ownerName
    ? `${ownerName}’tan size bir mesaj var.`
    : "Size bırakılmış bir vasiyet var.";

  return (
    <div className="relative min-h-dvh overflow-hidden bg-header">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 20% 0%, color-mix(in srgb, var(--primary) 55%, transparent), transparent 60%), radial-gradient(ellipse 70% 45% at 90% 20%, color-mix(in srgb, var(--primary-container) 35%, transparent), transparent 55%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-dvh w-full max-w-[560px] flex-col justify-center px-5 py-10 sm:px-8">
        <div className="mb-8 flex items-center gap-3">
          <BrandMark size={44} priority alt="" />
          <div>
            <p className="text-[18px] font-extrabold tracking-[3px] text-white">
              VASY
            </p>
            <p className="text-[12px] font-semibold text-on-navy-muted">
              Dijital Mirasınızı Geleceğe Taşıyın
            </p>
          </div>
        </div>

        <section className="rounded-page-sheet bg-canvas px-5 py-8 shadow-[0_24px_60px_rgba(0,0,0,0.22)] sm:px-8 sm:py-10">
          <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-outline">
            Size bırakılanlar
          </p>
          <h1 className="mt-3 text-[28px] font-extrabold leading-[1.15] tracking-[-0.03em] text-header sm:text-[32px]">
            {headline}
          </h1>
          <p className="mt-4 text-[15px] font-semibold leading-[1.55] text-header/75">
            Size bıraktığı mesajları ve dijital varlıkları güvenli bir şekilde
            görüntüleyebilirsiniz.
          </p>
          <p className="mt-3 text-[14px] font-semibold leading-[1.5] text-outline">
            Hazırsanız, sizin için bıraktıklarını açabilirsiniz.
          </p>

          <div className="mt-8">
            <AppButton onClick={onReady} icon="arrow_forward">
              Hazırım
            </AppButton>
          </div>
        </section>
      </div>
    </div>
  );
}
