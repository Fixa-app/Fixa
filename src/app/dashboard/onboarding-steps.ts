export const ONBOARDING_TOTAL = 4;

export type OnboardingStep = {
  title: string;
  description: string;
  href: string;
  cta: string;
  completed: boolean;
};

export function onboardingSteps({
  hasCompany,
  hasLogo,
  hasQuoteNumber,
}: {
  hasCompany: boolean;
  hasLogo: boolean;
  hasQuoteNumber: boolean;
}): OnboardingStep[] {
  return [
    {
      title: "Bedrijfsgegevens",
      description: "Vul je bedrijfsnaam, adres en contactgegevens aan.",
      href: "/dashboard/settings",
      cta: "Aanvullen",
      completed: hasCompany,
    },
    {
      title: "Producten & diensten",
      description: "Beheer je producten, diensten en tarieven.",
      href: "/dashboard/products",
      cta: "Toevoegen",
      completed: hasCompany,
    },
    {
      title: "Logo uploaden",
      description: "Voeg je bedrijfslogo toe aan je offertes.",
      href: "/dashboard/settings#logo",
      cta: "Uploaden",
      completed: hasLogo,
    },
    {
      title: "Offertenummering instellen",
      description: "Stel je startnummer en format in.",
      href: "/dashboard/settings#numbering",
      cta: "Instellen",
      completed: hasQuoteNumber,
    },
  ];
}

export function onboardingCompletedCount({
  hasCompany,
  hasLogo,
  hasQuoteNumber,
}: {
  hasCompany: boolean;
  hasLogo: boolean;
  hasQuoteNumber: boolean;
}): number {
  return onboardingSteps({ hasCompany, hasLogo, hasQuoteNumber }).filter(
    (s) => s.completed
  ).length;
}