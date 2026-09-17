import Image from "next/image";
import type { ReactNode } from "react";
import { BrandMark } from "@/components/brand-mark";

type AuthShellProps = {
  /** Üst küçük başlık / eyebrow (opsiyonel) */
  eyebrow?: string;
  /** Cam kart içi başlık (ör. Merhaba, …) */
  title?: string;
  description?: string;
  children: ReactNode;
  /**
   * form: sol dar kolon (kimlik / belge)
   * content: mobil-first içerik alanı (doğrulama sonrası)
   */
  variant?: "form" | "content";
};

/**
 * PDF tasarımına uygun kabuk:
 * full-bleed bg.png + cam paneller; mobilde kaydırılabilir, dar ekrana uyumlu.
 */
export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  variant = "form",
}: AuthShellProps) {
  const isContent = variant === "content";

  return (
    <div className="relative min-h-dvh flex-1 overflow-x-hidden">
      <Image
        src="/images/bg.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[62%_center] sm:object-center"
      />
      <div
        className={`pointer-events-none absolute inset-0 ${
          isContent
            ? "bg-gradient-to-b from-white/70 via-white/45 to-white/55 sm:from-white/50 sm:via-white/20 sm:to-white/35"
            : "bg-gradient-to-b from-white/70 via-white/40 to-white/25 sm:bg-gradient-to-r sm:from-white/55 sm:via-white/20 sm:to-transparent"
        }`}
        aria-hidden="true"
      />

      <div
        className={`relative z-10 mx-auto flex min-h-dvh w-full flex-col ${
          isContent
            ? "max-w-[720px] justify-start px-4 py-5 pb-10 sm:px-6 sm:py-8 lg:max-w-[880px]"
            : "max-w-[560px] justify-start px-4 py-5 pb-10 sm:ml-6 sm:mr-auto sm:max-w-[480px] sm:justify-center sm:px-8 sm:py-10 lg:ml-16 xl:ml-24"
        }`}
      >
        <header className="mb-5 flex items-center gap-3 sm:mb-7 sm:gap-3.5">
          <BrandMark size={isContent ? 44 : 48} priority alt="" />
          <div className="min-w-0">
            <p className="text-[20px] font-extrabold tracking-[3px] text-header sm:text-[22px] sm:tracking-[3.2px]">
              VASY
            </p>
            <p className="mt-0.5 text-[12px] font-semibold leading-[1.35] text-header/80 sm:mt-1 sm:text-[13px]">
              Dijital Mirasınızı Geleceğe Taşıyın
            </p>
          </div>
        </header>

        {(title || description || eyebrow) && (
          <section className="mb-4 rounded-[22px] border border-white/55 bg-white/60 px-4 py-4 shadow-[0_18px_50px_rgba(52,73,94,0.12)] backdrop-blur-md sm:mb-5 sm:rounded-[28px] sm:px-6 sm:py-6">
            {eyebrow ? (
              <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-header sm:text-[12px]">
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <h1
                className={`text-[20px] font-extrabold leading-[1.25] tracking-[-0.02em] text-header sm:text-[24px] ${
                  eyebrow ? "mt-1.5 sm:mt-2" : ""
                }`}
              >
                {title}
              </h1>
            ) : null}
            {description ? (
              <p className="mt-2 text-[13px] font-semibold leading-[1.5] text-header/75 sm:text-[15px]">
                {description}
              </p>
            ) : null}
          </section>
        )}

        <div className="flex w-full min-w-0 flex-col gap-4">{children}</div>
      </div>
    </div>
  );
}
