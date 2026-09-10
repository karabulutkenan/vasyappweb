import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <main className="flex flex-1 items-center justify-center bg-canvas px-4">
      <div className="flex flex-col items-center gap-4">
        <Spinner size={32} tone="header" />
        <p className="text-[14px] font-semibold text-outline">VASY hazırlanıyor...</p>
      </div>
    </main>
  );
}
