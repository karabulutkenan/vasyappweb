import { AppTopNav } from "@/components/app-top-nav";
import { N8nTestForm } from "@/components/n8n-test-form";

/** Geçici n8n webhook test sayfası — üretim doğrulama akışından ayrı. */
export default function N8nTestPage() {
  return (
    <main className="flex flex-1 flex-col">
      <AppTopNav active="n8ntest" />
      <N8nTestForm />
    </main>
  );
}
