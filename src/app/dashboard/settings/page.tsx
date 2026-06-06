"use client";

import { useState, useEffect, useRef } from "react";
import { Pencil, Trash2, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

type Tab = "company" | "products" | "templates" | "billing";

type CompanyData = {
  id: string;
  name: string;
  street: string | null;
  city: string | null;
  postal: string | null;
  phone: string | null;
  email: string | null;
  kvk: string | null;
  vat_number: string | null;
  iban: string | null;
  logo_url: string | null;
};

type SettingsData = {
  id: string;
  next_quote_number: number | null;
  quote_number_format: string | null;
  quote_intro: string | null;
  quote_disclaimer: string | null;
};

async function getCurrentCompanyId(): Promise<string | null> {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/active_company_id=([^;]+)/);
  return match?.[1] ?? null;
}

async function getUserId(): Promise<string | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

function formatQuoteNumber(format: string, num: number): string {
  const year = new Date().getFullYear();
  return format
    .replace("{YEAR}", String(year))
    .replace("{NUMBER}", String(num).padStart(3, "0"));
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("company");
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);

  // Form state
  const [form, setForm] = useState<Partial<CompanyData>>({});
  const [quoteNumberInput, setQuoteNumberInput] = useState("");
  const [editingQuoteNumber, setEditingQuoteNumber] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const originalForm = useRef<Partial<CompanyData>>({});

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const companyId = await getCurrentCompanyId();
      if (!companyId) return;

      const [{ data: co }, { data: se }] = await Promise.all([
        supabase.from("companies").select("*").eq("id", companyId).single(),
        supabase.from("company_settings").select("*").eq("company_id", companyId).single(),
      ]);

      if (co) {
        setCompany(co);
        setLogoUrl(co.logo_url);
        const f = {
          name: co.name,
          street: co.street ?? "",
          city: co.city ?? "",
          postal: co.postal ?? "",
          phone: co.phone ?? "",
          email: co.email ?? "",
          kvk: co.kvk ?? "",
          vat_number: co.vat_number ?? "",
          iban: co.iban ?? "",
        };
        setForm(f);
        originalForm.current = f;
      }

      if (se) {
        setSettings(se);
        setQuoteNumberInput(String(se.next_quote_number ?? 1));
      }

      setLoading(false);
    }
    load();
  }, []);

  function handleFormChange(field: keyof CompanyData, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  }

  function validateForm(): boolean {
    const newErrors: Record<string, string> = {};
    if (!form.name?.trim()) newErrors.name = "Bedrijfsnaam is verplicht";
    if (form.phone && !/^\+?[\d\s-]{8,}$/.test(form.phone)) newErrors.phone = "Ongeldig telefoonnummer";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Ongeldig e-mailadres";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSave() {
    if (!validateForm()) return;
    setSaving(true);

    const supabase = createClient();
    const companyId = await getCurrentCompanyId();
    if (!companyId) return;

    await supabase.from("companies").update({
      name: form.name,
      street: form.street || null,
      city: form.city || null,
      postal: form.postal || null,
      phone: form.phone || null,
      email: form.email || null,
      kvk: form.kvk || null,
      vat_number: form.vat_number || null,
      iban: form.iban || null,
    }).eq("id", companyId);

    originalForm.current = { ...form };
    setIsDirty(false);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleDiscard() {
    setForm({ ...originalForm.current });
    setIsDirty(false);
    setErrors({});
  }

  async function handleLogoUpload(file: File) {
    if (file.size > 1024 * 1024) {
      setErrors(prev => ({ ...prev, logo: "Logo mag maximaal 1MB zijn" }));
      return;
    }

    setLogoUploading(true);
    const supabase = createClient();
    const companyId = await getCurrentCompanyId();
    const userId = await getUserId();
    if (!companyId || !userId) return;

    const ext = file.name.split(".").pop() ?? "png";
    const path = `${userId}/${companyId}/logo.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("company-assets")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      setErrors(prev => ({ ...prev, logo: "Upload mislukt, probeer opnieuw" }));
      setLogoUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("company-assets").getPublicUrl(path);
    const url = urlData.publicUrl + `?t=${Date.now()}`;

    await supabase.from("companies").update({ logo_url: url }).eq("id", companyId);
    setLogoUrl(url);
    setLogoUploading(false);
  }

  async function handleLogoDelete() {
    const supabase = createClient();
    const companyId = await getCurrentCompanyId();
    if (!companyId) return;
    await supabase.from("companies").update({ logo_url: null }).eq("id", companyId);
    setLogoUrl(null);
  }

  async function handleSaveQuoteNumber() {
    const supabase = createClient();
    const companyId = await getCurrentCompanyId();
    if (!companyId) return;

    const num = parseInt(quoteNumberInput) || 1;
    await supabase.from("company_settings").update({ next_quote_number: num }).eq("company_id", companyId);
    setSettings(prev => prev ? { ...prev, next_quote_number: num } : prev);
    setEditingQuoteNumber(false);
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "company", label: "Bedrijfsgegevens" },
    { key: "products", label: "Producten & diensten" },
    { key: "templates", label: "Templates" },
    { key: "billing", label: "Billing" },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Laden...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky header + tabs */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border shadow-sm">
        <div className="px-4 pt-6 pb-0 md:px-10">
          <h1 className="font-display text-3xl font-bold mb-4">Instellingen</h1>
          <div
            role="tablist"
            aria-label="Instellingen navigatie"
            className="flex gap-0 overflow-x-auto"
          >
            {tabs.map(tab => (
              <button
                key={tab.key}
                role="tab"
                aria-selected={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? "border-primary text-foreground font-bold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-8 md:px-10 mx-auto w-full max-w-2xl">

        {/* Company info tab */}
        {activeTab === "company" && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-bold">Bedrijfsgegevens</h2>

            {/* Logo */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Bedrijfslogo</label>
              {logoUrl ? (
                <div className="relative inline-block">
                  <img
                    src={logoUrl}
                    alt="Bedrijfslogo"
                    className="h-24 w-auto rounded-xl border border-border object-contain p-2 bg-background"
                  />
                  <button
                    onClick={handleLogoDelete}
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-background border border-border shadow-sm hover:bg-red-50 transition-colors"
                    aria-label="Logo verwijderen"
                  >
                    <Trash2 className="h-3 w-3 text-muted-foreground" />
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-8 transition-colors hover:bg-muted/40">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3">
                    {logoUploading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border border-muted-foreground border-t-transparent" />
                    ) : (
                      <Camera className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <p className="text-sm font-medium">{logoUploading ? "Uploaden..." : "Sleep je logo hier of klik om te uploaden"}</p>
                  <p className="text-xs text-muted-foreground mt-1">JPG of PNG, max 1MB</p>
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    className="hidden"
                    disabled={logoUploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleLogoUpload(file);
                      e.target.value = "";
                    }}
                  />
                </label>
              )}
              {errors.logo && <p className="text-sm text-destructive">{errors.logo}</p>}
            </div>

            {/* Bedrijfsnaam */}
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="name">Bedrijfsnaam</label>
              <input
                id="name"
                type="text"
                value={form.name ?? ""}
                onChange={(e) => handleFormChange("name", e.target.value)}
                className={`w-full h-12 rounded-xl border bg-background px-4 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${errors.name ? "border-destructive" : "border-input"}`}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            {/* Adres — TODO: Google Places */}
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="street">Adres</label>
              <input
                id="street"
                type="text"
                value={form.street ?? ""}
                onChange={(e) => handleFormChange("street", e.target.value)}
                placeholder="Straat en huisnummer"
                className="w-full h-12 rounded-xl border border-input bg-background px-4 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={form.postal ?? ""}
                  onChange={(e) => handleFormChange("postal", e.target.value)}
                  placeholder="Postcode"
                  className="h-12 rounded-xl border border-input bg-background px-4 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <input
                  type="text"
                  value={form.city ?? ""}
                  onChange={(e) => handleFormChange("city", e.target.value)}
                  placeholder="Stad"
                  className="h-12 rounded-xl border border-input bg-background px-4 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>

            {/* Telefoon */}
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="phone">Telefoonnummer</label>
              <input
                id="phone"
                type="tel"
                inputMode="tel"
                value={form.phone ?? ""}
                onChange={(e) => handleFormChange("phone", e.target.value)}
                placeholder="0612345678"
                className={`w-full h-12 rounded-xl border bg-background px-4 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${errors.phone ? "border-destructive" : "border-input"}`}
              />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">E-mailadres</label>
              <input
                id="email"
                type="email"
                inputMode="email"
                value={form.email ?? ""}
                onChange={(e) => handleFormChange("email", e.target.value)}
                placeholder="naam@bedrijf.nl"
                className={`w-full h-12 rounded-xl border bg-background px-4 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${errors.email ? "border-destructive" : "border-input"}`}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            {/* KVK */}
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <label className="text-sm font-medium" htmlFor="kvk">KVK-nummer</label>
                <span className="text-xs text-muted-foreground">Zichtbaar op offertes en facturen</span>
              </div>
              <input
                id="kvk"
                type="text"
                inputMode="numeric"
                value={form.kvk ?? ""}
                onChange={(e) => handleFormChange("kvk", e.target.value)}
                placeholder="12345678"
                className="w-full h-12 rounded-xl border border-input bg-background px-4 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            {/* BTW */}
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <label className="text-sm font-medium" htmlFor="vat">BTW-nummer</label>
                <span className="text-xs text-muted-foreground">Zichtbaar op offertes en facturen</span>
              </div>
              <input
                id="vat"
                type="text"
                value={form.vat_number ?? ""}
                onChange={(e) => handleFormChange("vat_number", e.target.value)}
                placeholder="NL000000000B00"
                className="w-full h-12 rounded-xl border border-input bg-background px-4 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            {/* IBAN */}
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <label className="text-sm font-medium" htmlFor="iban">IBAN</label>
                <span className="text-xs text-muted-foreground">Zichtbaar op offertes en facturen</span>
              </div>
              <input
                id="iban"
                type="text"
                value={form.iban ?? ""}
                onChange={(e) => handleFormChange("iban", e.target.value)}
                placeholder="NL00 BANK 0000 0000 00"
                className="w-full h-12 rounded-xl border border-input bg-background px-4 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            {/* Save / Discard */}
            <div className="pt-4 space-y-3">
              <Button
                className="w-full"
                onClick={handleSave}
                disabled={!isDirty || saving}
                aria-disabled={!isDirty || saving}
              >
                {saved ? "✓ Opgeslagen" : saving ? "Bezig..." : "Wijzigingen opslaan"}
              </Button>
              {isDirty && (
                <button
                  onClick={handleDiscard}
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                >
                  Annuleren
                </button>
              )}
            </div>
          </div>
        )}

        {/* Products & Services tab */}
        {activeTab === "products" && (
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold">Producten & diensten</h2>
            <p className="text-muted-foreground">Binnenkort beschikbaar.</p>
          </div>
        )}

        {/* Templates tab */}
        {activeTab === "templates" && (
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="font-display text-2xl font-bold">Offertenummering</h2>

              {editingQuoteNumber ? (
                <div className="space-y-3">
                  <label className="text-sm font-medium" htmlFor="quote-number">
                    Wat wordt je eerstvolgende offertenummer?
                  </label>
                  <input
                    id="quote-number"
                    type="number"
                    inputMode="numeric"
                    value={quoteNumberInput}
                    onChange={(e) => setQuoteNumberInput(e.target.value)}
                    placeholder={String(settings?.next_quote_number ?? 1)}
                    className="w-full h-12 rounded-xl border border-input bg-background px-4 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={handleSaveQuoteNumber}>
                      Opslaan
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => setEditingQuoteNumber(false)}>
                      Annuleren
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Volgend offertenummer</p>
                    <p className="font-bold text-lg">
                      {settings?.next_quote_number
                        ? formatQuoteNumber(
                            settings.quote_number_format ?? "{YEAR}-{NUMBER}",
                            settings.next_quote_number
                          )
                        : "Nog niet ingesteld"}
                    </p>
                  </div>
                  <button
                    onClick={() => setEditingQuoteNumber(true)}
                    aria-label="Offertenummer aanpassen"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Quote template preview */}
            <div className="space-y-4">
              <h2 className="font-display text-2xl font-bold">Offerte template</h2>
              <p className="text-sm text-muted-foreground">
                Gegenereerd op basis van je geüploade offerte en bedrijfsgegevens. Zo zien je klanten het.
              </p>
              <div className="relative rounded-xl border border-border bg-muted/30 aspect-[3/4] flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Binnenkort beschikbaar</p>
              </div>
            </div>

            {/* Invoice template preview */}
            <div className="space-y-4">
              <h2 className="font-display text-2xl font-bold">Factuur template</h2>
              <p className="text-sm text-muted-foreground">
                Gegenereerd op basis van je geüploade offerte en bedrijfsgegevens. Zo zien je klanten het.
              </p>
              <div className="relative rounded-xl border border-border bg-muted/30 aspect-[3/4] flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Binnenkort beschikbaar</p>
              </div>
            </div>
          </div>
        )}

        {/* Billing tab */}
        {activeTab === "billing" && (
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold">Billing</h2>
            <p className="text-muted-foreground">Binnenkort beschikbaar.</p>
          </div>
        )}
      </div>
    </div>
  );
}