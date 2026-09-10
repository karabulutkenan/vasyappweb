"use client";

import { useEffect } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";

export type ToastTone = "error" | "success" | "info";

export type ToastState = {
  tone: ToastTone;
  message: string;
} | null;

type ToastBannerProps = {
  toast: ToastState;
  onDismiss: () => void;
};

const toneIcon: Record<NonNullable<ToastState>["tone"], string> = {
  error: "error",
  success: "check_circle",
  info: "info",
};

export function ToastBanner({ toast, onDismiss }: ToastBannerProps) {
  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = window.setTimeout(onDismiss, 5600);
    return () => window.clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) {
    return null;
  }

  return (
    <div
      role="alert"
      className="fixed bottom-6 left-5 right-5 z-50 mx-auto flex max-w-md items-start gap-3 rounded-pill bg-header px-5 py-3.5 text-[14px] font-semibold text-white sm:left-auto sm:right-6"
    >
      <MaterialIcon name={toneIcon[toast.tone]} filled size={20} className="mt-0.5" />
      <p className="flex-1 leading-[1.4]">{toast.message}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="rounded-full p-0.5 text-white/80 hover:bg-white/8 hover:text-white"
        aria-label="Bildirimi kapat"
      >
        <MaterialIcon name="close" size={18} />
      </button>
    </div>
  );
}
