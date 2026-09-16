import { MaterialIcon } from "@/components/ui/material-icon";

type LinkBlockProps = {
  url: string;
  title?: string;
  description?: string;
};

export function LinkBlock({ url, title, description }: LinkBlockProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex w-full items-start gap-3 rounded-[22px] border border-header/10 bg-white p-4 transition hover:border-primary hover:bg-primary/[0.04]"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-chip text-header">
        <MaterialIcon name="link" size={22} />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[15px] font-extrabold text-header">
          {title || url}
        </span>
        {description ? (
          <span className="mt-1 block text-[14px] font-medium leading-6 text-outline">
            {description}
          </span>
        ) : (
          <span className="mt-1 block truncate text-[13px] font-semibold text-outline">
            {url}
          </span>
        )}
      </span>
    </a>
  );
}
