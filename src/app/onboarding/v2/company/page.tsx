"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Flame,
  Hammer,
  Home,
  Paintbrush,
  Pencil,
  Plus,
  Sparkles,
  Trees,
  Wrench,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Drawer } from "vaul";
import { cn } from "@/lib/utils";

// Design-system form field treatment (see /admin/design → Form fields)
function FieldLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  return <Label className={cn("text-sm font-semibold", className)} {...props} />;
}

function FieldInput({ className, ...props }: React.ComponentProps<typeof Input>) {
  return (
    <Input
      className={cn(
        "h-12 rounded-xl border-foreground/15 bg-background text-base",
        className,
      )}
      {...props}
    />
  );
}

type CompanyData = {
  name?: string;
  logo?: string;
  industry?: string;
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

const INDUSTRIES = [
  { name: "Loodgieter", icon: Wrench },
  { name: "Elektricien", icon: Zap },
  { name: "CV & klimaat", icon: Flame },
  { name: "Hovenier", icon: Trees },
  { name: "Schoonmaak", icon: Sparkles },
  { name: "Klusbedrijf", icon: Hammer },
  { name: "Schilder", icon: Paintbrush },
  { name: "Dakdekker", icon: Home },
];

function InfoCard({
  label,
  value,
  onClick,
  valueIcon,
  delay,
}: {
  label: string;
  value?: string;
  onClick: () => void;
  valueIcon?: React.ReactNode;
  delay: number;
}) {
  const hasData = Boolean(value);
  return (
    <button
      onClick={onClick}
      className="group flex w-full animate-in items-center gap-4 rounded-xl bg-card p-5 text-left transition-all fade-in slide-in-from-bottom-2 hover:bg-surface"
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: "300ms",
        animationFillMode: "backwards",
      }}
      aria-label={hasData ? `${label} bewerken` : `${label} toevoegen`}
    >
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-muted-foreground">{label}</div>
        <div className="mt-1 flex items-center gap-1.5">
          {hasData && valueIcon ? (
            <span className="flex-shrink-0 text-muted-foreground">
              {valueIcon}
            </span>
          ) : null}
          <p className="truncate text-base font-bold text-foreground">
            {hasData ? (
              value
            ) : (
              <span className="font-medium text-muted-foreground">
                Nog niet ingevuld
              </span>
            )}
          </p>
        </div>
      </div>
      {hasData ? (
        <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-xl bg-muted/50 text-muted-foreground transition-colors group-hover:bg-muted/80">
          <Pencil className="size-4" strokeWidth={2} />
        </div>
      ) : (
        <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/30 transition-colors group-hover:bg-primary/90">
          <Plus className="size-6" strokeWidth={3} />
        </div>
      )}
    </button>
  );
}

function CompanyInfoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isParsed = searchParams.get("parsed") === "true";

  // Load data from sessionStorage
  const loadCompanyData = (): CompanyData => {
    if (typeof window === "undefined") return {};

    const stored = sessionStorage.getItem("onboarding_company");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse company data:", e);
      }
    }
    return {};
  };

  // Start empty so server and first client render match; the effect below
  // hydrates from sessionStorage after mount (avoids a hydration mismatch).
  const [formData, setFormData] = useState<CompanyData>({});
  const [openDrawer, setOpenDrawer] = useState<string | null>(null);
  const [tempData, setTempData] = useState<Partial<CompanyData>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reload data on mount
  useEffect(() => {
    setFormData(loadCompanyData());
  }, []);

  const handleContinue = () => {
    sessionStorage.setItem("onboarding_company", JSON.stringify(formData));
    router.push("/onboarding/v2/products");
  };

  const handleBack = () => {
    router.push("/onboarding/v2/upload");
  };

  const openEdit = (field: string) => {
    if (field === "company") {
      setTempData({ name: formData.name, logo: formData.logo });
    } else if (field === "industry") {
      setTempData({ industry: formData.industry });
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
        newErrors.phone = "Ongeldig telefoonnummer";
      }
      if (tempData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tempData.email)) {
        newErrors.email = "Ongeldig e-mailadres";
      }
    }

    if (openDrawer === "vat-iban") {
      if (tempData.iban && !/^NL\d{2}\s?[A-Z]{4}\s?\d{10}$/.test(tempData.iban)) {
        newErrors.iban = "Ongeldig Nederlands IBAN";
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
      if (field.includes(".")) {
        const [parent, child] = field.split(".");
        return {
          ...prev,
          [parent]: {
            ...(prev[parent as keyof CompanyData] as any),
            [child]: value,
          },
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

  const fullAddress = formData.address
    ? [formData.address.street, formData.address.postal, formData.address.city]
        .filter(Boolean)
        .join(", ")
    : "";
  const contactInfo = [formData.phone, formData.email].filter(Boolean).join(" • ");
  const vatIbanInfo = [formData.vat, formData.iban].filter(Boolean).join(" • ");
  const IndustryIcon =
    INDUSTRIES.find((i) => i.name === formData.industry)?.icon ?? Hammer;

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <div className="mx-auto w-full max-w-2xl flex-1 space-y-6 p-6 pb-32">
          {/* Progress indicator with back button */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="flex-shrink-0 text-muted-foreground hover:text-foreground"
              aria-label="Terug naar upload"
            >
              <ArrowLeft className="size-5" />
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

          {/* Header + subtitle (same style as "Upload een offerte") */}
          <div className="space-y-2">
            <h1 className="font-display text-3xl font-semibold">
              Bedrijfsgegevens
            </h1>
            <p className="text-base text-muted-foreground">
              Controleer je gegevens en vul aan wat nog ontbreekt. Je kunt dit
              later aanpassen in je instellingen.
            </p>
          </div>

          <div className="space-y-4">
            <InfoCard
              label="Bedrijf"
              value={formData.name}
              onClick={() => openEdit("company")}
              delay={0}
            />
            <InfoCard
              label="Vakgebied"
              valueIcon={<IndustryIcon className="size-4" strokeWidth={2} />}
              value={formData.industry}
              onClick={() => openEdit("industry")}
              delay={50}
            />
            <InfoCard
              label="Adres"
              value={fullAddress}
              onClick={() => openEdit("address")}
              delay={100}
            />
            <InfoCard
              label="Contactgegevens"
              value={contactInfo}
              onClick={() => openEdit("contact")}
              delay={150}
            />
            <InfoCard
              label="KVK-nummer"
              value={formData.kvk}
              onClick={() => openEdit("kvk")}
              delay={200}
            />
            <InfoCard
              label="Btw & IBAN"
              value={vatIbanInfo}
              onClick={() => openEdit("vat-iban")}
              delay={250}
            />
          </div>
        </div>

        <div className="fixed inset-x-0 bottom-0 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="mx-auto flex w-full max-w-2xl justify-end p-6">
            <Button
              className="h-12 rounded-xl px-6 text-base font-bold"
              onClick={handleContinue}
              aria-label="Doorgaan naar producten & diensten"
            >
              Doorgaan
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
          <Drawer.Content className="fixed right-0 bottom-0 left-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] bg-background">
            <div className="mx-auto mt-4 h-1.5 w-12 flex-shrink-0 rounded-full bg-muted" />
            <div className="flex-1 overflow-y-auto p-6">
              <Drawer.Title className="mb-6 font-display text-xl font-semibold">
                Bedrijf
              </Drawer.Title>
              <div className="space-y-6">
                <div className="space-y-2">
                  <FieldLabel htmlFor="company-name">Bedrijfsnaam</FieldLabel>
                  <FieldInput
                    id="company-name"
                    value={tempData.name || ""}
                    onChange={(e) => updateTempField("name", e.target.value)}
                    placeholder="Je bedrijfsnaam"
                  />
                </div>
                <div className="flex gap-3 pb-safe">
                  <Button variant="outline" onClick={closeDrawer} className="flex-1">
                    Annuleren
                  </Button>
                  <Button onClick={validateAndSave} className="flex-1">
                    Opslaan
                  </Button>
                </div>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      {/* Industry */}
      <Drawer.Root
        open={openDrawer === "industry"}
        onOpenChange={(open) => !open && closeDrawer()}
      >
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="fixed right-0 bottom-0 left-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] bg-background">
            <div className="mx-auto mt-4 h-1.5 w-12 flex-shrink-0 rounded-full bg-muted" />
            <div className="flex-1 overflow-y-auto p-6">
              <Drawer.Title className="mb-2 font-display text-xl font-semibold">
                Vakgebied
              </Drawer.Title>
              <p className="mb-6 text-sm text-muted-foreground">
                Kies het vakgebied waarin je vooral werkt.
              </p>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
                  {INDUSTRIES.map(({ name, icon: Icon }) => {
                    const selected = tempData.industry === name;
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => updateTempField("industry", name)}
                        className={`flex items-center gap-2.5 rounded-lg px-2 py-2.5 text-left text-base font-semibold transition-colors ${
                          selected
                            ? "text-primary"
                            : "text-foreground hover:text-primary"
                        }`}
                      >
                        <Icon className="size-5" strokeWidth={2} />
                        <span>{name}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-3 pb-safe">
                  <Button variant="outline" onClick={closeDrawer} className="flex-1">
                    Annuleren
                  </Button>
                  <Button onClick={validateAndSave} className="flex-1">
                    Opslaan
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
          <Drawer.Content className="fixed right-0 bottom-0 left-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] bg-background">
            <div className="mx-auto mt-4 h-1.5 w-12 flex-shrink-0 rounded-full bg-muted" />
            <div className="flex-1 overflow-y-auto p-6">
              <Drawer.Title className="mb-6 font-display text-xl font-semibold">
                Adres
              </Drawer.Title>
              <div className="space-y-6">
                <div className="space-y-2">
                  <FieldLabel htmlFor="street">Straat</FieldLabel>
                  <FieldInput
                    id="street"
                    value={tempData.address?.street || ""}
                    onChange={(e) => updateTempField("address.street", e.target.value)}
                    placeholder="Straat en huisnummer"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <FieldLabel htmlFor="postal">Postcode</FieldLabel>
                    <FieldInput
                      id="postal"
                      value={tempData.address?.postal || ""}
                      onChange={(e) => updateTempField("address.postal", e.target.value)}
                      placeholder="1234 AB"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <FieldLabel htmlFor="city">Plaats</FieldLabel>
                    <FieldInput
                      id="city"
                      value={tempData.address?.city || ""}
                      onChange={(e) => updateTempField("address.city", e.target.value)}
                      placeholder="Amsterdam"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pb-safe">
                  <Button variant="outline" onClick={closeDrawer} className="flex-1">
                    Annuleren
                  </Button>
                  <Button onClick={validateAndSave} className="flex-1">
                    Opslaan
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
          <Drawer.Content className="fixed right-0 bottom-0 left-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] bg-background">
            <div className="mx-auto mt-4 h-1.5 w-12 flex-shrink-0 rounded-full bg-muted" />
            <div className="flex-1 overflow-y-auto p-6">
              <Drawer.Title className="mb-6 font-display text-xl font-semibold">
                Contactgegevens
              </Drawer.Title>
              <div className="space-y-6">
                <div className="space-y-2">
                  <FieldLabel htmlFor="phone">Telefoon</FieldLabel>
                  <FieldInput
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
                  <FieldLabel htmlFor="email">E-mail</FieldLabel>
                  <FieldInput
                    id="email"
                    type="email"
                    value={tempData.email || ""}
                    onChange={(e) => updateTempField("email", e.target.value)}
                    placeholder="hallo@bedrijf.nl"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>
                <div className="flex gap-3 pb-safe">
                  <Button variant="outline" onClick={closeDrawer} className="flex-1">
                    Annuleren
                  </Button>
                  <Button onClick={validateAndSave} className="flex-1">
                    Opslaan
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
          <Drawer.Content className="fixed right-0 bottom-0 left-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] bg-background">
            <div className="mx-auto mt-4 h-1.5 w-12 flex-shrink-0 rounded-full bg-muted" />
            <div className="flex-1 overflow-y-auto p-6">
              <Drawer.Title className="mb-6 font-display text-xl font-semibold">
                KVK-nummer
              </Drawer.Title>
              <div className="space-y-6">
                <div className="space-y-2">
                  <FieldLabel htmlFor="kvk">KVK-nummer</FieldLabel>
                  <FieldInput
                    id="kvk"
                    value={tempData.kvk || ""}
                    onChange={(e) => updateTempField("kvk", e.target.value)}
                    placeholder="12345678"
                  />
                </div>
                <div className="flex gap-3 pb-safe">
                  <Button variant="outline" onClick={closeDrawer} className="flex-1">
                    Annuleren
                  </Button>
                  <Button onClick={validateAndSave} className="flex-1">
                    Opslaan
                  </Button>
                </div>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      {/* Btw & IBAN */}
      <Drawer.Root
        open={openDrawer === "vat-iban"}
        onOpenChange={(open) => !open && closeDrawer()}
      >
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="fixed right-0 bottom-0 left-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] bg-background">
            <div className="mx-auto mt-4 h-1.5 w-12 flex-shrink-0 rounded-full bg-muted" />
            <div className="flex-1 overflow-y-auto p-6">
              <Drawer.Title className="mb-6 font-display text-xl font-semibold">
                Btw & IBAN
              </Drawer.Title>
              <div className="space-y-6">
                <div className="space-y-2">
                  <FieldLabel htmlFor="vat">Btw-nummer</FieldLabel>
                  <FieldInput
                    id="vat"
                    value={tempData.vat || ""}
                    onChange={(e) => updateTempField("vat", e.target.value)}
                    placeholder="NL123456789B01"
                  />
                </div>
                <div className="space-y-2">
                  <FieldLabel htmlFor="iban">IBAN</FieldLabel>
                  <FieldInput
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
                    Annuleren
                  </Button>
                  <Button onClick={validateAndSave} className="flex-1">
                    Opslaan
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
    <Suspense fallback={<div>Laden...</div>}>
      <CompanyInfoContent />
    </Suspense>
  );
}
