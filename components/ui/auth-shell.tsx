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
};

/**
 * PDF tasarımına uygun giriş kabuğu:
 * full-bleed bg.png + sol cam paneller + form.
 */
export function AuthShell({
  eyebrow,
  title,
  description,
  children,
}: AuthShellProps) {
  return (
    <div className="relative min-h-[calc(100dvh-3.25rem)] flex-1 overflow-hidden">
      <Image
        src="/images/bg.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/55 via-white/25 to-transparent sm:from-white/45 sm:via-white/15"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-3.25rem)] w-full max-w-[560px] flex-col justify-center px-5 py-10 sm:ml-6 sm:mr-auto sm:max-w-[480px] sm:px-8 lg:ml-16 xl:ml-24">
        <header className="mb-7 flex items-center gap-3.5">
          <BrandMark size={52} priority alt="" />
          <div className="min-w-0">
            <p className="text-[22px] font-extrabold tracking-[3.2px] text-header">
              VASY
            </p>
            <p className="mt-1 text-[13px] font-semibold leading-[1.35] text-header/80">
              Dijital Mirasınızı Geleceğe Taşıyın
            </p>
          </div>
        </header>

        {(title || description || eyebrow) && (
          <section className="mb-5 rounded-[28px] border border-white/55 bg-white/55 px-5 py-5 shadow-[0_18px_50px_rgba(52,73,94,0.12)] backdrop-blur-md sm:px-6 sm:py-6">
            {eyebrow ? (
              <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-header">
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <h1
                className={`text-[22px] font-extrabold leading-[1.25] tracking-[-0.02em] text-header sm:text-[24px] ${
                  eyebrow ? "mt-2" : ""
                }`}
              >
                {title}
              </h1>
            ) : null}
            {description ? (
              <p className="mt-2 text-[14px] font-semibold leading-[1.5] text-header/75 sm:text-[15px]">
                {description}
              </p>
            ) : null}
          </section>
        )}

        <div className="flex flex-col gap-4">{children}</div>
      </div>
    </div>
  );
}
