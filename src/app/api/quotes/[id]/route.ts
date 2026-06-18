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

type Params = { params: Promise<{ id: string }> };

// GET — alle data voor de quote detail pagina
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const service = createServiceClient();

    const { data: quote } = await service
      .from('quotes')
      .select('*')
      .eq('id', id)
      .single();

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    const [
      { data: lineItems },
      { data: client },
      { data: company },
    ] = await Promise.all([
      service.from('line_items').select('*').eq('quote_id', id).order('sort_order', { ascending: true }),
      service.from('clients').select('name, address, email, phone').eq('id', quote.client_id).single(),
      service.from('companies').select('name, street, city, postal, phone, email, kvk, vat_number, iban, logo_url').eq('id', quote.company_id).single(),
    ]);

    return NextResponse.json({
      quote,
      lineItems: lineItems ?? [],
      client,
      company,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// PATCH — status wijzigen of archiveren
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { userId, status } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const validStatuses = ['draft', 'awaiting_response', 'changes_requested', 'ready_to_schedule', 'declined', 'archived'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const service = createServiceClient();

    const updates: Record<string, unknown> = { status };
    if (status === 'ready_to_schedule') {
      updates.approved_at = new Date().toISOString();
    }

    await service.from('quotes').update(updates).eq('id', id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}