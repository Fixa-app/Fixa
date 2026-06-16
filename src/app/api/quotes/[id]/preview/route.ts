import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

type Params = { params: Promise<{ id: string }> };

// GET — haal alle data op voor de quote preview
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const service = createServiceClient();

    // Quote
    const { data: quote } = await service
      .from('quotes')
      .select('*')
      .eq('id', id)
      .single();

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    // Line items
    const { data: lineItems } = await service
      .from('line_items')
      .select('*')
      .eq('quote_id', id)
      .order('sort_order', { ascending: true });

    // Client
    const { data: client } = await service
      .from('clients')
      .select('name, address, email, phone')
      .eq('id', quote.client_id)
      .single();

    // Company
    const { data: company } = await service
      .from('companies')
      .select('name, street, city, postal, phone, email, kvk, vat_number, iban, logo_url')
      .eq('id', quote.company_id)
      .single();

    // Company settings
    const { data: settings } = await service
      .from('company_settings')
      .select('quote_intro, quote_disclaimer, next_quote_number, quote_number_format')
      .eq('company_id', quote.company_id)
      .single();

    return NextResponse.json({
      quote,
      lineItems: lineItems ?? [],
      client,
      company,
      settings,
      companyId: quote.company_id,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// POST — verstuur offerte (wijs offertenummer toe, update status)
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const service = createServiceClient();

    // Haal quote op
    const { data: quote } = await service
      .from('quotes')
      .select('company_id, quote_number')
      .eq('id', id)
      .single();

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    // Haal settings op voor offertenummer
    const { data: settings } = await service
      .from('company_settings')
      .select('next_quote_number, quote_number_format')
      .eq('company_id', quote.company_id)
      .single();

    // Genereer offertenummer als nog niet toegewezen
    let quoteNumber = quote.quote_number;
    if (!quoteNumber && settings?.next_quote_number) {
      const year = new Date().getFullYear();
      const format = settings.quote_number_format ?? '{YEAR}-{NUMBER}';
      quoteNumber = format
        .replace('{YEAR}', String(year))
        .replace('{NUMBER}', String(settings.next_quote_number).padStart(3, '0'));

      // Update quote en verhoog next_quote_number
      await Promise.all([
        service.from('quotes').update({
          quote_number: quoteNumber,
          status: 'awaiting_response',
          sent_at: new Date().toISOString(),
        }).eq('id', id),
        service.from('company_settings').update({
          next_quote_number: settings.next_quote_number + 1,
        }).eq('company_id', quote.company_id),
      ]);
    } else {
      // Alleen status updaten
      await service.from('quotes').update({
        status: 'awaiting_response',
        sent_at: new Date().toISOString(),
      }).eq('id', id);
    }

    return NextResponse.json({ success: true, quoteNumber });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// PATCH — update logo of offertenummer vanuit preview
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { userId, logoUrl, nextQuoteNumber, companyId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const service = createServiceClient();

    if (logoUrl && companyId) {
      await service.from('companies').update({ logo_url: logoUrl }).eq('id', companyId);
    }

    if (nextQuoteNumber && companyId) {
      await service.from('company_settings')
        .update({ next_quote_number: nextQuoteNumber })
        .eq('company_id', companyId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}