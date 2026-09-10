import type { ReactNode } from "react";
import { IconWell } from "@/components/ui/icon-well";
import { MaterialIcon } from "@/components/ui/material-icon";
import { StatusChip } from "@/components/ui/status-chip";

type NavyEntityCardProps = {
  icon: string;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeTone?: "draft" | "approved" | "idle";
  trailing?: ReactNode;
};

export function NavyEntityCard({
  icon,
  title,
  subtitle,
  badge,
  badgeTone = "idle",
  trailing,
}: NavyEntityCardProps) {
  return (
    <article className="flex items-center gap-3 rounded-card-md bg-header p-3.5">
      <IconWell>
        <MaterialIcon name={icon} size={22} />
      </IconWell>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-[15px] font-extrabold leading-[1.35] text-white">
            {title}
          </h3>
          {badge ? <StatusChip label={badge} tone={badgeTone} onNavy /> : null}
        </div>
        {subtitle ? (
          <p className="mt-0.5 truncate text-[12px] font-semibold text-on-navy-muted">
            {subtitle}
          </p>
        ) : null}
      </div>
      {trailing ?? (
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary">
          <MaterialIcon name="chevron_right" size={18} className="text-header" />
        </span>
      )}
    </article>
  );
}
