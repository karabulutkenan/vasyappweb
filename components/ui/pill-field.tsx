import type { InputHTMLAttributes, ReactNode } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";

type PillFieldProps = {
  icon: string;
  error?: boolean;
  trailing?: ReactNode;
  label?: string;
  /** Cam / frosted input — giriş ekranı için */
  glass?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "className">;

/**
 * Hap (stadium) input — design system:
 * beyaz fill, lacivert ikon/metin, outline hint.
 * Açık zeminde asla beyaz yazı kullanılmaz.
 */
export function PillField({
  icon,
  error = false,
  trailing,
  label,
  glass = false,
  id,
  ...props
}: PillFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      {label ? (
        <label
          htmlFor={id}
          className="px-0.5 text-[13px] font-bold text-header"
        >
          {label}
        </label>
      ) : null}
      <div
        className={`flex min-h-14 w-full items-center rounded-pill px-5 py-[18px] ${
          glass
            ? "border border-white/60 bg-white/70 shadow-[0_10px_30px_rgba(52,73,94,0.08)] backdrop-blur-md"
            : ""
        } ${
          error
            ? "ring-2 ring-error"
            : glass
              ? ""
              : "ring-1 ring-secondary-container"
        }`}
        style={glass ? undefined : { backgroundColor: "var(--canvas)" }}
      >
        <MaterialIcon name={icon} size={26} className="shrink-0 text-header" />
        <span
          className="mx-3 h-7 w-px shrink-0 bg-divider"
          aria-hidden="true"
        />
        <input
          id={id}
          className="pill-input min-w-0 flex-1 bg-transparent text-[15px] font-semibold leading-[1.35] outline-none disabled:opacity-60"
          style={{ color: "var(--header)" }}
          {...props}
        />
        {trailing ? <span className="ml-2 shrink-0">{trailing}</span> : null}
      </div>
    </div>
  );
}
