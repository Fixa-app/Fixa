import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

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

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(amount).replace(/\s/g, '');
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
}

type Params = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { userId } = await request.json();

    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const service = createServiceClient();

    const { data: invoice } = await service
      .from('invoices')
      .select('company_id, client_id, quote_id')
      .eq('id', id)
      .single();

    if (!invoice) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const [{ data: settings }, { data: client }, { data: company }, { data: lineItems }] = await Promise.all([
      service.from('company_settings')
        .select('next_invoice_number, invoice_number_format')
        .eq('company_id', invoice.company_id)
        .single(),
      service.from('clients')
        .select('name, email')
        .eq('id', invoice.client_id)
        .single(),
      service.from('companies')
        .select('name, phone, iban')
        .eq('id', invoice.company_id)
        .single(),
      service.from('invoice_line_items')
        .select('quantity, rate, tax_percentage')
        .eq('invoice_id', id),
    ]);

    const nextNumber = settings?.next_invoice_number ?? 1;
    const format = settings?.invoice_number_format ?? '{year}-{id}';
    const invoiceNumber = generateInvoiceNumber(format, nextNumber);
    const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

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

    // Bereken totaal voor e-mail
    const subtotal = (lineItems ?? []).reduce((sum, i) => sum + i.quantity * i.rate, 0);
    const taxTotal = (lineItems ?? []).reduce((sum, i) => sum + i.quantity * i.rate * (i.tax_percentage / 100), 0);
    const total = subtotal + taxTotal;

    // Stuur e-mail naar klant
    if (client?.email && process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const from = process.env.RESEND_FROM ?? 'Fixa <automated@hifixa.com>';

      await resend.emails.send({
        from,
        to: client.email,
        subject: `Factuur ${invoiceNumber} van ${company?.name ?? 'uw aannemer'}`,
        html: `
          <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #111;">
            <p>Beste ${client.name},</p>
            <p>${company?.name ?? 'Uw aannemer'} heeft factuur <strong>${invoiceNumber}</strong> naar u verstuurd.</p>
            <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px 0; color: #666;">Factuurnummer</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 600;">${invoiceNumber}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px 0; color: #666;">Subtotaal ex BTW</td>
                <td style="padding: 8px 0; text-align: right;">${formatCurrency(subtotal)}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px 0; color: #666;">BTW</td>
                <td style="padding: 8px 0; text-align: right;">${formatCurrency(taxTotal)}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; font-weight: 700; font-size: 16px;">Totaal incl. BTW</td>
                <td style="padding: 12px 0; text-align: right; font-weight: 700; font-size: 16px;">${formatCurrency(total)}</td>
              </tr>
            </table>
            <p style="color: #666;">Vervaldatum: <strong>${formatDate(dueDate)}</strong></p>
            ${company?.iban ? `<p style="color: #666;">Betalen via IBAN: <strong>${company.iban}</strong></p>` : ''}
            ${company?.phone ? `<p style="color: #666; font-size: 14px;">Vragen? Bel ons op ${company.phone}</p>` : ''}
            <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
            <p style="color: #aaa; font-size: 12px;">Deze e-mail is verstuurd via Fixa.</p>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true, invoiceNumber });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}