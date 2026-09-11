import type { InputHTMLAttributes, ReactNode } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";

type PillFieldProps = {
  icon: string;
  error?: boolean;
  trailing?: ReactNode;
  surface?: "field" | "canvas" | "auth";
  label?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "className">;

export function PillField({
  icon,
  error = false,
  trailing,
  surface = "field",
  label,
  id,
  ...props
}: PillFieldProps) {
  const fillClass =
    surface === "canvas"
      ? "bg-canvas"
      : surface === "auth"
        ? "bg-canvas lg:bg-field"
        : "bg-field";

  return (
    <div className="flex flex-col gap-2">
      {label ? (
        <label
          htmlFor={id}
          className="px-1 text-[11px] font-extrabold uppercase tracking-[0.8px] text-outline"
        >
          {label}
        </label>
      ) : null}
      <div
        className={`flex min-h-14 w-full items-center rounded-pill px-4 py-3.5 transition-colors ${fillClass} ${
          error
            ? "ring-2 ring-error"
            : "ring-1 ring-secondary-container focus-within:ring-2 focus-within:ring-primary"
        }`}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[14px] bg-primary-well text-primary">
          <MaterialIcon name={icon} size={22} />
        </span>
        <span
          className="mx-3 h-7 w-px shrink-0 bg-divider"
          aria-hidden="true"
        />
        <input
          id={id}
          className="min-w-0 flex-1 bg-transparent text-[15px] font-semibold leading-[1.35] text-header outline-none placeholder:font-semibold placeholder:text-outline/80 disabled:opacity-60"
          {...props}
        />
        {trailing ? <span className="ml-2 shrink-0">{trailing}</span> : null}
      </div>
    </div>
  );
}
