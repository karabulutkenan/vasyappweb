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
      <section className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-10 lg:px-14 xl:px-20">
        <div className="mx-auto w-full max-w-[420px]">
          <header className="mb-8 flex items-center gap-3.5">
            <BrandMark size={52} priority alt="" />
            <div className="min-w-0">
              <p className="text-[22px] font-extrabold tracking-[3.2px] text-header">
                VASY
              </p>
              <p className="mt-1 text-[13px] font-semibold leading-[1.35] text-header/75">
                Dijital Mirasınızı Geleceğe Taşıyın
              </p>
            </div>
          </header>

          <div>
            <h1 className="text-[20px] font-extrabold tracking-[0.4px] text-header">
              {eyebrow}
            </h1>
            <span
              className="mt-3 block h-[3px] w-10 rounded-pill bg-primary"
              aria-hidden="true"
            />

            {description ? (
              <p className="mt-4 text-[15px] font-semibold leading-[1.45] text-header/80">
                {description}
              </p>
            ) : null}

            <div className="mt-7 flex flex-col gap-5">{children}</div>
          </div>
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
