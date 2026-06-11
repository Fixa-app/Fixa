"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Pencil, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Drawer } from "vaul";

type LineItem = {
  id: string;
  title: string;
  unit: string;
  rate: number;
};

const UNIT_OPTIONS: { value: string; label: string }[] = [
  { value: "hour", label: "per uur" },
  { value: "piece", label: "per stuk" },
  { value: "m2", label: "per m²" },
  { value: "meter", label: "per meter" },
  { value: "visit", label: "per bezoek" },
  { value: "day", label: "per dag" },
  { value: "project", label: "per project" },
];

const unitLabel = (unit: string) =>
  UNIT_OPTIONS.find((u) => u.value === unit)?.label ?? `per ${unit}`;

const formatRate = (rate: number) => `€ ${rate.toFixed(2).replace(".", ",")}`;

// Design-system form field treatment (see /admin/design → Form fields)
function FieldLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  return <Label className={cn("text-sm font-semibold", className)} {...props} />;
}

function FieldInput({ className, ...props }: React.ComponentProps<typeof Input>) {
  return (
    <Input
      className={cn("h-12 rounded-xl text-base", className)}
      {...props}
    />
  );
}

function LineItemCard({
  item,
  onClick,
  index,
}: {
  item: LineItem;
  onClick: () => void;
  index: number;
}) {
  const hasData = Boolean(item.title);
  return (
    <button
      onClick={onClick}
      className="flex w-full animate-in items-center gap-4 rounded-xl bg-card p-5 text-left transition-all fade-in slide-in-from-bottom-2 hover:bg-hover"
      style={{
        animationDelay: `${index * 50}ms`,
        animationDuration: "300ms",
        animationFillMode: "backwards",
      }}
      aria-label={hasData ? `${item.title} bewerken` : "Product of dienst toevoegen"}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-bold text-foreground">
          {item.title || "Naamloos item"}
        </p>
        <p className="mt-1 truncate text-sm font-medium text-muted-foreground">
          {hasData
            ? `${formatRate(item.rate)} ${unitLabel(item.unit)} · excl. btw`
            : "Nog niet ingevuld"}
        </p>
      </div>
      {hasData ? (
        <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-xl bg-muted/50 text-muted-foreground">
          <Pencil className="size-4" strokeWidth={2} />
        </div>
      ) : (
        <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/30">
          <Plus className="size-6" strokeWidth={3} />
        </div>
      )}
    </button>
  );
}

function ProductsServicesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isManual = searchParams.get("manual") === "true";

  // Load line items from sessionStorage
  const loadLineItems = (): LineItem[] => {
    if (typeof window === "undefined") return [];

    const stored = sessionStorage.getItem("onboarding_lineItems");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse line items:", e);
      }
    }
    return [];
  };

  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load data on mount (client-side only)
  useEffect(() => {
    setLineItems(loadLineItems());
    setMounted(true);
  }, []);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempItem, setTempItem] = useState<Partial<LineItem>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleContinue = async () => {
    sessionStorage.setItem("onboarding_lineItems", JSON.stringify(lineItems));
    router.push("/onboarding/v2/preview");
  };

  const handleBack = () => {
    router.push("/onboarding/v2/company");
  };

  const openEdit = (item: LineItem) => {
    setTempItem({ ...item });
    setErrors({});
    setEditingId(item.id);
  };

  const closeDrawer = () => {
    setEditingId(null);
    setTempItem({});
    setErrors({});
  };

  const validateAndSave = () => {
    const newErrors: Record<string, string> = {};

    if (!tempItem.title?.trim()) {
      newErrors.title = "Omschrijving is verplicht";
    }

    if (!tempItem.rate || tempItem.rate <= 0) {
      newErrors.rate = "Tarief moet groter zijn dan 0";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLineItems((prev) =>
      prev.map((item) =>
        item.id === editingId ? { ...item, ...tempItem } : item,
      ),
    );
    closeDrawer();
  };

  const updateTempField = (field: keyof LineItem, value: string | number) => {
    setTempItem((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <div className="mx-auto w-full max-w-2xl flex-1 space-y-6 p-6 pb-32">
          {/* Progress indicator with back button */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="flex-shrink-0 text-muted-foreground hover:text-foreground"
              aria-label="Terug naar bedrijfsgegevens"
            >
              <ArrowLeft className="size-5" />
            </Button>

            <div className="flex flex-1 items-center justify-between">
              <div className="flex-1">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-3/4 bg-primary transition-all" />
                </div>
              </div>
              <span className="ml-4 text-sm text-muted-foreground">3/4</span>
            </div>
          </div>

          {/* Header + subtitle (same style as "Upload een offerte") */}
          <div className="space-y-2">
            <h1 className="font-display text-3xl font-semibold">
              Producten &amp; diensten
            </h1>
            <p className="text-base text-muted-foreground">
              Controleer je tarieven en vul aan wat nog ontbreekt. Je kunt dit
              later aanpassen in je instellingen.
            </p>
          </div>

          {/* Line items */}
          <div className="space-y-4">
            {mounted &&
              (lineItems.length > 0 ? (
                lineItems.map((item, index) => (
                  <LineItemCard
                    key={index}
                    item={item}
                    index={index}
                    onClick={() => openEdit(item)}
                  />
                ))
              ) : (
                <div className="rounded-xl bg-card p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    Nog geen producten of diensten gevonden. Je kunt ze later
                    toevoegen in je instellingen.
                  </p>
                </div>
              ))}
          </div>
        </div>

        {/* Sticky footer button */}
        <div className="fixed inset-x-0 bottom-0 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="mx-auto flex w-full max-w-2xl justify-end p-6">
            <Button
              className="h-12 rounded-xl px-6 text-base font-bold"
              onClick={handleContinue}
              aria-label="Doorgaan naar sjabloon"
            >
              Doorgaan
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Sheet for editing */}
      <Drawer.Root
        open={editingId !== null}
        onOpenChange={(open) => !open && closeDrawer()}
      >
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="fixed right-0 bottom-0 left-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] bg-background">
            <div className="mx-auto mt-4 h-1.5 w-12 flex-shrink-0 rounded-full bg-muted" />
            <div className="flex-1 overflow-y-auto p-6">
              <Drawer.Title className="mb-6 font-display text-xl font-semibold">
                {tempItem.title || "Item bewerken"}
              </Drawer.Title>
              <div className="space-y-6">
                <div className="space-y-2">
                  <FieldLabel htmlFor="item-title">Omschrijving</FieldLabel>
                  <FieldInput
                    id="item-title"
                    value={tempItem.title || ""}
                    onChange={(e) => updateTempField("title", e.target.value)}
                    placeholder="Bijv. Uurtarief, Materiaal, Voorrijkosten"
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <FieldLabel htmlFor="item-unit">Eenheid</FieldLabel>
                  <select
                    id="item-unit"
                    value={tempItem.unit || "hour"}
                    onChange={(e) => updateTempField("unit", e.target.value)}
                    className="h-12 w-full rounded-xl border border-transparent bg-card px-3 text-base outline-none transition-colors focus-visible:border-primary"
                  >
                    {UNIT_OPTIONS.map((u) => (
                      <option key={u.value} value={u.value}>
                        {u.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <FieldLabel htmlFor="item-rate">Tarief (€, excl. btw)</FieldLabel>
                  <FieldInput
                    id="item-rate"
                    type="number"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    step="0.01"
                    min="0"
                    value={tempItem.rate || ""}
                    onChange={(e) =>
                      updateTempField("rate", parseFloat(e.target.value) || 0)
                    }
                    placeholder="0,00"
                  />
                  {errors.rate && (
                    <p className="text-sm text-destructive">{errors.rate}</p>
                  )}
                </div>

                <div className="flex gap-3 pb-safe">
                  <Button variant="outline" onClick={closeDrawer} className="flex-1">
                    Annuleren
                  </Button>
                  <Button onClick={validateAndSave} className="flex-1">
                    Opslaan
                  </Button>
                </div>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}

export default function OnboardingProductsPage() {
  return (
    <Suspense fallback={<div>Laden...</div>}>
      <ProductsServicesContent />
    </Suspense>
  );
}
