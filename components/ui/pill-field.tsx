import type { InputHTMLAttributes, ReactNode } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";

type PillFieldProps = {
  icon: string;
  error?: boolean;
  trailing?: ReactNode;
  label?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "className">;

export function PillField({
  icon,
  error = false,
  trailing,
  label,
  id,
  ...props
}: PillFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      {label ? (
        <label
          htmlFor={id}
          className="text-[13px] font-bold leading-none text-header"
        >
          {label}
        </label>
      ) : null}
      <div
        className={`flex min-h-[56px] w-full items-center rounded-pill bg-canvas px-4 transition-colors ${
          error
            ? "ring-2 ring-error"
            : "ring-1 ring-[#B7C2CC] focus-within:ring-2 focus-within:ring-header"
        }`}
      >
        <MaterialIcon name={icon} size={24} className="shrink-0 text-header" />
        <span
          className="mx-3 h-6 w-px shrink-0 bg-header/25"
          aria-hidden="true"
        />
        <input
          id={id}
          className="min-w-0 flex-1 bg-transparent text-[15px] font-semibold leading-[1.35] text-header outline-none placeholder:text-header/45 disabled:opacity-60"
          {...props}
        />
        {trailing ? <span className="ml-2 shrink-0">{trailing}</span> : null}
      </div>
    </div>
  );
}
