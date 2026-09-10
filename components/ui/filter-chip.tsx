import type { ReactNode } from "react";

type FilterChipProps = {
  selected?: boolean;
  variant?: "default" | "add";
  children: ReactNode;
};

export function FilterChip({
  selected = false,
  variant = "default",
  children,
}: FilterChipProps) {
  const tone =
    variant === "add"
      ? "bg-heart text-white"
      : selected
        ? "bg-header text-white"
        : "bg-primary text-header";

  return (
    <span
      className={`inline-flex items-center rounded-[18px] px-3.5 py-2 text-[12px] font-bold ${tone}`}
    >
      {children}
    </span>
  );
}
