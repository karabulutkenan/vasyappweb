"use client";

import { useState } from "react";
import { LegacyContentView } from "@/components/legacy/legacy-content-view";
import { LegacyWelcome } from "@/components/legacy/legacy-welcome";
import type { HeritageItem } from "@/lib/types";

type DigitalLegacyExperienceProps = {
  items: HeritageItem[];
  ownerName: string | null;
};

export function DigitalLegacyExperience({
  items,
  ownerName,
}: DigitalLegacyExperienceProps) {
  const [ready, setReady] = useState(false);

  if (!ready) {
    return (
      <div className="animate-[fadeIn_280ms_ease-out]">
        <LegacyWelcome
          ownerName={ownerName}
          onReady={() => setReady(true)}
        />
      </div>
    );
  }

  return (
    <div className="animate-[fadeIn_320ms_ease-out]">
      <LegacyContentView items={items} ownerName={ownerName} />
    </div>
  );
}
