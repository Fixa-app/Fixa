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
    const validTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg", 
      "image/png",
      "image/heic",
      "image/heif"
    ];
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
        <div>
          <h1 className="font-display text-3xl font-bold">
            Let's build your quote template
          </h1>
        </div>

        {/* Upload button or file preview */}
        {file ? (
          <div className="space-y-4">
            {/* File preview card */}
            <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                <svg
                  className="h-6 w-6 text-primary"
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
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-medium text-foreground truncate">
                  {file.name}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            {/* Change file button */}
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => {
                setFile(null);
                setError("");
              }}
            >
              Choose different file
            </Button>
          </div>
        ) : (
          <div>
            {/* Upload card */}
            <input
              type="file"
              id="file-upload"
              className="sr-only"
              accept="image/*,application/pdf"
              capture="environment"
              onChange={handleFileChange}
              aria-label="Upload quote"
            />
            <label
              htmlFor="file-upload"
              className="block cursor-pointer"
            >
              <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card p-12 transition-colors hover:bg-muted/40">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
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
                </div>
                <p className="text-base font-medium text-foreground">
                  Upload quote
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports PDF, JPEG and PNG
                </p>
              </div>
            </label>

            {/* Error message */}
            {error && (
              <p className="mt-3 text-sm text-destructive text-center" role="alert">
                {error}
              </p>
            )}
          </div>
        )}
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
            Or skip and add manually
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