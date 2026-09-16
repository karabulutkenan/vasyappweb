"use client";

type ImageBlockProps = {
  url: string;
  alt: string;
  title?: string;
  description?: string;
  onOpen?: () => void;
};

export function ImageBlock({
  url,
  alt,
  title,
  description,
  onOpen,
}: ImageBlockProps) {
  return (
    <figure className="w-full">
      <button
        type="button"
        onClick={onOpen}
        className="group block w-full overflow-hidden rounded-[22px] bg-secondary-container text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        aria-label={title ? `${title} — büyüt` : "Fotoğrafı büyüt"}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={alt}
          loading="lazy"
          className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          onError={(event) => {
            event.currentTarget.style.display = "none";
            const fallback = event.currentTarget.nextElementSibling;
            if (fallback instanceof HTMLElement) {
              fallback.hidden = false;
            }
          }}
        />
        <span
          hidden
          className="flex aspect-[4/3] w-full items-center justify-center bg-secondary-container px-4 text-center text-sm font-semibold text-outline"
        >
          Fotoğraf yüklenemedi
        </span>
      </button>
      {title || description ? (
        <figcaption className="mt-3 space-y-1 px-0.5">
          {title ? (
            <p className="text-[15px] font-bold text-header">{title}</p>
          ) : null}
          {description ? (
            <p className="text-[14px] font-medium leading-6 text-outline">
              {description}
            </p>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
