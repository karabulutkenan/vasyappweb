import type { ButtonHTMLAttributes, ReactNode } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";
import { Spinner } from "@/components/ui/spinner";

type ButtonVariant = "primary" | "outlined" | "danger" | "positive" | "text" | "accent";

type AppButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  loading?: boolean;
  icon?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">;

const variantClass: Record<ButtonVariant, string> = {
  primary: "min-h-14 bg-header text-white hover:bg-header-hover",
  accent: "min-h-14 bg-primary text-header hover:brightness-[0.96]",
  outlined:
    "min-h-[52px] border-[1.5px] border-header bg-transparent text-header hover:bg-header/[0.08]",
  danger: "min-h-14 bg-logout text-white hover:brightness-[0.92]",
  positive: "min-h-14 bg-heart text-white hover:brightness-[0.92]",
  text: "min-h-11 bg-transparent px-3 text-header hover:bg-header/[0.08]",
};

const mutedClass: Record<ButtonVariant, string> = {
  primary: "bg-secondary-container text-on-secondary-container hover:bg-secondary-container",
  accent: "bg-secondary-container text-on-secondary-container hover:bg-secondary-container",
  outlined: "border-secondary-container text-outline hover:bg-transparent",
  danger: "opacity-60 hover:brightness-100",
  positive: "opacity-60 hover:brightness-100",
  text: "text-outline hover:bg-transparent",
};

export function AppButton({
  children,
  variant = "primary",
  loading = false,
  icon,
  disabled,
  type = "button",
  ...props
}: AppButtonProps) {
  const isDisabled = Boolean(disabled) || loading;
  const isMuted = Boolean(disabled) && !loading;
  const isFilled =
    variant === "primary" ||
    variant === "danger" ||
    variant === "positive" ||
    variant === "accent";

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={`inline-flex w-full items-center justify-center gap-2 rounded-pill px-5 text-[16px] font-extrabold tracking-[0.6px] transition-colors disabled:cursor-not-allowed ${variantClass[variant]} ${
        isMuted ? mutedClass[variant] : ""
      } ${variant === "outlined" ? "text-[15px] font-bold" : ""} ${
        variant === "text" ? "w-auto text-[15px] font-bold tracking-[0.4px]" : ""
      }`}
      {...props}
    >
      {loading ? (
        <Spinner tone={isFilled ? "white" : "header"} />
      ) : (
        <>
          {icon ? <MaterialIcon name={icon} size={22} filled={isFilled} /> : null}
          <span>{children}</span>
        </>
      )}
    </button>
  );
}
