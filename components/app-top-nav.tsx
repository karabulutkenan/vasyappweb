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
      className="sticky top-0 z-40 border-b border-secondary-container bg-field"
    >
      <div className="mx-auto flex w-full max-w-[1120px] items-center justify-between gap-3 px-5 py-3 lg:px-8">
        <Link
          href="/"
          className="text-[13px] font-extrabold tracking-[2px] text-header"
        >
          VASY
        </Link>

        {active === "verify" ? (
          <Link
            href="/n8ntest"
            className="rounded-pill bg-primary px-3.5 py-1.5 text-[13px] font-bold tracking-wide text-on-primary transition hover:bg-primary-container"
          >
            n8n test
          </Link>
        ) : (
          <Link
            href="/"
            className="rounded-pill bg-header px-3.5 py-1.5 text-[13px] font-bold tracking-wide text-white transition hover:bg-header-hover"
          >
            Ana sayfa
          </Link>
        )}
      </div>
    </nav>
  );
}
