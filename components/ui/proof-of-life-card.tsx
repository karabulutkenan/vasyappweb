import type { ReactNode } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";

export type ProofOfLifeTone = "disabled" | "healthy" | "warning" | "danger";

type ProofOfLifeCardProps = {
  tone: ProofOfLifeTone;
  title: string;
  trailing?: ReactNode;
};

const toneClass: Record<ProofOfLifeTone, string> = {
  disabled: "bg-pol-disabled text-outline",
  healthy: "bg-pol text-header",
  warning: "bg-pol-warning text-white",
  danger: "bg-pol-danger text-white",
};

const heartClass: Record<ProofOfLifeTone, string> = {
  disabled: "text-outline",
  healthy: "text-heart",
  warning: "text-heart",
  danger: "text-white",
};

export function ProofOfLifeCard({
  tone,
  title,
  trailing,
}: ProofOfLifeCardProps) {
  return (
    <div
      className={`flex items-center gap-3 rounded-card-sm px-3.5 py-3 ${toneClass[tone]}`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white">
        <MaterialIcon
          name="favorite"
          filled={tone !== "disabled"}
          size={20}
          className={heartClass[tone]}
        />
      </span>
      <p className="min-w-0 flex-1 text-[14px] font-extrabold">{title}</p>
      {trailing ? (
        <div className="shrink-0 text-[16px] font-extrabold tabular-nums">
          {trailing}
        </div>
      ) : null}
    </div>
  );
}
