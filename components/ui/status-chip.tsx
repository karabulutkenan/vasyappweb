type StatusTone = "draft" | "approved" | "idle";

type StatusChipProps = {
  label: string;
  tone?: StatusTone;
  onNavy?: boolean;
};

const canvasTone: Record<StatusTone, string> = {
  draft: "bg-primary-chip text-header",
  approved: "bg-approved text-header",
  idle: "bg-outline/18 text-header",
};

const navyTone: Record<StatusTone, string> = {
  draft: "bg-white-12 text-white",
  approved: "bg-approved-navy text-white",
  idle: "bg-white-12 text-white",
};

export function StatusChip({
  label,
  tone = "idle",
  onNavy = false,
}: StatusChipProps) {
  return (
    <span
      className={`inline-flex items-center rounded-pill px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.4px] ${
        onNavy ? navyTone[tone] : canvasTone[tone]
      }`}
    >
      {label}
    </span>
  );
}
