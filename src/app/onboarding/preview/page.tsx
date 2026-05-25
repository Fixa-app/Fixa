"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { saveOnboardingData } from '@/lib/save-onboarding-data';

type CompanyInfo = {
  name: string;
  address: {
    street: string;
    city: string;
    postal: string;
  };
  phone?: string;
  email?: string;
  kvk?: string;
  vat?: string;
  iban?: string;
};

type LineItem = {
  title: string;
  unit: string;
  rate: number;
};

export default function OnboardingPreviewPage() {
  const router = useRouter();
  const [company, setCompany] = useState<CompanyInfo | null>(null);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load all onboarding data
    const companyData = sessionStorage.getItem('onboarding_company');
    const itemsData = sessionStorage.getItem('onboarding_lineItems');

    if (companyData) {
      setCompany(JSON.parse(companyData));
    }
    if (itemsData) {
      setLineItems(JSON.parse(itemsData));
    }

    setMounted(true);
  }, []);

  const handleFinish = async () => {
  try {
    // Save all onboarding data to Supabase
    await saveOnboardingData();
    
    // Navigate to dashboard
    router.push('/dashboard');
  } catch (error) {
    console.error('Failed to save onboarding data:', error);
    alert('Er ging iets mis bij het opslaan. Probeer het opnieuw.');
  }
};

  if (!mounted) {
    return null;
  }

  return (
      <div className="flex min-h-screen flex-col bg-background">
      <div className="flex-1 space-y-6 pb-32">
        {/* Progress indicator with back button */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
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
                <div className="h-full w-full bg-primary transition-all" />
              </div>
            </div>
            <span className="ml-4 text-sm text-muted-foreground">4/4</span>
          </div>
        </div>

        <h1 className="font-display text-3xl font-bold">
          You're all set!
        </h1>
        <p className="text-muted-foreground">
          Here's how your quotes will look. You can edit this anytime in settings.
        </p>

        {/* A4 Quote Preview */}
        <div className="flex justify-center px-4">
          <div 
            className="w-full max-w-[400px] overflow-hidden rounded-lg bg-white shadow-lg animate-in fade-in slide-in-from-bottom-2 md:max-w-[210mm]"
            style={{
              animationDelay: '0ms',
              animationDuration: '300ms',
              animationFillMode: 'backwards',
            }}
          >
            {/* A4 Content */}
            <div className="flex h-full flex-col p-6 text-gray-900 md:p-12">
              {/* Header */}
              <div className="mb-6 flex items-start justify-between border-b border-gray-200 pb-4 md:mb-8 md:pb-6">
                <div>
                  <div className="mb-2 flex h-8 w-24 items-center justify-center rounded bg-gray-100 px-2 text-[8px] text-gray-400 md:h-10 md:w-32 md:text-[9px]">
                    Logo added later
                  </div>
                  {company && (
                    <div className="mt-3">
                      <p className="text-xs font-semibold md:text-sm">{company.name}</p>
                      {company.address && (
                        <>
                          <p className="text-[10px] text-gray-600 md:text-xs">{company.address.street}</p>
                          <p className="text-[10px] text-gray-600 md:text-xs">
                            {company.address.postal} {company.address.city}
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <h2 className="mb-2 text-sm font-bold md:mb-1 md:text-lg">OFFERTE</h2>
                  <p className="text-[10px] text-gray-600 md:text-xs">{new Date().toLocaleDateString('nl-NL')}</p>
                  {company && (
                    <div className="mt-3 space-y-0.5 text-[9px] text-gray-600 md:text-xs">
                      {company.kvk && <p>KVK: {company.kvk}</p>}
                      {company.vat && <p>BTW: {company.vat}</p>}
                      {company.iban && <p>IBAN: {company.iban}</p>}
                    </div>
                  )}
                </div>
              </div>

              {/* Client placeholder */}
              <div className="mb-4 md:mb-6">
                <p className="text-[10px] font-semibold text-gray-500 md:text-xs">Klantgegevens</p>
              </div>

              {/* Line items */}
              <div className="mb-4 flex-1 md:mb-6">
                <table className="w-full text-[10px] md:text-xs">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="pb-1.5 text-left font-semibold md:pb-2">Omschrijving</th>
                      <th className="pb-1.5 text-right font-semibold md:pb-2">Bedrag</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.slice(0, 5).map((item, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-1.5 md:py-2">{item.title}</td>
                        <td className="py-1.5 text-right md:py-2">€{item.rate.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-3 md:pt-4">
                <div className="flex justify-end">
                  <div className="w-32 md:w-48">
                    <div className="flex justify-between text-[10px] md:text-xs">
                      <span>Subtotaal</span>
                      <span>€{lineItems.reduce((sum, item) => sum + item.rate, 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-600 md:text-xs">
                      <span>BTW (21%)</span>
                      <span>€{(lineItems.reduce((sum, item) => sum + item.rate, 0) * 0.21).toFixed(2)}</span>
                    </div>
                    <div className="mt-1.5 flex justify-between border-t border-gray-300 pt-1.5 text-xs font-bold md:mt-2 md:pt-2 md:text-sm">
                      <span>Totaal</span>
                      <span>€{(lineItems.reduce((sum, item) => sum + item.rate, 0) * 1.21).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky footer */}
      <div className="fixed inset-x-0 bottom-0 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <Button
          size="lg"
          className="m-6 w-[calc(100%-3rem)]"
          onClick={handleFinish}
        >
          Finish setup
        </Button>
      </div>
    </div>
  );
}