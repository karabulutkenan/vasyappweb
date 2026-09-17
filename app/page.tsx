import { VerificationPortal } from "@/components/verification-portal";
import { parseSearchToken } from "@/lib/validation";
import { fetchGuardianDisplayNameByToken } from "@/lib/verify-record";

export default async function Page({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const token = parseSearchToken(params.token);
  const guardianName = token
    ? await fetchGuardianDisplayNameByToken(token)
    : null;

  return (
    <main className="flex flex-1 flex-col">
      <VerificationPortal token={token} guardianName={guardianName} />
    </main>
  );
}
