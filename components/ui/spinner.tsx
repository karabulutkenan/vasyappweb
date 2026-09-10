type SpinnerProps = {
  size?: number;
  tone?: "white" | "header";
};

export function Spinner({ size = 22, tone = "white" }: SpinnerProps) {
  const toneClass =
    tone === "white"
      ? "border-white/30 border-t-white"
      : "border-header/20 border-t-header";

  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 ${toneClass}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  );
}
