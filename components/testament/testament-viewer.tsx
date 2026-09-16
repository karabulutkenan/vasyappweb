"use client";

import { useMemo, useState } from "react";
import { ContentRenderer } from "@/components/testament/content-renderer";
import { TestamentHeader } from "@/components/testament/testament-header";
import { MaterialIcon } from "@/components/ui/material-icon";
import type { HeritageItem } from "@/lib/types";

type TestamentViewerProps = {
  items: HeritageItem[];
};

function sectionLabels(item: HeritageItem): string[] {
  const labels = new Set<string>();
  for (const block of item.blocks) {
    if (block.type === "text") {
      labels.add("Mesaj");
    } else if (block.type === "image") {
      labels.add("Fotoğraflar");
    } else if (block.type === "video") {
      labels.add("Videolar");
    } else if (block.type === "audio") {
      labels.add("Ses");
    } else if (block.type === "pdf" || block.type === "file") {
      labels.add("Belgeler");
    } else if (block.type === "link") {
      labels.add("Bağlantılar");
    }
  }
  return Array.from(labels);
}

export function TestamentViewer({ items }: TestamentViewerProps) {
  const [selectedId, setSelectedId] = useState<string | null>(
    items.length === 1 ? items[0]?.id ?? null : null,
  );

  const selected = useMemo(
    () => items.find((item) => item.id === selectedId) ?? null,
    [items, selectedId],
  );

  if (items.length === 0) {
    return (
      <div className="rounded-[24px] bg-white px-5 py-10 text-center shadow-[0_12px_40px_rgba(52,73,94,0.06)]">
        <p className="text-[17px] font-extrabold text-header">
          Görüntülenebilir bir içerik bulunamadı.
        </p>
        <p className="mt-2 text-[14px] font-semibold text-outline">
          Bu bağlantı için henüz paylaşılmış bir vasiyet içeriği yok.
        </p>
      </div>
    );
  }

  if (!selected) {
    return (
      <div className="mx-auto w-full max-w-3xl">
        <TestamentHeader
          title="Vasiyetleriniz"
          subtleNote="Kimlik doğrulandı. Görüntülemek istediğiniz vasiyeti seçin."
        />
        <ul className="grid gap-3">
          {items.map((item) => {
            const sections = sectionLabels(item);
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className="flex w-full items-start justify-between gap-4 rounded-[22px] border border-header/10 bg-white px-5 py-4 text-left shadow-[0_10px_30px_rgba(52,73,94,0.05)] transition hover:border-primary hover:bg-primary/[0.04]"
                >
                  <span className="min-w-0">
                    <span className="block text-[17px] font-extrabold tracking-[-0.02em] text-header">
                      {item.title}
                    </span>
                    {item.previewText ? (
                      <span className="mt-2 line-clamp-2 block text-[14px] font-medium leading-6 text-outline">
                        {item.previewText}
                      </span>
                    ) : null}
                    {sections.length > 0 ? (
                      <span className="mt-3 block text-[12px] font-bold uppercase tracking-[0.08em] text-outline/80">
                        {sections.join(" · ")}
                      </span>
                    ) : null}
                  </span>
                  <MaterialIcon
                    name="chevron_right"
                    size={24}
                    className="mt-0.5 shrink-0 text-outline"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      {items.length > 1 ? (
        <button
          type="button"
          onClick={() => setSelectedId(null)}
          className="mb-5 inline-flex min-h-10 items-center gap-1 rounded-pill px-2 text-[14px] font-bold text-outline transition hover:bg-header/[0.05] hover:text-header"
        >
          <MaterialIcon name="arrow_back" size={18} />
          Tüm vasiyetler
        </button>
      ) : null}

      <TestamentHeader
        title={selected.title}
        subtleNote="Kimlik doğrulandı"
      />

      <ContentRenderer blocks={selected.blocks} />
    </div>
  );
}
