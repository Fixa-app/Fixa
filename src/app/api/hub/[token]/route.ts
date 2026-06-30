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

type Params = { params: Promise<{ token: string }> };

// GET — publieke toegang tot een offerte via token, geen authenticatie nodig.
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { token } = await params;

    const service = createServiceClient();

    const { data: quote } = await service
      .from('quotes')
      .select('*')
      .eq('client_token', token)
      .single();

    if (!quote) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (!quote.client_token_expires_at || new Date(quote.client_token_expires_at) < new Date()) {
      return NextResponse.json({ error: 'expired' }, { status: 410 });
    }

    const [
      { data: lineItems },
      { data: client },
      { data: company },
    ] = await Promise.all([
      service.from('line_items').select('*').eq('quote_id', quote.id).order('sort_order', { ascending: true }),
      service.from('clients').select('name, address, phone').eq('id', quote.client_id).single(),
      service.from('companies').select('name, street, city, postal, phone, email, kvk, vat_number, iban, logo_url').eq('id', quote.company_id).single(),
    ]);

    return NextResponse.json({
      quote: {
        id: quote.id,
        job_title: quote.job_title,
        intro_text: quote.intro_text,
        disclaimer: quote.disclaimer,
        quote_number: quote.quote_number,
        status: quote.status,
        approved_at: quote.approved_at,
      },
      lineItems: lineItems ?? [],
      client,
      company,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// POST — klant-actie: accepteren of wijziging aanvragen
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { token } = await params;
    const { action, message } = await request.json();

    if (!['accept', 'request_changes'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const service = createServiceClient();

    const { data: quote } = await service
      .from('quotes')
      .select('id, client_token_expires_at')
      .eq('client_token', token)
      .single();

    if (!quote) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (!quote.client_token_expires_at || new Date(quote.client_token_expires_at) < new Date()) {
      return NextResponse.json({ error: 'expired' }, { status: 410 });
    }

    if (action === 'accept') {
      await service.from('quotes').update({
        status: 'ready_to_schedule',
        approved_at: new Date().toISOString(),
      }).eq('id', quote.id);
    } else {
      if (!message || !message.trim()) {
        return NextResponse.json({ error: 'Message is required' }, { status: 400 });
      }
      await Promise.all([
        service.from('quotes').update({ status: 'changes_requested' }).eq('id', quote.id),
        service.from('quote_change_requests').insert({ quote_id: quote.id, message: message.trim() }),
      ]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}