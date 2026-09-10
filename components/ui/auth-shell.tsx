import type { ReactNode } from "react";
import { BrandMark } from "@/components/brand-mark";

type AuthShellProps = {
  eyebrow: string;
  children: ReactNode;
};

export function AuthShell({ eyebrow, children }: AuthShellProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas lg:items-center lg:justify-center lg:px-6 lg:py-10">
      <div className="mx-auto flex min-h-dvh w-full max-w-[460px] flex-col lg:min-h-0">
        <header className="flex min-h-[42vh] flex-col items-center justify-center px-6 py-8 lg:min-h-0 lg:pb-6 lg:pt-2">
          <p className="text-center text-[13px] font-semibold uppercase tracking-[3.4px] text-header/55">
            {eyebrow}
          </p>
          <span className="mt-3 h-0.5 w-9 rounded-pill bg-primary" aria-hidden="true" />
          <div className="mt-6">
            <BrandMark size={135} priority alt="" />
          </div>
          <p className="mt-4 text-[22px] font-extrabold tracking-[3.2px] text-header">
            VASY
          </p>
          <p className="mt-2 text-center text-[13px] font-semibold leading-[1.4] text-outline">
            Dijital Mirasınızı Geleceğe Taşıyın
          </p>
        </header>

        <section className="flex flex-1 flex-col rounded-t-sheet bg-primary px-6 pb-8 pt-6 lg:flex-none lg:rounded-sheet">
          {children}
        </section>
      </div>
    </div>
  );
}
