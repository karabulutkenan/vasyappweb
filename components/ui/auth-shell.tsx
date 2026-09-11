import Image from "next/image";
import type { ReactNode } from "react";
import { BrandMark } from "@/components/brand-mark";

const AUTH_HERO_IMAGE =
  "https://img.piri.net/resim/upload/2021/12/23/12/51/5503a4d9dijitalmirasantalya.jpg";

type AuthShellProps = {
  eyebrow: string;
  description?: string;
  children: ReactNode;
};

export function AuthShell({ eyebrow, description, children }: AuthShellProps) {
  return (
    <div className="flex min-h-[calc(100dvh-3.25rem)] flex-1 bg-field lg:grid lg:grid-cols-2">
      <section className="flex flex-1 flex-col justify-center px-5 py-8 sm:px-8 lg:px-12 xl:px-16">
        <div className="mx-auto w-full max-w-[420px]">
          <header className="mb-6 flex items-center gap-3 lg:mb-8">
            <BrandMark size={48} priority alt="" />
            <div className="min-w-0">
              <p className="text-[20px] font-extrabold tracking-[3.2px] text-header">
                VASY
              </p>
              <p className="mt-0.5 text-[12px] font-semibold leading-[1.35] text-outline">
                Dijital Mirasınızı Geleceğe Taşıyın
              </p>
            </div>
          </header>

          <p className="text-[12px] font-semibold uppercase tracking-[3.4px] text-header/55">
            {eyebrow}
          </p>
          <span
            className="mt-2.5 block h-0.5 w-9 rounded-pill bg-primary"
            aria-hidden="true"
          />

          {description ? (
            <p className="mt-4 text-[15px] font-semibold leading-[1.4] text-outline">
              {description}
            </p>
          ) : null}

          <div className="mt-5 flex flex-col gap-4 lg:mt-6">{children}</div>
        </div>
      </section>

      <aside
        className="relative hidden overflow-hidden bg-primary lg:block"
        aria-hidden="true"
      >
        <Image
          src={AUTH_HERO_IMAGE}
          alt=""
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
      </aside>
    </div>
  );
}
