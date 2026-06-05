"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Drawer } from "vaul";

type ItemType = 'labor' | 'transport' | 'material' | 'other';

type LineItem = {
  id: string;
  title: string;
  unit: string;
  rate: number;
  item_type: ItemType;
};

function ProductsServicesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isManual = searchParams.get("manual") === "true";

  const loadLineItems = (): LineItem[] => {
    if (typeof window === 'undefined') return [];
    const stored = sessionStorage.getItem('onboarding_lineItems');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse line items:', e);
      }
    }
    return [];
  };

  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempItem, setTempItem] = useState<Partial<LineItem>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setLineItems(loadLineItems());
    setMounted(true);
  }, []);

  const handleContinue = async () => {
    sessionStorage.setItem('onboarding_lineItems', JSON.stringify(lineItems));
    router.push("/onboarding/preview");
  };

  const handleBack = () => {
    router.push("/onboarding/company");
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
    if (!tempItem.title?.trim()) newErrors.title = "Titel is verplicht";
    if (!tempItem.rate || tempItem.rate <= 0) newErrors.rate = "Tarief moet groter zijn dan 0";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLineItems((prev) =>
      prev.map((item) => (item.id === editingId ? { ...item, ...tempItem } : item))
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

  const LineItemCard = ({ item }: { item: LineItem }) => {
    const isEmpty = !item.title;
    return (
      <button
        onClick={() => openEdit(item)}
        className="flex w-full items-center gap-4 rounded-xl border border-border bg-card p-5 text-left transition-all hover:bg-muted/40 animate-in fade-in slide-in-from-bottom-2"
        style={{
          animationDelay: `${lineItems.indexOf(item) * 100}ms`,
          animationDuration: "300ms",
          animationFillMode: "backwards",
        }}
        aria-label={isEmpty ? "Item toevoegen" : `Bewerk ${item.title}`}
      >
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-foreground">
            {item.title || "Naamloos item"}
          </h3>
          <p className="mt-1 truncate text-sm text-muted-foreground">
            {isEmpty
              ? "Niet herkend"
              : `€${item.rate.toFixed(2)} per ${item.unit}, ex BTW`}
          </p>
        </div>
        {isEmpty && (
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-muted">
            <svg className="h-5 w-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        )}
      </button>
    );
  };

  const genericItems = lineItems.filter(i => i.item_type !== 'other');
  const specificItems = lineItems.filter(i => i.item_type === 'other');

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <div className="flex-1 space-y-6 pb-32 p-6 mx-auto w-full max-w-2xl">
          {/* Progress */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="flex-shrink-0 text-muted-foreground hover:text-foreground"
              aria-label="Terug naar bedrijfsgegevens"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
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

          <h1 className="font-display text-3xl font-bold">Producten & diensten</h1>

          {!mounted ? (
            <div className="rounded-xl border border-muted bg-muted/20 p-8 text-center">
              <p className="text-sm text-muted-foreground">Laden...</p>
            </div>
          ) : lineItems.length === 0 ? (
            <div className="rounded-xl border border-muted bg-muted/20 p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Geen producten of diensten herkend. Je kunt ze later toevoegen in je instellingen.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {genericItems.length > 0 && (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">Terugkerende posten</p>
                    <p className="text-xs text-muted-foreground">Komen vooraf ingevuld bij nieuwe offertes</p>
                  </div>
                  {genericItems.map((item, index) => (
                    <LineItemCard key={index} item={item} />
                  ))}
                </div>
              )}

              {specificItems.length > 0 && (
                <div className="space-y-3">
                  {genericItems.length > 0 && (
                    <div>
                      <p className="text-sm font-medium">Overige posten</p>
                      <p className="text-xs text-muted-foreground">Klus- of productspecifiek</p>
                    </div>
                  )}
                  {specificItems.map((item, index) => (
                    <LineItemCard key={index} item={item} />
                  ))}
                </div>
              )}
            </div>
          )}

          <p className="text-center text-sm text-muted-foreground">
            Je kunt dit later aanpassen in je instellingen
          </p>
        </div>

        <div className="fixed inset-x-0 bottom-0 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="mx-auto w-full max-w-2xl p-6">
            <Button className="w-full" onClick={handleContinue} aria-label="Doorgaan naar voorvertoning">
              Doorgaan
            </Button>
          </div>
        </div>
      </div>

      <Drawer.Root open={editingId !== null} onOpenChange={(open) => !open && closeDrawer()}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] bg-background">
            <div className="mx-auto mt-4 h-1.5 w-12 flex-shrink-0 rounded-full bg-muted" />
            <div className="flex-1 overflow-y-auto p-6">
              <Drawer.Title className="mb-6 font-display text-xl font-semibold">
                {tempItem.title || "Item bewerken"}
              </Drawer.Title>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="item-title">Titel</Label>
                  <Input
                    id="item-title"
                    value={tempItem.title || ""}
                    onChange={(e) => updateTempField("title", e.target.value)}
                    placeholder="Bijv. Uurloon, Materiaal, Voorrijkosten"
                  />
                  {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="item-unit">Eenheid</Label>
                  <select
                    id="item-unit"
                    value={tempItem.unit || "hour"}
                    onChange={(e) => updateTempField("unit", e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="hour">per uur</option>
                    <option value="piece">per stuk</option>
                    <option value="m2">per m²</option>
                    <option value="meter">per meter</option>
                    <option value="visit">per bezoek</option>
                    <option value="day">per dag</option>
                    <option value="project">per project</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="item-rate">Tarief (€, ex BTW)</Label>
                  <Input
                    id="item-rate"
                    type="number"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    step="0.01"
                    min="0"
                    value={tempItem.rate || ""}
                    onChange={(e) => updateTempField("rate", parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                  {errors.rate && <p className="text-sm text-destructive">{errors.rate}</p>}
                </div>

                <div className="flex gap-3 pb-safe">
                  <Button variant="outline" onClick={closeDrawer} className="flex-1">Annuleren</Button>
                  <Button onClick={validateAndSave} className="flex-1">Opslaan</Button>
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