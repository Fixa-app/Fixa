"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

// Wrapper component for useSearchParams
function ProductsServicesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isManual = searchParams.get("manual") === "true";

  // Load line items from sessionStorage
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

  // Load data on mount (client-side only)
  useEffect(() => {
    setLineItems(loadLineItems());
    setMounted(true);
  }, []);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempItem, setTempItem] = useState<Partial<LineItem>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleContinue = async () => {
    // Save to sessionStorage
    sessionStorage.setItem('onboarding_lineItems', JSON.stringify(lineItems));

    // Navigate to next step (template preview)
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
      newErrors.title = "Title is required";
    }

    if (!tempItem.rate || tempItem.rate <= 0) {
      newErrors.rate = "Rate must be greater than 0";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Update line item
    setLineItems((prev) =>
      prev.map((item) =>
        item.id === editingId ? { ...item, ...tempItem } : item
      )
    );
    closeDrawer();
  };

  const updateTempField = (field: keyof LineItem, value: string | number) => {
    setTempItem((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
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
        aria-label={isEmpty ? "Add line item" : `Edit ${item.title}`}
      >
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-foreground">
            {item.title || "Untitled item"}
          </h3>
          <p className="mt-1 truncate text-sm text-muted-foreground">
            {isEmpty
              ? "Not detected"
              : `€${item.rate.toFixed(2)} per ${item.unit}, ex VAT`}
          </p>
        </div>

        {/* Action icon - only show plus for empty items */}
        {isEmpty && (
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-muted">
            <svg
              className="h-5 w-5 text-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
        )}
      </button>
    );
  };

  return (
    <>
      <div className="flex min-h-screen flex-col">
        {/* Scrollable content */}
        <div className="flex-1 space-y-6 pb-32 p-6 mx-auto w-full max-w-2xl">
          {/* Progress indicator with back button */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="flex-shrink-0 text-muted-foreground hover:text-foreground"
              aria-label="Go back to company info"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
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

          {/* Title */}
          <h1 className="font-display text-3xl font-bold">
            Your products & services
          </h1>

          {/* Line items */}
          <div className="space-y-4">
            {!mounted ? (
              <div className="rounded-xl border border-muted bg-muted/20 p-8 text-center">
                <p className="text-sm text-muted-foreground">Loading...</p>
              </div>
            ) : lineItems.length > 0 ? (
              lineItems.map((item, index) => <LineItemCard key={index} item={item} />)
            ) : (
              <div className="rounded-xl border border-muted bg-muted/20 p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No products or services detected. You can add them later in
                  your settings.
                </p>
              </div>
            )}
          </div>

          {/* Help text */}
          <p className="text-center text-sm text-muted-foreground">
            You can also change this later in your settings
          </p>
        </div>

        {/* Sticky footer button */}
        <div className="fixed inset-x-0 bottom-0 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="mx-auto w-full max-w-2xl p-6">
            <Button
              className="w-full"
              onClick={handleContinue}
              aria-label="Continue to template preview"
            >
              Continue
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
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] bg-background">
            <div className="mx-auto mt-4 h-1.5 w-12 flex-shrink-0 rounded-full bg-muted" />
            <div className="flex-1 overflow-y-auto p-6">
              <Drawer.Title className="mb-6 font-display text-xl font-semibold">
                {tempItem.title || "Edit line item"}
              </Drawer.Title>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="item-title">Title</Label>
                  <Input
                    id="item-title"
                    value={tempItem.title || ""}
                    onChange={(e) => updateTempField("title", e.target.value)}
                    placeholder="e.g., Hourly rate, Materials, Travel costs"
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="item-unit">Unit</Label>
                  
                  {/* Native select for all devices */}
                  <select
                    id="item-unit"
                    value={tempItem.unit || "hour"}
                    onChange={(e) => updateTempField("unit", e.target.value as string)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="hour">per hour</option>
                    <option value="piece">per piece</option>
                    <option value="m2">per m²</option>
                    <option value="meter">per meter</option>
                    <option value="visit">per visit</option>
                    <option value="day">per day</option>
                    <option value="project">per project</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="item-rate">Rate (€, ex VAT)</Label>
                  <Input
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
                    placeholder="0.00"
                  />
                  {errors.rate && (
                    <p className="text-sm text-destructive">{errors.rate}</p>
                  )}
                </div>

                <div className="flex gap-3 pb-safe">
                  <Button variant="outline" onClick={closeDrawer} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={validateAndSave} className="flex-1">
                    Save
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

// Main component with Suspense boundary
export default function OnboardingProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsServicesContent />
    </Suspense>
  );
}