import type { HeritageItem } from "@/lib/types";
import { EmptyState } from "@/components/ui/empty-state";
import { NavyEntityCard } from "@/components/ui/navy-entity-card";

type HeritageResultsProps = {
  items: HeritageItem[];
};

function formatAmount(amount: HeritageItem["amount"]): string | null {
  if (amount === null || amount === "") {
    return null;
  }

  const numeric = typeof amount === "number" ? amount : Number(amount);
  if (Number.isFinite(numeric)) {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      maximumFractionDigits: 2,
    }).format(numeric);
  }

  return String(amount);
}

function iconForType(type: string | null): string {
  const value = (type ?? "").toLocaleLowerCase("tr-TR");
  if (value.includes("banka") || value.includes("hesap")) {
    return "account_balance";
  }
  if (value.includes("kripto") || value.includes("dijital")) {
    return "account_balance_wallet";
  }
  if (value.includes("taşınmaz") || value.includes("konut") || value.includes("gayrimenkul")) {
    return "home";
  }
  if (value.includes("araç") || value.includes("vasıta")) {
    return "directions_car";
  }
  return "inventory_2";
}

function badgeTone(status: string | null): "draft" | "approved" | "idle" {
  const value = (status ?? "").toLocaleLowerCase("tr-TR");
  if (value.includes("onay") || value.includes("aktif")) {
    return "approved";
  }
  if (value.includes("taslak")) {
    return "draft";
  }
  return "idle";
}

export function HeritageResults({ items }: HeritageResultsProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon="folder_off"
        title="Kayıt bulunamadı"
        description="Belge doğrulandı ancak bu bağlantı için listelenecek bir dijital varlık kaydı yok."
      />
    );
  }

  return (
    <div>
      <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.8px] text-outline">
        Dijital varlıklar
      </p>
      <ul className="grid gap-2.5 md:grid-cols-2">
        {items.map((item) => {
          const amount = formatAmount(item.amount);
          const subtitle = [item.type, item.institution, amount, item.description]
            .filter(Boolean)
            .join(" · ");

          return (
            <li key={item.id}>
              <NavyEntityCard
                icon={iconForType(item.type)}
                title={item.title}
                subtitle={subtitle || undefined}
                badge={item.status ?? undefined}
                badgeTone={badgeTone(item.status)}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
