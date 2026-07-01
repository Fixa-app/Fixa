import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

function generateInvoiceNumber(format: string, nextNumber: number): string {
  const year = new Date().getFullYear().toString();
  const id = nextNumber.toString().padStart(4, '0');
  return format
    .replace('{year}', year)
    .replace('{year_two_digits}', year.slice(-2))
    .replace('{id}', id);
}

// POST — maak een nieuwe factuur aan vanuit een geaccepteerde offerte.
// Alle line items worden overgenomen. Factuurnummer is nog een concept
// (definitief pas bij versturen, conform Moneybird-aanpak).
export async function POST(request: NextRequest) {
  try {
    const { userId, quoteId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const service = createServiceClient();

    // Haal bedrijfsgegevens + nummering op
    const { data: membership } = await service
      .from('company_members')
      .select('company_id')
      .eq('user_id', userId)
      .single();

    if (!membership) {
      return NextResponse.json({ error: 'No company found' }, { status: 404 });
    }

    const { data: settings } = await service
      .from('company_settings')
      .select('next_invoice_number, invoice_number_format')
      .eq('company_id', membership.company_id)
      .single();

    const nextNumber = settings?.next_invoice_number ?? 1;
    const format = settings?.invoice_number_format ?? '{year}-{id}';
    const conceptNumber = `Concept ${generateInvoiceNumber(format, nextNumber)}`;

    // Haal quote-data op als quoteId meegegeven
    let clientId: string | null = null;
    let quoteLineItems: {
      title: string | null;
      description: string | null;
      quantity: number;
      rate: number;
      tax_percentage: number;
      sort_order: number;
    }[] = [];

    if (quoteId) {
      const { data: quote } = await service
        .from('quotes')
        .select('client_id')
        .eq('id', quoteId)
        .single();

      clientId = quote?.client_id ?? null;

      const { data: items } = await service
        .from('line_items')
        .select('title, description, quantity, rate, tax_percentage, sort_order')
        .eq('quote_id', quoteId)
        .order('sort_order', { ascending: true });

      quoteLineItems = items ?? [];
    }

    if (!clientId) {
      return NextResponse.json({ error: 'No client found' }, { status: 400 });
    }

    // Maak de factuur aan
    const { data: invoice, error: invoiceError } = await service
      .from('invoices')
      .insert({
        company_id: membership.company_id,
        client_id: clientId,
        quote_id: quoteId ?? null,
        created_by_user_id: userId,
        invoice_number: conceptNumber,
        status: 'draft',
      })
      .select()
      .single();

    if (invoiceError || !invoice) {
      return NextResponse.json({ error: invoiceError?.message ?? 'Failed to create invoice' }, { status: 500 });
    }

    // Kopieer line items
    if (quoteLineItems.length > 0) {
      const lineItemRows = quoteLineItems.map((item) => ({
        invoice_id: invoice.id,
        title: item.title,
        description: item.description ?? '',
        quantity: item.quantity,
        rate: item.rate,
        tax_percentage: item.tax_percentage,
        sort_order: item.sort_order,
      }));

      await service.from('invoice_line_items').insert(lineItemRows);
    }

    return NextResponse.json({ invoice });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}