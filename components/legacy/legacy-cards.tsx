"use client";

import { useState } from "react";
import { LegacyModal, UnavailableBadge } from "@/components/legacy/legacy-modal";
import { MaterialIcon } from "@/components/ui/material-icon";
import type { TestamentContentBlock } from "@/lib/testament-content";

type TextMessageCardProps = {
  block: Extract<TestamentContentBlock, { type: "text" }>;
};

export function TextMessageCard({ block }: TextMessageCardProps) {
  const [open, setOpen] = useState(false);
  const preview =
    block.text.length > 140 ? `${block.text.slice(0, 140).trim()}…` : block.text;

  return (
    <>
      <article className="flex h-full flex-col rounded-card-md bg-header p-4 shadow-[0_12px_28px_rgba(52,73,94,0.14)] transition hover:brightness-[1.03]">
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-icon-well bg-primary-well text-white">
            <MaterialIcon name="mail" size={22} />
          </span>
          <h3 className="text-[15px] font-extrabold text-white">
            {block.title ?? "Mesaj"}
          </h3>
        </div>
        <p className="line-clamp-4 flex-1 text-[13px] font-semibold leading-5 text-on-navy-muted">
          {preview}
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-4 inline-flex min-h-11 items-center justify-center rounded-pill bg-primary px-4 text-[14px] font-extrabold text-header transition hover:brightness-95"
        >
          Oku
        </button>
      </article>

      <LegacyModal
        open={open}
        title={block.title ?? "Mesaj"}
        onClose={() => setOpen(false)}
      >
        <div className="mx-auto max-w-[40rem] whitespace-pre-wrap text-[17px] font-medium leading-[1.75] text-header">
          {block.text}
        </div>
      </LegacyModal>
    </>
  );
}

type MediaCardProps = {
  block: Extract<
    TestamentContentBlock,
    { type: "image" | "video" | "audio" | "pdf" | "file" }
  >;
};

export function ImageMediaCard({ block }: MediaCardProps) {
  const [open, setOpen] = useState(false);
  const playable = Boolean(block.url) && !block.unavailable;

  return (
    <>
      <article className="overflow-hidden rounded-card-md bg-field shadow-[0_12px_28px_rgba(52,73,94,0.1)]">
        <button
          type="button"
          disabled={!playable}
          onClick={() => playable && setOpen(true)}
          className="group relative block w-full text-left disabled:cursor-default"
          aria-label={playable ? `${block.fileName} — büyüt` : block.fileName}
        >
          {playable ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={block.url ?? undefined}
              alt={block.fileName}
              className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 bg-secondary-container px-4 text-center">
              <MaterialIcon name="image" size={36} className="text-outline" />
              <p className="truncate text-[13px] font-bold text-header">
                {block.fileName}
              </p>
            </div>
          )}
        </button>
        <div className="p-3.5">
          <p className="truncate text-[14px] font-extrabold text-header">
            {block.fileName}
          </p>
          {block.unavailableReason ? (
            <UnavailableBadge reason={block.unavailableReason} />
          ) : (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-3 inline-flex min-h-10 items-center rounded-pill bg-header px-3 text-[13px] font-bold text-white"
            >
              Görüntüle
            </button>
          )}
        </div>
      </article>

      {playable ? (
        <LegacyModal
          open={open}
          title={block.fileName}
          onClose={() => setOpen(false)}
          wide
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={block.url ?? undefined}
            alt={block.fileName}
            className="mx-auto max-h-[70dvh] w-auto max-w-full rounded-card-sm object-contain"
          />
          <div className="mt-4 flex justify-center">
            <a
              href={block.url ?? "#"}
              download={block.fileName}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center rounded-pill border border-header/20 bg-white px-4 text-[14px] font-bold text-header"
            >
              İndir
            </a>
          </div>
        </LegacyModal>
      ) : null}
    </>
  );
}

