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

type Params = { params: Promise<{ id: string }> };

// POST — ken een definitief factuurnummer toe en zet status op awaiting_payment.
// Verhoog next_invoice_number in company_settings (conform Moneybird-patroon:
// nummer pas definitief bij versturen, niet bij aanmaken).
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { userId } = await request.json();

    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const service = createServiceClient();

    const { data: invoice } = await service.from('invoices').select('company_id').eq('id', id).single();
    if (!invoice) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const { data: settings } = await service
      .from('company_settings')
      .select('next_invoice_number, invoice_number_format')
      .eq('company_id', invoice.company_id)
      .single();

    const nextNumber = settings?.next_invoice_number ?? 1;
    const format = settings?.invoice_number_format ?? '{year}-{id}';
    const invoiceNumber = generateInvoiceNumber(format, nextNumber);
    const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    // Update invoice + verhoog teller in één transactie
    await Promise.all([
      service.from('invoices').update({
        invoice_number: invoiceNumber,
        status: 'awaiting_payment',
        sent_at: new Date().toISOString(),
        due_date: dueDate,
      }).eq('id', id),
      service.from('company_settings').update({
        next_invoice_number: nextNumber + 1,
      }).eq('company_id', invoice.company_id),
    ]);

    return NextResponse.json({ success: true, invoiceNumber });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}