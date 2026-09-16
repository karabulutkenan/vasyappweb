"use client";

import { useMemo, useState } from "react";
import { AudioBlock } from "@/components/testament/blocks/audio-block";
import { FileBlock } from "@/components/testament/blocks/file-block";
import { ImageBlock } from "@/components/testament/blocks/image-block";
import { LinkBlock } from "@/components/testament/blocks/link-block";
import { TextBlock } from "@/components/testament/blocks/text-block";
import { VideoBlock } from "@/components/testament/blocks/video-block";
import { ImageLightbox } from "@/components/testament/image-lightbox";
import type { TestamentContentBlock } from "@/lib/testament-content";

type ContentRendererProps = {
  blocks: TestamentContentBlock[];
};

export function ContentRenderer({ blocks }: ContentRendererProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const images = useMemo(
    () =>
      blocks
        .filter((block) => block.type === "image")
        .map((block) => {
          if (block.type !== "image") {
            return { src: "", alt: "" };
          }
          return {
            src: block.url,
            alt: block.alt ?? block.title ?? "Vasiyet fotoğrafı",
            caption: block.title ?? block.description,
          };
        }),
    [blocks],
  );

  if (blocks.length === 0) {
    return (
      <p className="rounded-[22px] bg-white px-5 py-8 text-center text-[15px] font-semibold text-outline">
        Görüntülenebilir bir içerik bulunamadı.
      </p>
    );
  }

  let imageOrdinal = -1;

  return (
    <>
      <div className="flex flex-col gap-10">
        {blocks.map((block) => {
          if (block.type === "text") {
            return (
              <TextBlock
                key={block.id}
                text={block.text}
                title={block.title}
              />
            );
          }

          if (block.type === "image") {
            imageOrdinal += 1;
            const currentImageIndex = imageOrdinal;
            return (
              <ImageBlock
                key={block.id}
                url={block.url}
                alt={block.alt ?? block.title ?? "Vasiyet fotoğrafı"}
                title={block.title}
                description={block.description}
                onOpen={() => setLightboxIndex(currentImageIndex)}
              />
            );
          }

          if (block.type === "video") {
            return (
              <VideoBlock
                key={block.id}
                url={block.url}
                title={block.title}
                description={block.description}
                poster={block.poster}
              />
            );
          }

          if (block.type === "audio") {
            return (
              <AudioBlock
                key={block.id}
                url={block.url}
                title={block.title}
                description={block.description}
              />
            );
          }

          if (block.type === "pdf" || block.type === "file") {
            return (
              <FileBlock
                key={block.id}
                url={block.url}
                kind={block.type}
                name={block.name ?? "Dosya"}
                mimeType={block.mimeType}
                sizeBytes={block.sizeBytes}
                title={block.title}
              />
            );
          }

          if (block.type === "link") {
            return (
              <LinkBlock
                key={block.id}
                url={block.url}
                title={block.title}
                description={block.description}
              />
            );
          }

          return null;
        })}
      </div>

      <ImageLightbox
        images={images}
        startIndex={lightboxIndex ?? 0}
        open={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
      />
    </>
  );
}