export function VideoMediaCard({ block }: MediaCardProps) {
  const [open, setOpen] = useState(false);
  const playable = Boolean(block.url) && !block.unavailable;

  return (
    <>
      <article className="overflow-hidden rounded-card-md bg-header p-3.5 shadow-[0_12px_28px_rgba(52,73,94,0.14)]">
        <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-card-sm bg-black/35">
          <MaterialIcon name="play_circle" size={48} className="text-primary" />
        </div>
        <p className="mt-3 truncate text-[14px] font-extrabold text-white">
          {block.fileName}
        </p>
        {block.unavailableReason ? (
          <UnavailableBadge reason={block.unavailableReason} />
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-pill bg-primary text-[14px] font-extrabold text-header"
          >
            Oynat
          </button>
        )}
      </article>

      {playable ? (
        <LegacyModal
          open={open}
          title={block.fileName}
          onClose={() => setOpen(false)}
          wide
        >
          <video
            controls
            playsInline
            className="aspect-video w-full rounded-card-sm bg-black"
            src={block.url ?? undefined}
          >
            Tarayıcınız video oynatmayı desteklemiyor.
          </video>
          <div className="mt-4 flex justify-center">
            <a
              href={block.url ?? "#"}
              download={block.fileName}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center rounded-pill border border-header/20 bg-white px-4 text-[14px] font-bold text-header"
            >
              Videoyu indir
            </a>
          </div>
        </LegacyModal>
      ) : null}
    </>
  );
}

export function AudioMediaCard({ block }: MediaCardProps) {
  const playable = Boolean(block.url) && !block.unavailable;

  return (
    <article className="rounded-card-md bg-field p-4 shadow-[0_12px_28px_rgba(52,73,94,0.1)]">
      <div className="mb-3 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-icon-well bg-primary-chip text-header">
          <MaterialIcon name="graphic_eq" size={22} />
        </span>
        <p className="min-w-0 truncate text-[14px] font-extrabold text-header">
          {block.fileName}
        </p>
      </div>
      {playable ? (
        <>
          <audio controls className="w-full" src={block.url ?? undefined}>
            Tarayıcınız ses oynatmayı desteklemiyor.
          </audio>
          <a
            href={block.url ?? "#"}
            download={block.fileName}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex min-h-10 items-center rounded-pill border border-header/20 px-3 text-[13px] font-bold text-header"
          >
            İndir
          </a>
        </>
      ) : (
        <UnavailableBadge
          reason={block.unavailableReason ?? "Ses dosyası kullanılamıyor."}
        />
      )}
    </article>
  );
}

export function DocumentMediaCard({ block }: MediaCardProps) {
  const playable = Boolean(block.url) && !block.unavailable;

  return (
    <article className="flex flex-col gap-3 rounded-card-md bg-field p-4 shadow-[0_12px_28px_rgba(52,73,94,0.1)] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-icon-well bg-primary-chip text-header">
          <MaterialIcon
            name={block.kind === "pdf" ? "picture_as_pdf" : "draft"}
            size={24}
          />
        </span>
        <div className="min-w-0">
          <p className="truncate text-[14px] font-extrabold text-header">
            {block.fileName}
          </p>
          <p className="mt-0.5 text-[12px] font-bold uppercase tracking-[0.08em] text-outline">
            {block.kind === "pdf" ? "PDF" : "Dosya"}
          </p>
        </div>
      </div>
      {playable ? (
        <div className="flex flex-wrap gap-2">
          <a
            href={block.url ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center rounded-pill bg-header px-4 text-[13px] font-bold text-white"
          >
            Görüntüle
          </a>
          <a
            href={block.url ?? "#"}
            download={block.fileName}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center rounded-pill border border-header/20 bg-canvas px-4 text-[13px] font-bold text-header"
          >
            İndir
          </a>
        </div>
      ) : (
        <UnavailableBadge
          reason={block.unavailableReason ?? "Belge kullanılamıyor."}
        />
      )}
    </article>
  );
}
