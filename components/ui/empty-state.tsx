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
};

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionIcon,
  onAction,
  children,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center px-4 py-8 text-center">
      <span className="mb-5 flex h-[86px] w-[86px] items-center justify-center rounded-full bg-primary-chip text-header">
        <MaterialIcon name={icon} size={40} />
      </span>
      <h2 className="text-[18px] font-extrabold text-header">{title}</h2>
      <p className="mt-2 max-w-sm text-[14px] font-semibold leading-[1.4] text-outline">
        {description}
      </p>
      {actionLabel && onAction ? (
        <div className="mt-6 w-full max-w-xs">
          <AppButton icon={actionIcon} onClick={onAction}>
            {actionLabel}
          </AppButton>
        </div>
      ) : null}
      {children}
    </div>
  );
}
