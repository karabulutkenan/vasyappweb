import { AppTopNav } from "@/components/app-top-nav";
import { N8nTestForm } from "@/components/n8n-test-form";
import { VerificationPortal } from "@/components/verification-portal";
import { parseSearchToken } from "@/lib/validation";

export default async function Page({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const token = parseSearchToken(params.token);

  if (token) {
    return (
      <main className="flex flex-1 flex-col">
        <VerificationPortal token={token} />
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col">
      <AppTopNav active="test" />
      <N8nTestForm />
    </main>
  );
}
