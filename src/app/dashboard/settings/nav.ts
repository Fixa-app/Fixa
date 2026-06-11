export type SettingsTab = "company" | "products" | "templates" | "billing";

export const SETTINGS_NAV: { key: SettingsTab; label: string }[] = [
  { key: "company", label: "Bedrijfsgegevens" },
  { key: "products", label: "Producten & diensten" },
  { key: "templates", label: "Templates" },
  { key: "billing", label: "Billing" },
];
