import type { Database } from "./database.types";

type QuoteStatus = Database["public"]["Enums"]["quote_status"];
type InvoiceStatus = Database["public"]["Enums"]["invoice_status"];

export type MockQuote = {
  id: string;
  client_name: string;
  status: QuoteStatus;
  total_amount: number;
  updated_at: string;
};

export type MockInvoice = {
  id: string;
  client_name: string;
  status: InvoiceStatus;
  total_amount: number;
  updated_at: string;
  due_date: string;
};

export type DashboardStatusRow = {
  status: string;
  label: string;
  count: number;
  total: number;
};

export const MOCK_QUOTES: MockQuote[] = [
  {
    id: "q-001",
    client_name: "Van der Berg Installaties",
    status: "ready_to_schedule",
    total_amount: 1200,
    updated_at: new Date().toISOString(),
  },
  {
    id: "q-002",
    client_name: "Bakker & Zonen BV",
    status: "draft",
    total_amount: 3400,
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "q-003",
    client_name: "Smit Aannemersbedrijf",
    status: "draft",
    total_amount: 890,
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "q-004",
    client_name: "De Vries Loodgieters",
    status: "draft",
    total_amount: 1450,
    updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "q-005",
    client_name: "Hendriks Elektra",
    status: "draft",
    total_amount: 750,
    updated_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "q-006",
    client_name: "Jansen Schilderwerken",
    status: "draft",
    total_amount: 700,
    updated_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "q-007",
    client_name: "Piet Hoekstra Timmerwerk",
    status: "changes_requested",
    total_amount: 540,
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "q-008",
    client_name: "Groenewoud Dakdekkers",
    status: "changes_requested",
    total_amount: 300,
    updated_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "q-009",
    client_name: "Visser Tegelwerken",
    status: "awaiting_response",
    total_amount: 2100,
    updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "q-010",
    client_name: "Mol Stucadoors",
    status: "declined",
    total_amount: 650,
    updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const MOCK_INVOICES: MockInvoice[] = [
  {
    id: "i-001",
    client_name: "Van der Berg Installaties",
    status: "awaiting_payment",
    total_amount: 1200,
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    due_date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "i-002",
    client_name: "Bakker & Zonen BV",
    status: "draft",
    total_amount: 3400,
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    due_date: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "i-003",
    client_name: "Smit Aannemersbedrijf",
    status: "draft",
    total_amount: 890,
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    due_date: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "i-004",
    client_name: "De Vries Loodgieters",
    status: "draft",
    total_amount: 1450,
    updated_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    due_date: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "i-005",
    client_name: "Hendriks Elektra",
    status: "draft",
    total_amount: 750,
    updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    due_date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "i-006",
    client_name: "Jansen Schilderwerken",
    status: "draft",
    total_amount: 700,
    updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "i-007",
    client_name: "Piet Hoekstra Timmerwerk",
    status: "draft",
    total_amount: 540,
    updated_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    due_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "i-008",
    client_name: "Visser Tegelwerken",
    status: "past_due",
    total_amount: 2100,
    updated_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    due_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "i-009",
    client_name: "Mol Stucadoors",
    status: "past_due",
    total_amount: 650,
    updated_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    due_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "i-010",
    client_name: "Groenewoud Dakdekkers",
    status: "paid",
    total_amount: 300,
    updated_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    due_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Dashboard-only statuses — de meest "actionable" statussen per funnel-stadium,
// die op het dashboard verschijnen als shortlist. Niet-actionable statussen
// (declined, archived, paid) horen alleen in het volledige overzicht.
export const DASHBOARD_QUOTE_STATUSES: QuoteStatus[] = [
  "draft",
  "awaiting_response",
  "changes_requested",
  "ready_to_schedule",
];

export const DASHBOARD_INVOICE_STATUSES: InvoiceStatus[] = [
  "past_due",
  "awaiting_payment",
  "draft",
];

// Labels per status
export const QUOTE_STATUS_LABELS: Record<QuoteStatus, string> = {
  draft: "Draft",
  awaiting_response: "Awaiting response",
  changes_requested: "Changes requested",
  ready_to_schedule: "Ready to schedule",
  declined: "Declined",
  archived: "Archived",
};

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  draft: "Draft",
  awaiting_payment: "Awaiting payment",
  past_due: "Past due",
  paid: "Paid",
  archived: "Archived",
};

// Aggregate quotes by status for dashboard
export function getQuoteDashboardRows(
  quotes: MockQuote[]
): DashboardStatusRow[] {
  return DASHBOARD_QUOTE_STATUSES.reduce<DashboardStatusRow[]>(
    (acc, status) => {
      const rows = quotes.filter((q) => q.status === status);
      if (rows.length === 0) return acc;
      acc.push({
        status,
        label: QUOTE_STATUS_LABELS[status],
        count: rows.length,
        total: rows.reduce((sum, q) => sum + q.total_amount, 0),
      });
      return acc;
    },
    []
  );
}

// Aggregate invoices by status for dashboard
export function getInvoiceDashboardRows(
  invoices: MockInvoice[]
): DashboardStatusRow[] {
  return DASHBOARD_INVOICE_STATUSES.reduce<DashboardStatusRow[]>(
    (acc, status) => {
      const rows = invoices.filter((i) => i.status === status);
      if (rows.length === 0) return acc;
      acc.push({
        status,
        label: INVOICE_STATUS_LABELS[status],
        count: rows.length,
        total: rows.reduce((sum, i) => sum + i.total_amount, 0),
      });
      return acc;
    },
    []
  );
}