import { MaterialIcon } from "@/components/ui/material-icon";
import { Spinner } from "@/components/ui/spinner";

export function VerifyingOverlay() {
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-header/70 px-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="w-full max-w-sm rounded-card bg-field px-6 py-8 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary-well">
          <Spinner size={28} tone="header" />
        </div>
        <p className="text-[18px] font-extrabold text-header">Belge inceleniyor</p>
        <p className="mt-2 text-[14px] font-semibold leading-[1.4] text-outline">
          Devlet sistemlerinden belge doğrulanıyor, lütfen beklemeye devam
          edin...
        </p>
        <div className="mt-6 h-1.5 overflow-hidden rounded-pill bg-secondary-container">
          <div className="verifying-bar h-full w-1/2 rounded-pill bg-header" />
        </div>
        <p className="mt-4 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.8px] text-outline">
          <MaterialIcon name="verified_user" size={14} />
          Güvenli doğrulama
        </p>
      </div>
    </div>
  );
}
