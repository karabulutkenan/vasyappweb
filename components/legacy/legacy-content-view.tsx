"use client";

import {
  AudioMediaCard,
  DocumentMediaCard,
  ImageMediaCard,
  TextMessageCard,
  VideoMediaCard,
} from "@/components/legacy/legacy-cards";
import { AuthShell } from "@/components/ui/auth-shell";
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
    <section className="rounded-[22px] border border-white/55 bg-white/65 p-4 shadow-[0_16px_40px_rgba(52,73,94,0.1)] backdrop-blur-md sm:rounded-[28px] sm:p-5">
      <div className="mb-3 flex items-center gap-2.5 sm:mb-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-chip text-header">
          <MaterialIcon name={icon} size={20} />
        </span>
        <h2 className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-outline sm:text-[13px]">
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

  const description = ownerName
    ? `${ownerName} tarafından bırakılan mesajları, anıları ve belgeleri buradan görüntüleyebilirsiniz.`
    : "Mesajları, anıları ve belgeleri buradan görüntüleyebilirsiniz.";

  return (
    <AuthShell
      variant="content"
      eyebrow="Size bırakılanlar"
      title="Mesajlar, anılar ve belgeler"
      description={description}
    >
      {!hasAny ? (
        <div className="rounded-[22px] border border-white/55 bg-white/70 px-4 py-8 text-center backdrop-blur-md sm:rounded-[28px]">
          <p className="text-[16px] font-extrabold text-header sm:text-[17px]">
            Görüntülenebilir bir içerik bulunamadı.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 sm:gap-5">
          {texts.length > 0 ? (
            <Section title="Mesajlar" icon="mail">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
              <div className="grid grid-cols-1 gap-3">
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
              <div className="grid grid-cols-1 gap-3">
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
    </AuthShell>
  );
}
