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

// Facturen hebben nog geen echte flow — mock data blijft staan tot die gebouwd is.
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
    id: "i-008",
    client_name: "Visser Tegelwerken",
    status: "past_due",
    total_amount: 2100,
    updated_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    due_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Status-labels, badge-kleuren en dashboard-statuslijsten staan vanaf nu
// gecentraliseerd in src/lib/status-config.ts — dit bestand bevat alleen
// nog mock-invoice-data (tot de invoices-flow echt gebouwd is) en de
// aggregatie-helper voor het dashboard.
import { INVOICE_STATUS_LABELS, DASHBOARD_INVOICE_STATUSES } from "./status-config";

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