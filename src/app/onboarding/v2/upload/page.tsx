"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { parseQuoteWithAI, type ParsedQuoteData } from "@/lib/parse-quote-ai";

export default function OnboardingUploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if we already have parsed data
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasData = sessionStorage.getItem("onboarding_company");
      if (hasData) {
        // Show success state if returning from next screens
        const filename = sessionStorage.getItem("onboarding_filename");
        if (filename) {
          setFile(new File([], filename));
          setSuccess(true);
        }
      }
    }
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError(null);
    setSuccess(false);
    setUploading(true);

    try {
      // Parse immediately
      const parsedData: ParsedQuoteData = await parseQuoteWithAI(selectedFile);

      // Store in sessionStorage
      sessionStorage.setItem(
        "onboarding_company",
        JSON.stringify(parsedData.company),
      );
      sessionStorage.setItem(
        "onboarding_lineItems",
        JSON.stringify(parsedData.lineItems),
      );
      sessionStorage.setItem(
        "onboarding_standardText",
        JSON.stringify(parsedData.standardText),
      );
      sessionStorage.setItem("onboarding_filename", selectedFile.name);

      setUploading(false);
      setSuccess(true);
    } catch (err) {
      console.error("Parsing error:", err);
      setError(
        "Het document kon niet worden gelezen. Probeer het opnieuw of vul handmatig in.",
      );
      setUploading(false);
      setSuccess(false);
    }
  };

  const handleContinue = () => {
    if (success || sessionStorage.getItem("onboarding_company")) {
      router.push("/onboarding/v2/company?parsed=true");
    } else {
      handleSkip();
    }
  };

  const handleSkip = () => {
    sessionStorage.removeItem("onboarding_company");
    sessionStorage.removeItem("onboarding_lineItems");
    sessionStorage.removeItem("onboarding_standardText");
    sessionStorage.removeItem("onboarding_filename");

    router.push("/onboarding/v2/company?manual=true");
  };

  return (
    <div className="relative min-h-screen">
      {/* Close — back to the marketing site (resume later via the account menu) */}
      <a
        href={process.env.NEXT_PUBLIC_MARKETING_URL ?? "/"}
        aria-label="Sluiten"
        className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <X className="size-5" />
      </a>

      <div className="mx-auto w-full max-w-2xl space-y-6 p-6 pt-16 pb-32">
        {/* Progress indicator */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full w-1/4 bg-primary transition-all" />
            </div>
          </div>
          <span className="ml-4 text-sm text-muted-foreground">1/4</span>
        </div>

        {/* Header + subtitle */}
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-semibold">
            Upload een offerte
          </h1>
          <p className="text-base text-muted-foreground">
            We halen automatisch alles eruit wat we nodig hebben om offertes via
            Fixa te versturen.
          </p>
        </div>

        {/* Upload card */}
        <label
          htmlFor="file-upload"
          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-all ${
            success
              ? "border-green-500 bg-green-500/5"
              : file
                ? "border-primary bg-primary/5"
                : "border-border bg-card hover:bg-muted/40"
          }`}
        >
          <div
            className={`flex size-10 items-center justify-center rounded-xl ${
              uploading
                ? "bg-muted"
                : success
                  ? "bg-green-500/20"
                  : "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
            }`}
          >
            {uploading ? (
              <svg
                className="size-5 animate-spin text-foreground"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : success ? (
              <Check className="size-6 text-green-600" strokeWidth={3} />
            ) : (
              <Plus className="size-6" strokeWidth={3} />
            )}
          </div>
          <p className="mt-4 text-xl font-semibold text-foreground">
            {uploading
              ? "Bezig met verwerken..."
              : file
                ? file.name
                : "Offerte uploaden"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {uploading
              ? "We halen je bedrijfsgegevens en regels eruit..."
              : success
                ? "Ander bestand uploaden"
                : "Ondersteunt PDF, JPEG en PNG"}
          </p>
          <input
            id="file-upload"
            type="file"
            accept="image/*,application/pdf"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
        </label>

        {/* Error message */}
        {error && (
          <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

      </div>

      {/* Sticky footer: manual entry + continue */}
      <div className="fixed inset-x-0 bottom-0 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-4 p-6">
          <Button
            variant="link"
            className="px-0 text-base font-bold text-foreground"
            onClick={handleSkip}
            disabled={uploading}
          >
            Handmatig invoeren
          </Button>
          <Button
            className="h-12 rounded-xl px-6 text-base font-bold"
            onClick={handleContinue}
            disabled={uploading || !success}
            aria-label="Doorgaan naar bedrijfsgegevens"
          >
            Doorgaan
          </Button>
        </div>
      </div>
    </div>
  );
}
