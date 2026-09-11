import type { ReactNode } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";
import { AppButton } from "@/components/ui/button";

type EmptyStateProps = {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionIcon?: string;
  onAction?: () => void;
  children?: ReactNode;
  align?: "center" | "start";
};

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionIcon,
  onAction,
  children,
  align = "center",
}: EmptyStateProps) {
  const isStart = align === "start";

  return (
    <div
      className={`flex flex-col py-2 ${
        isStart ? "items-start text-left" : "items-center px-2 text-center"
      }`}
    >
      <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-chip text-header">
        <MaterialIcon name={icon} size={32} />
      </span>
      <h2 className="text-[18px] font-extrabold leading-[1.3] text-header">{title}</h2>
      <p
        className={`mt-2 text-[14px] font-semibold leading-[1.4] text-outline ${
          isStart ? "max-w-none" : "max-w-sm"
        }`}
      >
        {description}
      </p>
      {actionLabel && onAction ? (
        <div className={`mt-6 w-full ${isStart ? "" : "max-w-xs"}`}>
          <AppButton icon={actionIcon} onClick={onAction}>
            {actionLabel}
          </AppButton>
        </div>
      ) : null}
      {children}
    </div>
  );
}
