import Link from "next/link";

type AppTopNavProps = {
  active: "verify" | "n8ntest";
};

/**
 * Geçici n8n test erişimi.
 * Ana akış: mobil uygulamadan ?token= ile doğrulama.
 */
export function AppTopNav({ active }: AppTopNavProps) {
  return (
    <nav
      aria-label="Geçici test erişimi"
      className="sticky top-0 z-40 border-b border-stone-200/80 bg-canvas/95 backdrop-blur"
    >
      <div className="mx-auto flex max-w-[460px] items-center justify-between gap-3 px-4 py-3">
        <Link
          href="/"
          className="text-[12px] font-extrabold tracking-[0.18em] text-header"
        >
          VASY
        </Link>

        {active === "verify" ? (
          <Link
            href="/n8ntest"
            className="rounded-full bg-primary px-3 py-1.5 text-[13px] font-bold tracking-wide text-white transition hover:opacity-90"
          >
            n8n test
          </Link>
        ) : (
          <Link
            href="/"
            className="rounded-full border border-stone-300 bg-white px-3 py-1.5 text-[13px] font-bold tracking-wide text-header transition hover:bg-stone-50"
          >
            Ana sayfa
          </Link>
        )}
      </div>
    </nav>
  );
}
