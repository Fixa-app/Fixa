"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function OnboardingUploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Reset error
    setError("");

    // Validate file type
    const validTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/heic"];
    if (!validTypes.includes(selectedFile.type)) {
      setError("Please upload a PDF, JPG, PNG, or HEIC file");
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setError("File size must be less than 5MB");
      return;
    }

    setFile(selectedFile);
  };

  const handleContinue = async () => {
    if (!file) return;

    setIsUploading(true);

    try {
      // TODO: Upload file and call AI parsing API
      // For now, just navigate to next step
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate to company info with parsed data
      router.push("/onboarding/company");
    } catch (err) {
      setError("Failed to process file. Please try again.");
      setIsUploading(false);
    }
  };

  const handleSkip = () => {
    router.push("/onboarding/company?manual=true");
  };

  const handleBack = () => {
    router.push("/");
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Scrollable content */}
      <div className="flex-1 space-y-8 pb-32">
        {/* Progress indicator with back button */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="flex-shrink-0 text-muted-foreground hover:text-foreground"
            aria-label="Go back"
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
                <div className="h-full w-1/5 bg-primary transition-all" />
              </div>
            </div>
            <span className="ml-4 text-sm text-muted-foreground">1/5</span>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-bold">
            Upload a photo of your quote or invoice
          </h1>
          <p className="text-base text-muted-foreground">
            So we create a template that perfectly suits your business.
          </p>
        </div>

        {/* Upload zone */}
        <div className="relative">
          <input
            type="file"
            id="file-upload"
            className="sr-only"
            accept=".pdf,.jpg,.jpeg,.png,.heic"
            onChange={handleFileChange}
            aria-label="Upload quote or invoice"
          />
          <label
            htmlFor="file-upload"
            className="flex min-h-[400px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/20 p-12 transition-colors hover:bg-muted/40"
          >
            {file ? (
              <div className="flex flex-col items-center gap-4 text-center">
                <svg
                  className="h-16 w-16 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-base font-medium text-foreground">
                    {file.name}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button variant="outline" size="sm" type="button">
                  Choose different file
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 text-center">
                <svg
                  className="h-16 w-16 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <div>
                  <p className="text-base font-medium text-foreground">
                    Select file
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Supports PDF, jpeg and png
                  </p>
                </div>
              </div>
            )}
          </label>

          {/* Error message */}
          {error && (
            <p className="mt-3 text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
        </div>
      </div>

      {/* Sticky footer */}
      <div className="fixed inset-x-0 bottom-0 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto w-full max-w-2xl space-y-3 p-6">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-muted-foreground hover:text-foreground"
            onClick={handleSkip}
          >
            Let me skip this step and add manually
          </Button>

          <Button
            size="lg"
            className="w-full"
            onClick={handleContinue}
            disabled={!file || isUploading}
            aria-label="Continue to company info"
          >
            {isUploading ? "Processing..." : "Continue to auto-generated template"}
          </Button>
        </div>
      </div>
    </div>
  );
}