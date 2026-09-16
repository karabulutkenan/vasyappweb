"use client";

import { useEffect, useId, useState } from "react";

type ImageLightboxProps = {
  images: Array<{ src: string; alt: string; caption?: string }>;
  startIndex: number;
  open: boolean;
  onClose: () => void;
};

export function ImageLightbox({
  images,
  startIndex,
  open,
  onClose,
}: ImageLightboxProps) {
  const titleId = useId();
  const [index, setIndex] = useState(startIndex);

  useEffect(() => {
    if (open) {
      setIndex(startIndex);
    }
  }, [open, startIndex]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
      if (event.key === "ArrowRight") {
        setIndex((current) => (current + 1) % images.length);
      }
      if (event.key === "ArrowLeft") {
        setIndex((current) => (current - 1 + images.length) % images.length);
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, images.length, onClose]);

  if (!open || images.length === 0) {
    return null;
  }

  const current = images[index] ?? images[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex flex-col bg-black/90"
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3 text-white">
        <p id={titleId} className="truncate text-sm font-semibold">
          {current.caption || current.alt}
          {images.length > 1 ? ` · ${index + 1}/${images.length}` : ""}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="rounded-pill bg-white/15 px-3 py-1.5 text-sm font-bold hover:bg-white/25"
        >
          Kapat
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current.src}
          alt={current.alt}
          className="max-h-full max-w-full object-contain"
        />

        {images.length > 1 ? (
          <>
            <button
              type="button"
              aria-label="Önceki fotoğraf"
              onClick={() =>
                setIndex((currentIndex) =>
                  (currentIndex - 1 + images.length) % images.length,
                )
              }
              className="absolute left-3 rounded-full bg-white/20 px-3 py-2 text-white backdrop-blur hover:bg-white/30"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Sonraki fotoğraf"
              onClick={() =>
                setIndex((currentIndex) => (currentIndex + 1) % images.length)
              }
              className="absolute right-3 rounded-full bg-white/20 px-3 py-2 text-white backdrop-blur hover:bg-white/30"
            >
              ›
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
