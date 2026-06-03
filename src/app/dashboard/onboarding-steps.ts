export const ONBOARDING_TOTAL = 4;

export type OnboardingStep = {
  title: string;
  description: string;
  href: string;
  cta: string;
  completed: boolean;
};

// Steps 1 & 2 are finished during onboarding (a user only reaches the dashboard
// after creating a company), so they start completed and can be edited here.
// Steps 3 & 4 are still to-do. Completion of those isn't tracked yet.
export function onboardingSteps({
  hasCompany,
}: {
  hasCompany: boolean;
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
      title: "Nodig je team uit",
      description: "Voeg collega's toe en stel hun rollen in.",
      href: "/dashboard/users",
      cta: "Uitnodigen",
      completed: false,
    },
    {
      title: "Download de app",
      description: "Werk onderweg verder met de Fixa-app.",
      href: "#",
      cta: "Downloaden",
      completed: false,
    },
  ];
}

export function onboardingCompletedCount(hasCompany: boolean): number {
  return onboardingSteps({ hasCompany }).filter((s) => s.completed).length;
}
