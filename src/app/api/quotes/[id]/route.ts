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

// PATCH — generieke veld-update (job_title, intro_text, disclaimer, client_id, etc.)
// EN status-wijziging (met automatische approved_at bij ready_to_schedule).
// Beide gebruiken dezelfde route: alles behalve userId wordt als update doorgegeven.
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { userId, ...updates } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    // Extra validatie + side-effect alleen als er een status wordt meegestuurd
    if ('status' in updates) {
      const validStatuses = ['draft', 'awaiting_response', 'changes_requested', 'ready_to_schedule', 'declined', 'archived'];
      if (!validStatuses.includes(updates.status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }
      if (updates.status === 'ready_to_schedule') {
        updates.approved_at = new Date().toISOString();
      }
    }

    const service = createServiceClient();
    await service.from('quotes').update(updates).eq('id', id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// DELETE — concept hard verwijderen
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const service = createServiceClient();
    await service.from('quotes').delete().eq('id', id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}