import Link from "next/link";

type AppTopNavProps = {
  active: "test" | "n8n";
};

export function AppTopNav({ active }: AppTopNavProps) {
  const base =
    "rounded-full px-3 py-1.5 text-[13px] font-bold tracking-wide transition";
  const idle = "text-header/70 hover:bg-white/80 hover:text-header";
  const selected = "bg-primary text-white";

  return (
    <nav
      aria-label="Sayfa geçişi"
      className="sticky top-0 z-40 border-b border-stone-200/80 bg-canvas/95 backdrop-blur"
    >
      <div className="mx-auto flex max-w-[460px] items-center justify-between gap-3 px-4 py-3">
        <p className="text-[12px] font-extrabold tracking-[0.18em] text-header">
          VASY
        </p>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className={`${base} ${active === "test" ? selected : idle}`}
            aria-current={active === "test" ? "page" : undefined}
          >
            Test
          </Link>
          <Link
            href="/n8n-monitor"
            className={`${base} ${active === "n8n" ? selected : idle}`}
            aria-current={active === "n8n" ? "page" : undefined}
          >
            n8n test
          </Link>
        </div>
      </div>
    </nav>
  );
}
