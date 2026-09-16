"use client";

import { useEffect, useId } from "react";
import { AppButton } from "@/components/ui/button";
import { MaterialIcon } from "@/components/ui/material-icon";

type LegacyModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
};

export function LegacyModal({
  open,
  title,
  onClose,
  children,
  wide = false,
}: LegacyModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-header/55 p-0 sm:items-center sm:p-6"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-page-sheet bg-canvas shadow-[0_24px_80px_rgba(52,73,94,0.28)] sm:rounded-page-sheet ${
          wide ? "sm:max-w-4xl" : "sm:max-w-xl"
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-center gap-3 border-b border-header/10 bg-field px-4 py-3 sm:px-5">
          <h2
            id={titleId}
            className="min-w-0 flex-1 truncate text-[16px] font-extrabold text-header"
          >
            {title}
          </h2>
          <AppButton variant="text" icon="close" onClick={onClose} aria-label="Kapat">
            Kapat
          </AppButton>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export function UnavailableBadge({ reason }: { reason: string }) {
  return (
    <div className="mt-3 flex items-start gap-2 rounded-card-sm bg-secondary-container px-3 py-2.5 text-[12px] font-semibold leading-5 text-outline">
      <MaterialIcon name="cloud_off" size={18} className="mt-0.5 shrink-0" />
      <span>{reason}</span>
    </div>
  );
}
