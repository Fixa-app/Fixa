import type { Database } from "./database.types";

export type QuoteStatus = Database["public"]["Enums"]["quote_status"];
export type InvoiceStatus = Database["public"]["Enums"]["invoice_status"];
export type RequestStatus = "created" | "converted" | "archived";

export type BadgeVariant =
  | "default"
  | "secondary"
  | "teal"
  | "violet"
  | "burgundy"
  | "destructive";

// ─── Offerte (quote) ──────────────────────────────────────────────────────

export const QUOTE_STATUS_LABELS: Record<QuoteStatus, string> = {
  draft: "Concept",
  awaiting_response: "Verstuurd, wacht op reactie",
  changes_requested: "Wijziging gevraagd",
  ready_to_schedule: "Geaccepteerd",
  declined: "Geweigerd",
  archived: "Gearchiveerd",
};

export const QUOTE_STATUS_BADGE: Record<QuoteStatus, BadgeVariant> = {
  draft: "secondary",
  awaiting_response: "default",
  changes_requested: "burgundy",
  ready_to_schedule: "teal",
  declined: "destructive",
  archived: "secondary",
};

// Statussen die op het dashboard verschijnen — de "actionable" subset.
// declined/archived horen alleen in het volledige overzicht.
export const DASHBOARD_QUOTE_STATUSES: QuoteStatus[] = [
  "draft",
  "awaiting_response",
  "changes_requested",
  "ready_to_schedule",
];

// Statussen die de pro zelf kan kiezen via "Status wijzigen" op de detail-pagina.
// archived staat hier los van (apart, onderaan de sheet).
export const QUOTE_WORKFLOW_STATUS_OPTIONS: QuoteStatus[] = [
  "draft",
  "awaiting_response",
  "ready_to_schedule",
  "changes_requested",
  "declined",
];

// ─── Factuur (invoice) — voorbereid, nog niet in gebruik ─────────────────

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  draft: "Concept",
  awaiting_payment: "Wacht op betaling",
  past_due: "Achterstallig",
  paid: "Betaald",
  archived: "Gearchiveerd",
};

export const INVOICE_STATUS_BADGE: Record<InvoiceStatus, BadgeVariant> = {
  draft: "secondary",
  awaiting_payment: "default",
  past_due: "destructive",
  paid: "teal",
  archived: "secondary",
};

export const DASHBOARD_INVOICE_STATUSES: InvoiceStatus[] = [
  "past_due",
  "awaiting_payment",
  "draft",
];

// ─── Aanvraag (request) ───────────────────────────────────────────────────

export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  created: "Aangemaakt",
  converted: "Omgezet naar offerte",
  archived: "Gearchiveerd",
};

export const REQUEST_STATUS_BADGE: Record<RequestStatus, BadgeVariant> = {
  created: "default",
  converted: "teal",
  archived: "secondary",
};

// Op dashboard tonen we alleen "created" — converted/archived zijn al afgehandeld.
export const DASHBOARD_REQUEST_STATUSES: RequestStatus[] = ["created"];

export const ALL_REQUEST_STATUSES: RequestStatus[] = ["created", "converted", "archived"];
export const ALL_INVOICE_STATUSES: InvoiceStatus[] = ["draft", "awaiting_payment", "past_due", "paid", "archived"];
export const ALL_QUOTE_STATUSES: QuoteStatus[] = [
  "draft",
  "awaiting_response",
  "changes_requested",
  "ready_to_schedule",
  "declined",
  "archived",
];