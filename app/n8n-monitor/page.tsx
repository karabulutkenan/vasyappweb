import { AppTopNav } from "@/components/app-top-nav";
import { N8N_BROWSER_MONITOR_URL } from "@/lib/constants";

export default function N8nMonitorPage() {
  const monitorUrl = N8N_BROWSER_MONITOR_URL.trim();

  return (
    <main className="flex min-h-dvh flex-1 flex-col bg-canvas">
      <AppTopNav active="n8n" />

      {monitorUrl ? (
        <iframe
          title="n8n browser izleme"
          src={monitorUrl}
          className="min-h-0 w-full flex-1 border-0"
          allow="clipboard-read; clipboard-write"
        />
      ) : (
        <section className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-6 py-10 text-center">
          <h1 className="text-2xl font-extrabold text-header">n8n izleme</h1>
          <p className="mt-3 text-sm leading-6 text-outline">
            Browserless / n8n debugger adresini Coolify ortam değişkenine ekleyin:
          </p>
          <code className="mt-4 break-all rounded-2xl bg-white px-4 py-3 text-left text-xs text-header">
            NEXT_PUBLIC_N8N_BROWSER_URL=https://browserless.metahedef.com
          </code>
          <p className="mt-4 text-sm leading-6 text-outline">
            Domain’i VASY ile Browserless arasında ayırın; ikisi de aynı host
            portunu (3000) paylaşmasın.
          </p>
        </section>
      )}
    </main>
  );
}
