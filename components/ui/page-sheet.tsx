import type { ReactNode } from "react";
import { BrandMark } from "@/components/brand-mark";

type PageSheetProps = {
  title: string;
  children: ReactNode;
  hero?: ReactNode;
  actions?: ReactNode;
};

export function PageSheet({ title, children, hero, actions }: PageSheetProps) {
  return (
    <div className="min-h-dvh bg-header">
      <div className="mx-auto flex min-h-dvh w-full max-w-[1120px] flex-col">
        <header className="flex items-center gap-3 px-5 pb-4 pt-5">
          <BrandMark size={36} alt="" />
          <h1 className="min-w-0 flex-1 text-[20px] font-extrabold text-white">
            {title}
          </h1>
          {actions}
        </header>
        {hero}
        <section className="flex flex-1 flex-col rounded-t-page-sheet bg-canvas px-5 pb-8 pt-6 lg:mb-6 lg:rounded-page-sheet">
          {children}
        </section>
      </div>
    </div>
  );
}
