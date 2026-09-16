import { VerificationPortal } from "@/components/verification-portal";
import { parseSearchToken } from "@/lib/validation";

export default async function Page({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const token = parseSearchToken(params.token);

  return (
    <main className="flex flex-1 flex-col">
      <VerificationPortal token={token} />
    </main>
  );
}
