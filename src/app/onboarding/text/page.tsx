"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Drawer } from "vaul";

type StandardTextData = {
  introText: string;
  disclaimer: string;
};

// Default templates
const DEFAULT_INTRO_TEMPLATE = `Dear customer,

Thank you for your interest in our services. Below you'll find our quote for the requested work.

Best regards`;

const DEFAULT_DISCLAIMER_TEMPLATE = `This quote is valid for 30 days from the date above. Payment terms: 50% upfront, 50% upon completion. Prices are excluding VAT unless stated otherwise.`;

// Wrapper component for useSearchParams
function StandardTextContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isManual = searchParams.get("manual") === "true";

  // Mock AI-parsed data (TODO: Replace with actual AI parsing)
  const mockParsedData: StandardTextData = {
    introText: "Dear customer,\n\nThank you for your interest in our services. Below you'll find our quote for the requested work.",
    disclaimer: "",
  };

  const [formData, setFormData] = useState<StandardTextData>(
    isManual
      ? {
          introText: "",
          disclaimer: "",
        }
      : mockParsedData
  );

  const [openDrawer, setOpenDrawer] = useState<string | null>(null);
  const [tempData, setTempData] = useState<Partial<StandardTextData>>({});

  const handleContinue = async () => {
    // TODO: Save to database
    console.log("Standard text data:", formData);

    // Navigate to next step (products & services)
    router.push("/onboarding/products");
  };

  const handleBack = () => {
    router.push("/onboarding/company");
  };

  const openEdit = (field: string) => {
    if (field === "intro") {
      // Pre-fill with template if empty, otherwise use existing text
      setTempData({ 
        introText: formData.introText || DEFAULT_INTRO_TEMPLATE 
      });
    } else if (field === "disclaimer") {
      // Pre-fill with template if empty, otherwise use existing text
      setTempData({ 
        disclaimer: formData.disclaimer || DEFAULT_DISCLAIMER_TEMPLATE 
      });
    }
    setOpenDrawer(field);
  };

  const closeDrawer = () => {
    setOpenDrawer(null);
    setTempData({});
  };

  const saveChanges = () => {
    setFormData((prev) => ({ ...prev, ...tempData }));
    closeDrawer();
  };

  const updateTempField = (field: keyof StandardTextData, value: string) => {
    setTempData((prev) => ({ ...prev, [field]: value }));
  };

  const TextGroup = ({
    label,
    fieldKey,
    isDetected,
    previewText,
  }: {
    label: string;
    fieldKey: string;
    isDetected: boolean;
    previewText: string;
  }) => {
    const isEmpty = !previewText;

    return (
      <button
        onClick={() => openEdit(fieldKey)}
        className="flex w-full items-center gap-4 rounded-xl border border-border bg-card p-5 text-left transition-all hover:bg-muted/40 animate-in fade-in slide-in-from-bottom-2"
        style={{
          animationDelay: `${["intro", "disclaimer"].indexOf(fieldKey) * 100}ms`,
          animationDuration: "300ms",
          animationFillMode: "backwards",
        }}
        aria-label={isEmpty ? `Add ${label.toLowerCase()}` : `View ${label.toLowerCase()}`}
      >
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-foreground">
            {label}
          </h3>
          <p className="mt-1 truncate text-sm text-muted-foreground">
            {previewText || "Not detected"}
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
        <div className="flex-1 space-y-6 pb-32">
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
                  <div className="h-full w-3/5 bg-primary transition-all" />
                </div>
              </div>
              <span className="ml-4 text-sm text-muted-foreground">3/5</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl font-bold">Your standard text</h1>

          {/* Items as separate cards */}
          <div className="space-y-4">
            <TextGroup
              label="Introduction text"
              fieldKey="intro"
              isDetected={!isManual}
              previewText={formData.introText}
            />

            <TextGroup
              label="Disclaimer"
              fieldKey="disclaimer"
              isDetected={false}
              previewText={formData.disclaimer}
            />
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
              size="lg"
              className="w-full"
              onClick={handleContinue}
              aria-label="Continue to products and services"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Sheet Drawers */}
      {/* Introduction text */}
      <Drawer.Root open={openDrawer === "intro"} onOpenChange={(open) => !open && closeDrawer()}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] bg-background">
            <div className="mx-auto mt-4 h-1.5 w-12 flex-shrink-0 rounded-full bg-muted" />
            <div className="flex-1 overflow-y-auto p-6">
              <Drawer.Title className="mb-6 font-display text-xl font-semibold">
                Introduction text
              </Drawer.Title>
              <div className="space-y-6">
                {!formData.introText && (
                  <p className="text-sm text-muted-foreground">
                    We've pre-filled a commonly used text
                  </p>
                )}
                <Textarea
                  id="intro-text"
                  value={tempData.introText || ""}
                  onChange={(e) => updateTempField("introText", e.target.value)}
                  placeholder="Your introduction text here..."
                  rows={8}
                  className="resize-none"
                />
                <div className="flex gap-3 pb-safe">
                  <Button variant="outline" onClick={closeDrawer} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={saveChanges} className="flex-1">
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      {/* Disclaimer */}
      <Drawer.Root open={openDrawer === "disclaimer"} onOpenChange={(open) => !open && closeDrawer()}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] bg-background">
            <div className="mx-auto mt-4 h-1.5 w-12 flex-shrink-0 rounded-full bg-muted" />
            <div className="flex-1 overflow-y-auto p-6">
              <Drawer.Title className="mb-6 font-display text-xl font-semibold">
                Disclaimer
              </Drawer.Title>
              <div className="space-y-6">
                {!formData.disclaimer && (
                  <p className="text-sm text-muted-foreground">
                    We've pre-filled a commonly used text
                  </p>
                )}
                <Textarea
                  id="disclaimer-text"
                  value={tempData.disclaimer || ""}
                  onChange={(e) => updateTempField("disclaimer", e.target.value)}
                  placeholder="Your disclaimer text here..."
                  rows={8}
                  className="resize-none"
                />
                <div className="flex gap-3 pb-safe">
                  <Button variant="outline" onClick={closeDrawer} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={saveChanges} className="flex-1">
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
export default function OnboardingTextPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StandardTextContent />
    </Suspense>
  );
}