import Image from "next/image";

type BrandMarkProps = {
  size?: number;
  priority?: boolean;
  alt?: string;
  className?: string;
};

export function BrandMark({
  size = 135,
  priority = false,
  alt = "VASY",
  className,
}: BrandMarkProps) {
  return (
    <Image
      src="/vasy_icon.png"
      alt={alt}
      width={size}
      height={size}
      priority={priority}
      className={`h-auto w-auto shrink-0 rounded-full${className ? ` ${className}` : ""}`}
    />
  );
}
