"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
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
      router.push("/onboarding/company?parsed=true");
    } else {
      handleSkip();
    }
  };

  const handleSkip = () => {
    sessionStorage.removeItem("onboarding_company");
    sessionStorage.removeItem("onboarding_lineItems");
    sessionStorage.removeItem("onboarding_standardText");
    sessionStorage.removeItem("onboarding_filename");

    router.push("/onboarding/company?manual=true");
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

      <div className="mx-auto w-full max-w-2xl space-y-6 p-6 pt-16">
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
          <h1 className="font-display text-3xl font-bold">Upload een offerte</h1>
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
            className={`flex h-16 w-16 items-center justify-center rounded-full ${
              uploading ? "bg-muted" : success ? "bg-green-500/20" : "bg-muted"
            }`}
          >
            {uploading ? (
              <svg
                className="h-8 w-8 animate-spin text-foreground"
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
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="h-8 w-8 text-foreground"
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
            )}
          </div>
          <p className="mt-4 text-base font-medium text-foreground">
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

        {/* Actions */}
        <div className="space-y-3">
          <Button
            size="lg"
            className="w-full"
            onClick={handleContinue}
            disabled={uploading || !success}
            aria-label="Doorgaan naar bedrijfsgegevens"
          >
            Doorgaan
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="w-full"
            onClick={handleSkip}
            disabled={uploading}
          >
            Overslaan en handmatig invoeren
          </Button>
        </div>
      </div>
    </div>
  );
}
