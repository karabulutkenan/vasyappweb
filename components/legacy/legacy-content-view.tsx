"use client";

import {
  AudioMediaCard,
  DocumentMediaCard,
  ImageMediaCard,
  TextMessageCard,
  VideoMediaCard,
} from "@/components/legacy/legacy-cards";
import { BrandMark } from "@/components/brand-mark";
import { MaterialIcon } from "@/components/ui/material-icon";
import type { HeritageItem } from "@/lib/types";
import type { TestamentContentBlock } from "@/lib/testament-content";

type LegacyContentViewProps = {
  items: HeritageItem[];
  ownerName: string | null;
};

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-card bg-canvas/95 p-4 shadow-[0_16px_40px_rgba(52,73,94,0.08)] sm:p-5">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-chip text-header">
          <MaterialIcon name={icon} size={20} />
        </span>
        <h2 className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-outline">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function collectBlocks(items: HeritageItem[]): TestamentContentBlock[] {
  return items.flatMap((item) => item.blocks);
}

export function LegacyContentView({ items, ownerName }: LegacyContentViewProps) {
  const blocks = collectBlocks(items);
  const texts = blocks.filter((b) => b.type === "text");
  const images = blocks.filter((b) => b.type === "image");
  const videos = blocks.filter((b) => b.type === "video");
  const audios = blocks.filter((b) => b.type === "audio");
  const docs = blocks.filter((b) => b.type === "pdf" || b.type === "file");

  const hasAny =
    texts.length + images.length + videos.length + audios.length + docs.length >
    0;

  return (
    <div className="min-h-dvh bg-header">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-64 opacity-50"
        style={{
          background:
            "radial-gradient(ellipse 70% 80% at 10% 0%, color-mix(in srgb, var(--primary) 45%, transparent), transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-[1120px] px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex items-center gap-3">
          <BrandMark size={40} alt="" />
          <div className="min-w-0">
            <p className="text-[18px] font-extrabold tracking-[2.5px] text-white">
              VASY
            </p>
            <p className="text-[12px] font-semibold text-on-navy-muted">
              Dijital miras alanı
            </p>
          </div>
        </header>

        <section className="mb-6 rounded-page-sheet bg-canvas px-5 py-6 sm:px-7">
          <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-outline">
            Size bırakılanlar
          </p>
          <h1 className="mt-2 text-[26px] font-extrabold tracking-[-0.03em] text-header sm:text-[30px]">
            Mesajlar, anılar ve belgeler
          </h1>
          <p className="mt-2 max-w-2xl text-[14px] font-semibold leading-6 text-header/75">
            Mesajları, anıları ve belgeleri buradan görüntüleyebilirsiniz.
          </p>
          {ownerName ? (
            <p className="mt-3 text-[13px] font-bold text-outline">
              {ownerName} tarafından bırakıldı
            </p>
          ) : null}
        </section>

        {!hasAny ? (
          <div className="rounded-card bg-canvas px-5 py-10 text-center">
            <p className="text-[17px] font-extrabold text-header">
              Görüntülenebilir bir içerik bulunamadı.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {texts.length > 0 ? (
              <Section title="Mesajlar" icon="mail">
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {texts.map((block) =>
                    block.type === "text" ? (
                      <TextMessageCard key={block.id} block={block} />
                    ) : null,
                  )}
                </div>
              </Section>
            ) : null}

            {images.length > 0 ? (
              <Section title="Fotoğraflar" icon="photo_library">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {images.map((block) =>
                    block.type === "image" ? (
                      <ImageMediaCard key={block.id} block={block} />
                    ) : null,
                  )}
                </div>
              </Section>
            ) : null}

            {videos.length > 0 ? (
              <Section title="Videolar" icon="movie">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {videos.map((block) =>
                    block.type === "video" ? (
                      <VideoMediaCard key={block.id} block={block} />
                    ) : null,
                  )}
                </div>
              </Section>
            ) : null}

            {audios.length > 0 ? (
              <Section title="Ses kayıtları" icon="graphic_eq">
                <div className="grid gap-3 sm:grid-cols-2">
                  {audios.map((block) =>
                    block.type === "audio" ? (
                      <AudioMediaCard key={block.id} block={block} />
                    ) : null,
                  )}
                </div>
              </Section>
            ) : null}

            {docs.length > 0 ? (
              <Section title="Belgeler" icon="folder">
                <div className="grid gap-3">
                  {docs.map((block) =>
                    block.type === "pdf" || block.type === "file" ? (
                      <DocumentMediaCard key={block.id} block={block} />
                    ) : null,
                  )}
                </div>
              </Section>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
