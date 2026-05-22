"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type CompanyData = {
  companyName: string;
  address: string;
  phone: string;
  email: string;
  kvkNumber: string;
  vatNumber: string;
  iban: string;
  logoUrl: string;
};

// Wrapper component for useSearchParams
function CompanyInfoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isManual = searchParams.get("manual") === "true";

  // Mock AI-parsed data (TODO: Replace with actual AI parsing)
  const mockParsedData: CompanyData = {
    companyName: "Jan's Loodgieterij BV",
    address: "Hoofdstraat 123, 1012 AB Amsterdam",
    phone: "+31 6 12345678",
    email: "jan@loodgieterij.nl",
    kvkNumber: "",
    vatNumber: "NL123456789B01",
    iban: "NL12 ABNA 0123 4567 89",
    logoUrl: "",
  };

  const [formData, setFormData] = useState<CompanyData>(
    isManual
      ? {
          companyName: "",
          address: "",
          phone: "",
          email: "",
          kvkNumber: "",
          vatNumber: "",
          iban: "",
          logoUrl: "",
        }
      : mockParsedData
  );

  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [tempData, setTempData] = useState<Partial<CompanyData>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleContinue = async () => {
    // TODO: Save to database
    console.log("Company data:", formData);

    // Navigate to next step (standard text)
    router.push("/onboarding/text");
  };

  const handleBack = () => {
    router.push("/onboarding/upload");
  };

  const openEdit = (group: string) => {
    // Pre-fill temp data with current values
    if (group === "contact") {
      setTempData({ phone: formData.phone, email: formData.email });
    } else if (group === "vat-iban") {
      setTempData({ vatNumber: formData.vatNumber, iban: formData.iban });
    } else if (group === "address") {
      setTempData({ address: formData.address });
    } else if (group === "kvk") {
      setTempData({ kvkNumber: formData.kvkNumber });
    } else if (group === "name") {
      setTempData({ companyName: formData.companyName });
    }
    setErrors({});
    setEditingGroup(group);
  };

  const closeEdit = () => {
    setEditingGroup(null);
    setTempData({});
    setErrors({});
  };

  const validateAndSave = () => {
    const newErrors: Record<string, string> = {};

    if (editingGroup === "contact") {
      // Validate phone
      const phone = tempData.phone || "";
      if (phone && !/^\+?[\d\s-]{8,}$/.test(phone)) {
        newErrors.phone = "Please enter a valid phone number";
      }

      // Validate email
      const email = tempData.email || "";
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    if (editingGroup === "vat-iban") {
      // Basic IBAN validation (NL format)
      const iban = tempData.iban || "";
      if (iban && !/^NL\d{2}\s?[A-Z]{4}\s?\d{10}$/.test(iban.replace(/\s/g, ""))) {
        newErrors.iban = "Please enter a valid Dutch IBAN (e.g., NL12 ABNA 0123456789)";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Save to form data
    setFormData((prev) => ({ ...prev, ...tempData }));
    closeEdit();
  };

  const updateTempField = (field: keyof CompanyData, value: string) => {
    setTempData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const CompanyGroup = ({
    label,
    groupKey,
    isDetected,
    previewText,
  }: {
    label: string;
    groupKey: string;
    isDetected: boolean;
    previewText: string;
  }) => {
    const isEmpty = !previewText;

    return (
      <div
        className="flex items-center gap-3 rounded-lg border border-border bg-muted/20 p-4 transition-all hover:bg-muted/40 animate-in fade-in slide-in-from-bottom-2"
        style={{
          animationDelay: `${["name", "address", "contact", "kvk", "vat-iban"].indexOf(groupKey) * 100}ms`,
          animationDuration: "300ms",
          animationFillMode: "backwards",
        }}
      >
        {/* Status icon */}
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-background">
          {isDetected && !isEmpty ? (
            <svg
              className="h-5 w-5 text-primary animate-in zoom-in"
              style={{ animationDuration: "400ms" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/40" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <Label className="text-sm font-medium text-foreground">{label}</Label>
          <p className="mt-0.5 truncate text-sm text-muted-foreground">
            {previewText || (
              <span className="italic text-muted-foreground/70">Not detected</span>
            )}
          </p>
        </div>

        {/* View/Add button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => openEdit(groupKey)}
          aria-label={isEmpty ? `Add ${label.toLowerCase()}` : `View ${label.toLowerCase()}`}
        >
          {isEmpty ? "Add" : "View"}
        </Button>
      </div>
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
              size="sm"
              onClick={handleBack}
              className="flex-shrink-0 text-muted-foreground hover:text-foreground"
              aria-label="Go back to file upload"
            >
              <svg
                className="mr-1 h-4 w-4"
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
              Back
            </Button>

            <div className="flex flex-1 items-center justify-between">
              <div className="flex-1">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-2/5 bg-primary transition-all" />
                </div>
              </div>
              <span className="ml-4 text-sm text-muted-foreground">2/5</span>
            </div>
          </div>

          {/* Main card */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-2xl">
                Your company info
              </CardTitle>
              {!isManual && (
                <p className="text-sm text-muted-foreground">
                  We've extracted this information from your upload. Review and
                  edit if needed.
                </p>
              )}
            </CardHeader>

            <CardContent className="space-y-3">
              {/* Fallback message if nothing detected */}
              {isManual && Object.values(formData).every((val) => !val) && (
                <div className="mb-4 rounded-lg border border-muted bg-muted/20 p-4">
                  <p className="text-sm text-muted-foreground">
                    Couldn't detect anything this time. No worries, you can fill
                    it in manually or{" "}
                    <button
                      onClick={handleBack}
                      className="underline underline-offset-2 hover:text-foreground"
                    >
                      give the upload another go
                    </button>
                    .
                  </p>
                </div>
              )}

              <CompanyGroup
                label="Company name"
                groupKey="name"
                isDetected={!isManual}
                previewText={formData.companyName}
              />

              <CompanyGroup
                label="Address"
                groupKey="address"
                isDetected={!isManual}
                previewText={formData.address}
              />

              <CompanyGroup
                label="Contact details"
                groupKey="contact"
                isDetected={!isManual}
                previewText={
                  formData.phone || formData.email
                    ? `${formData.phone}${formData.phone && formData.email ? ", " : ""}${formData.email}`
                    : ""
                }
              />

              <CompanyGroup
                label="Chamber of Commerce number"
                groupKey="kvk"
                isDetected={false}
                previewText={formData.kvkNumber}
              />

              <CompanyGroup
                label="VAT number and IBAN"
                groupKey="vat-iban"
                isDetected={!isManual}
                previewText={
                  formData.vatNumber || formData.iban
                    ? `${formData.vatNumber}${formData.vatNumber && formData.iban ? ", " : ""}${formData.iban}`
                    : ""
                }
              />
            </CardContent>
          </Card>

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
              aria-label="Continue to standard text"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Modals */}
      {/* Company Name */}
      <Dialog open={editingGroup === "name"} onOpenChange={closeEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Company name</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company name</Label>
              <Input
                id="company-name"
                value={tempData.companyName || ""}
                onChange={(e) => updateTempField("companyName", e.target.value)}
                placeholder="Your company name"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={closeEdit} className="flex-1">
                Cancel
              </Button>
              <Button onClick={validateAndSave} className="flex-1">
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Address */}
      <Dialog open={editingGroup === "address"} onOpenChange={closeEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Address</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="address">Street, postal code, city</Label>
              <Input
                id="address"
                value={tempData.address || ""}
                onChange={(e) => updateTempField("address", e.target.value)}
                placeholder="Hoofdstraat 123, 1012 AB Amsterdam"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={closeEdit} className="flex-1">
                Cancel
              </Button>
              <Button onClick={validateAndSave} className="flex-1">
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Details */}
      <Dialog open={editingGroup === "contact"} onOpenChange={closeEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact details</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <Input
                id="phone"
                type="tel"
                value={tempData.phone || ""}
                onChange={(e) => updateTempField("phone", e.target.value)}
                placeholder="+31 6 12345678"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-destructive">{errors.phone}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                value={tempData.email || ""}
                onChange={(e) => updateTempField("email", e.target.value)}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-destructive">{errors.email}</p>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={closeEdit} className="flex-1">
                Cancel
              </Button>
              <Button onClick={validateAndSave} className="flex-1">
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* KVK */}
      <Dialog open={editingGroup === "kvk"} onOpenChange={closeEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chamber of Commerce number</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="kvk">KVK number</Label>
              <Input
                id="kvk"
                value={tempData.kvkNumber || ""}
                onChange={(e) => updateTempField("kvkNumber", e.target.value)}
                placeholder="12345678"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={closeEdit} className="flex-1">
                Cancel
              </Button>
              <Button onClick={validateAndSave} className="flex-1">
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* VAT & IBAN */}
      <Dialog open={editingGroup === "vat-iban"} onOpenChange={closeEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>VAT number and IBAN</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="vat">VAT number</Label>
              <Input
                id="vat"
                value={tempData.vatNumber || ""}
                onChange={(e) => updateTempField("vatNumber", e.target.value)}
                placeholder="NL123456789B01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="iban">IBAN</Label>
              <Input
                id="iban"
                value={tempData.iban || ""}
                onChange={(e) => updateTempField("iban", e.target.value)}
                placeholder="NL12 ABNA 0123 4567 89"
              />
              {errors.iban && (
                <p className="mt-1 text-sm text-destructive">{errors.iban}</p>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={closeEdit} className="flex-1">
                Cancel
              </Button>
              <Button onClick={validateAndSave} className="flex-1">
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Main component with Suspense boundary
export default function OnboardingCompanyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CompanyInfoContent />
    </Suspense>
  );
}