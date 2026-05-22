"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OnboardingUploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    // Reset states
    setError(null);
    setUploadSuccess(false);

    // Validate file type (including iOS HEIC)
    const validTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/heic",
      "image/heif",
    ];
    
    // Also check file extension for better HEIC detection
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
    const validExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'heic', 'heif'];
    
    if (!validTypes.includes(selectedFile.type) && !validExtensions.includes(fileExtension || '')) {
      setError("Please upload a PDF, JPG, PNG, or HEIC file");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (selectedFile.size > maxSize) {
      setError("File size must be less than 5MB");
      return;
    }

    setFile(selectedFile);
    setUploadSuccess(true);
  };

  const handleContinue = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      // Convert file to base64
      const base64 = await fileToBase64(file);

      // TODO: Call AI parsing API
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("File uploaded:", file.name);
      console.log("Base64 length:", base64.length);

      // Navigate to company info screen (we'll build this next)
      router.push("/onboarding/company");
    } catch (error) {
      console.error("Upload failed:", error);
      setError("Upload failed. Please try again or skip this step.");
      setIsUploading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    setFile(null);
    setUploadSuccess(false);
  };

  const handleSkip = () => {
    // Navigate to manual company creation
    router.push("/onboarding/company?manual=true");
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Scrollable content */}
      <div className="flex-1 space-y-6 pb-32">
        {/* Progress indicator */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full w-1/5 bg-primary transition-all" />
            </div>
          </div>
          <span className="ml-4 text-sm text-muted-foreground">1/5</span>
        </div>

        {/* Main card */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-2xl">
              Upload a photo of your quote or invoice
            </CardTitle>
            <p className="text-muted-foreground">
              So we create a template that perfectly suits your business.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
          {/* File upload area */}
          <div
            className={`
              relative flex min-h-[300px] cursor-pointer flex-col items-center justify-center 
              rounded-lg border-2 border-dashed border-border bg-muted/20 transition-colors
              hover:border-muted-foreground/50
            `}
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            {file ? (
              // File selected
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="relative">
                  <svg
                    className="h-12 w-12 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  {uploadSuccess && (
                    <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                      <svg
                        className="h-3 w-3 text-primary-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setUploadSuccess(false);
                    setError(null);
                  }}
                >
                  Remove
                </Button>
              </div>
            ) : (
              // No file selected
              <div className="flex flex-col items-center gap-3 text-center">
                <svg
                  className="h-12 w-12 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <div>
                  <p className="font-medium text-foreground">Select file</p>
                  <p className="text-sm text-muted-foreground">
                    Supports PDF, JPEG, PNG and HEIC
                  </p>
                </div>
              </div>
            )}

            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.heic,.heif,image/*"
              onChange={handleChange}
              aria-label="Upload a quote or invoice"
            />
          </div>

          {/* Error message */}
          {error && (
            <div 
              className="rounded-lg border border-destructive/50 bg-destructive/10 p-4"
              role="alert"
              aria-live="polite"
            >
              <div className="flex items-start gap-3">
                <svg
                  className="h-5 w-5 flex-shrink-0 text-destructive"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-destructive">{error}</p>
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-destructive hover:text-destructive/80"
                    onClick={handleRetry}
                  >
                    Try another file
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>

      {/* Sticky footer buttons */}
      <div className="fixed inset-x-0 bottom-0 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto w-full max-w-2xl space-y-3 p-6">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-muted-foreground hover:text-foreground"
            onClick={handleSkip}
            disabled={isUploading}
            aria-label="Skip file upload and add company information manually"
          >
            Let me skip this step and add manually
          </Button>

          <Button
            size="lg"
            className="w-full"
            onClick={handleContinue}
            disabled={!file || isUploading}
            aria-label="Continue to auto-generated template"
          >
            {isUploading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
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
                Processing...
              </span>
            ) : (
              "Continue to auto-generated template"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Helper function to convert File to base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
  });
}