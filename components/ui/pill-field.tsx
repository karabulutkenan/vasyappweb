import type { InputHTMLAttributes, ReactNode } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";

type PillFieldProps = {
  icon: string;
  error?: boolean;
  trailing?: ReactNode;
  surface?: "field" | "canvas";
} & Omit<InputHTMLAttributes<HTMLInputElement>, "className">;

export function PillField({
  icon,
  error = false,
  trailing,
  surface = "field",
  id,
  ...props
}: PillFieldProps) {
  const fillClass = surface === "canvas" ? "bg-canvas" : "bg-field";

  return (
    <div
      className={`flex min-h-14 w-full items-center rounded-pill px-5 py-[18px] ${fillClass} ${
        error ? "ring-2 ring-error" : ""
      }`}
    >
      <MaterialIcon name={icon} size={26} className="shrink-0 text-header" />
      <span className="mx-3 h-7 w-px shrink-0 bg-divider" aria-hidden="true" />
      <input
        id={id}
        className="min-w-0 flex-1 bg-transparent text-[15px] font-semibold text-header outline-none placeholder:text-outline disabled:opacity-60"
        {...props}
      />
      {trailing ? <span className="ml-2 shrink-0">{trailing}</span> : null}
    </div>
  );
}
