"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Drawer } from "vaul";

type CompanyData = {
  name?: string;
  logo?: string;
  address?: {
    street?: string;
    city?: string;
    postal?: string;
  };
  phone?: string;
  email?: string;
  kvk?: string;
  vat?: string;
  iban?: string;
};

// Wrapper component for useSearchParams
function CompanyInfoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isParsed = searchParams.get("parsed") === "true";

  // Load data from sessionStorage
  const loadCompanyData = (): CompanyData => {
    if (typeof window === 'undefined') return {};
    
    const stored = sessionStorage.getItem('onboarding_company');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse company data:', e);
      }
    }
    return {};
  };

  const [formData, setFormData] = useState<CompanyData>(loadCompanyData());
  const [openDrawer, setOpenDrawer] = useState<string | null>(null);
  const [tempData, setTempData] = useState<Partial<CompanyData>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reload data on mount
  useEffect(() => {
    setFormData(loadCompanyData());
  }, []);

  const handleContinue = () => {
    // Save to sessionStorage
    sessionStorage.setItem('onboarding_company', JSON.stringify(formData));
    
    // Navigate to products screen
    router.push('/onboarding/v2/products');
  };

  const handleBack = () => {
    router.push('/onboarding/v2/upload');
  };

  const openEdit = (field: string) => {
    if (field === "company") {
      setTempData({ name: formData.name, logo: formData.logo });
    } else if (field === "address") {
      setTempData({ address: formData.address });
    } else if (field === "contact") {
      setTempData({ phone: formData.phone, email: formData.email });
    } else if (field === "kvk") {
      setTempData({ kvk: formData.kvk });
    } else if (field === "vat-iban") {
      setTempData({ vat: formData.vat, iban: formData.iban });
    }
    setErrors({});
    setOpenDrawer(field);
  };

  const closeDrawer = () => {
    setOpenDrawer(null);
    setTempData({});
    setErrors({});
  };

  const validateAndSave = () => {
    const newErrors: Record<string, string> = {};

    if (openDrawer === "contact") {
      if (tempData.phone && !/^\+?[\d\s-]{8,}$/.test(tempData.phone)) {
        newErrors.phone = "Invalid phone number";
      }
      if (tempData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tempData.email)) {
        newErrors.email = "Invalid email address";
      }
    }

    if (openDrawer === "vat-iban") {
      if (tempData.iban && !/^NL\d{2}\s?[A-Z]{4}\s?\d{10}$/.test(tempData.iban)) {
        newErrors.iban = "Invalid Dutch IBAN";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setFormData((prev) => ({ ...prev, ...tempData }));
    closeDrawer();
  };

  const updateTempField = (field: keyof CompanyData | string, value: any) => {
    setTempData((prev) => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return {
          ...prev,
          [parent]: { ...(prev[parent as keyof CompanyData] as any), [child]: value },
        };
      }
      return { ...prev, [field]: value };
    });
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const CompanyCard = ({ data }: { data: CompanyData }) => {
    const hasData = data.name;
    const fullAddress = data.address
      ? [data.address.street, data.address.postal, data.address.city]
          .filter(Boolean)
          .join(', ')
      : '';

    return (
      <button
        onClick={() => openEdit("company")}
        className="flex w-full items-center gap-4 rounded-xl border border-border bg-card p-5 text-left transition-all hover:bg-muted/40 animate-in fade-in slide-in-from-bottom-2"
        style={{
          animationDelay: "0ms",
          animationDuration: "300ms",
          animationFillMode: "backwards",
        }}
        aria-label={hasData ? `Edit company: ${data.name}` : "Add company name"}
      >
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-foreground">Company</h3>
          <p className="mt-1 truncate text-sm text-muted-foreground">
            {hasData ? data.name : "Not detected"}
          </p>
        </div>
        {!hasData && (
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

  const AddressCard = ({ data }: { data: CompanyData }) => {
    const hasData = data.address?.street || data.address?.city || data.address?.postal;
    const fullAddress = hasData
      ? [data.address?.street, data.address?.postal, data.address?.city]
          .filter(Boolean)
          .join(', ')
      : 'Not detected';

    return (
      <button
        onClick={() => openEdit("address")}
        className="flex w-full items-center gap-4 rounded-xl border border-border bg-card p-5 text-left transition-all hover:bg-muted/40 animate-in fade-in slide-in-from-bottom-2"
        style={{
          animationDelay: "100ms",
          animationDuration: "300ms",
          animationFillMode: "backwards",
        }}
        aria-label={hasData ? `Edit address: ${fullAddress}` : "Add address"}
      >
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-foreground">Address</h3>
          <p className="mt-1 truncate text-sm text-muted-foreground">{fullAddress}</p>
        </div>
        {!hasData && (
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

  const ContactCard = ({ data }: { data: CompanyData }) => {
    const hasData = data.phone || data.email;
    const contactInfo = [data.phone, data.email].filter(Boolean).join(' • ');

    return (
      <button
        onClick={() => openEdit("contact")}
        className="flex w-full items-center gap-4 rounded-xl border border-border bg-card p-5 text-left transition-all hover:bg-muted/40 animate-in fade-in slide-in-from-bottom-2"
        style={{
          animationDelay: "200ms",
          animationDuration: "300ms",
          animationFillMode: "backwards",
        }}
        aria-label={hasData ? `Edit contact: ${contactInfo}` : "Add contact details"}
      >
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-foreground">Contact details</h3>
          <p className="mt-1 truncate text-sm text-muted-foreground">
            {hasData ? contactInfo : "Not detected"}
          </p>
        </div>
        {!hasData && (
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

  const KvkCard = ({ data }: { data: CompanyData }) => {
    const hasData = data.kvk;

    return (
      <button
        onClick={() => openEdit("kvk")}
        className="flex w-full items-center gap-4 rounded-xl border border-border bg-card p-5 text-left transition-all hover:bg-muted/40 animate-in fade-in slide-in-from-bottom-2"
        style={{
          animationDelay: "300ms",
          animationDuration: "300ms",
          animationFillMode: "backwards",
        }}
        aria-label={hasData ? `Edit KVK number: ${data.kvk}` : "Add KVK number"}
      >
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-foreground">KVK number</h3>
          <p className="mt-1 truncate text-sm text-muted-foreground">
            {hasData ? data.kvk : "Not detected"}
          </p>
        </div>
        {!hasData && (
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

  const VatIbanCard = ({ data }: { data: CompanyData }) => {
    const hasData = data.vat || data.iban;
    const info = [data.vat, data.iban].filter(Boolean).join(' • ');

    return (
      <button
        onClick={() => openEdit("vat-iban")}
        className="flex w-full items-center gap-4 rounded-xl border border-border bg-card p-5 text-left transition-all hover:bg-muted/40 animate-in fade-in slide-in-from-bottom-2"
        style={{
          animationDelay: "400ms",
          animationDuration: "300ms",
          animationFillMode: "backwards",
        }}
        aria-label={hasData ? `Edit VAT and IBAN: ${info}` : "Add VAT number and IBAN"}
      >
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-foreground">VAT & IBAN</h3>
          <p className="mt-1 truncate text-sm text-muted-foreground">
            {hasData ? info : "Not detected"}
          </p>
        </div>
        {!hasData && (
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
        <div className="flex-1 space-y-6 pb-32 p-6 mx-auto w-full max-w-2xl">
          {/* Progress indicator with back button */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="flex-shrink-0 text-muted-foreground hover:text-foreground"
              aria-label="Go back to upload"
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
                  <div className="h-full w-2/4 bg-primary transition-all" />
                </div>
              </div>
              <span className="ml-4 text-sm text-muted-foreground">2/4</span>
            </div>
          </div>

          <h1 className="font-display text-3xl font-bold">Company info</h1>

          <div className="space-y-4">
            <CompanyCard data={formData} />
            <AddressCard data={formData} />
            <ContactCard data={formData} />
            <KvkCard data={formData} />
            <VatIbanCard data={formData} />
          </div>

          <p className="text-center text-sm text-muted-foreground">
            You can also change this later in your settings
          </p>
        </div>

        <div className="fixed inset-x-0 bottom-0 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="mx-auto w-full max-w-2xl p-6">
            <Button
              className="w-full"
              onClick={handleContinue}
              aria-label="Continue to products & services"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Sheets for editing - Company */}
      <Drawer.Root
        open={openDrawer === "company"}
        onOpenChange={(open) => !open && closeDrawer()}
      >
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] bg-background">
            <div className="mx-auto mt-4 h-1.5 w-12 flex-shrink-0 rounded-full bg-muted" />
            <div className="flex-1 overflow-y-auto p-6">
              <Drawer.Title className="mb-6 font-display text-xl font-semibold">
                Company
              </Drawer.Title>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company name</Label>
                  <Input
                    id="company-name"
                    value={tempData.name || ""}
                    onChange={(e) => updateTempField("name", e.target.value)}
                    placeholder="Your company name"
                  />
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

      {/* Address */}
      <Drawer.Root
        open={openDrawer === "address"}
        onOpenChange={(open) => !open && closeDrawer()}
      >
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] bg-background">
            <div className="mx-auto mt-4 h-1.5 w-12 flex-shrink-0 rounded-full bg-muted" />
            <div className="flex-1 overflow-y-auto p-6">
              <Drawer.Title className="mb-6 font-display text-xl font-semibold">
                Address
              </Drawer.Title>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="street">Street</Label>
                  <Input
                    id="street"
                    value={tempData.address?.street || ""}
                    onChange={(e) => updateTempField("address.street", e.target.value)}
                    placeholder="Street and number"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="postal">Postal code</Label>
                    <Input
                      id="postal"
                      value={tempData.address?.postal || ""}
                      onChange={(e) => updateTempField("address.postal", e.target.value)}
                      placeholder="1234AB"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={tempData.address?.city || ""}
                      onChange={(e) => updateTempField("address.city", e.target.value)}
                      placeholder="Amsterdam"
                    />
                  </div>
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

      {/* Contact */}
      <Drawer.Root
        open={openDrawer === "contact"}
        onOpenChange={(open) => !open && closeDrawer()}
      >
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] bg-background">
            <div className="mx-auto mt-4 h-1.5 w-12 flex-shrink-0 rounded-full bg-muted" />
            <div className="flex-1 overflow-y-auto p-6">
              <Drawer.Title className="mb-6 font-display text-xl font-semibold">
                Contact details
              </Drawer.Title>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={tempData.phone || ""}
                    onChange={(e) => updateTempField("phone", e.target.value)}
                    placeholder="+31 6 12345678"
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={tempData.email || ""}
                    onChange={(e) => updateTempField("email", e.target.value)}
                    placeholder="hello@company.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
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

      {/* KVK */}
      <Drawer.Root
        open={openDrawer === "kvk"}
        onOpenChange={(open) => !open && closeDrawer()}
      >
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] bg-background">
            <div className="mx-auto mt-4 h-1.5 w-12 flex-shrink-0 rounded-full bg-muted" />
            <div className="flex-1 overflow-y-auto p-6">
              <Drawer.Title className="mb-6 font-display text-xl font-semibold">
                KVK number
              </Drawer.Title>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="kvk">KVK number</Label>
                  <Input
                    id="kvk"
                    value={tempData.kvk || ""}
                    onChange={(e) => updateTempField("kvk", e.target.value)}
                    placeholder="12345678"
                  />
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

      {/* VAT & IBAN */}
      <Drawer.Root
        open={openDrawer === "vat-iban"}
        onOpenChange={(open) => !open && closeDrawer()}
      >
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] bg-background">
            <div className="mx-auto mt-4 h-1.5 w-12 flex-shrink-0 rounded-full bg-muted" />
            <div className="flex-1 overflow-y-auto p-6">
              <Drawer.Title className="mb-6 font-display text-xl font-semibold">
                VAT & IBAN
              </Drawer.Title>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="vat">VAT number</Label>
                  <Input
                    id="vat"
                    value={tempData.vat || ""}
                    onChange={(e) => updateTempField("vat", e.target.value)}
                    placeholder="NL123456789B01"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="iban">IBAN</Label>
                  <Input
                    id="iban"
                    value={tempData.iban || ""}
                    onChange={(e) => updateTempField("iban", e.target.value)}
                    placeholder="NL12 ABCD 0123 4567 89"
                  />
                  {errors.iban && (
                    <p className="text-sm text-destructive">{errors.iban}</p>
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

export default function OnboardingCompanyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CompanyInfoContent />
    </Suspense>
  );
}