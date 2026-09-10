import type { ReactNode } from "react";

type IconWellProps = {
  children: ReactNode;
  className?: string;
};

export function IconWell({ children, className }: IconWellProps) {
  return (
    <span
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-icon-well bg-primary-well text-primary ${className ?? ""}`}
    >
      {children}
    </span>
  );
}
