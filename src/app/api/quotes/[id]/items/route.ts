import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

type Params = { params: Promise<{ id: string }> };

// GET — haal alle line items op voor een quote
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const service = createServiceClient();

    // Verify user has access to this quote
    const { data: quote } = await service
      .from('quotes')
      .select('id, company_id, client_id, job_title, intro_text, disclaimer')
      .eq('id', id)
      .single();

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    // Get line items
    const { data: lineItems } = await service
      .from('line_items')
      .select('*')
      .eq('quote_id', id)
      .order('sort_order', { ascending: true });

    // Get company settings for intro/disclaimer defaults
    const { data: settings } = await service
      .from('company_settings')
      .select('quote_intro, quote_disclaimer')
      .eq('company_id', quote.company_id)
      .single();

    // Get client name
    const { data: client } = await service
      .from('clients')
      .select('name')
      .eq('id', quote.client_id)
      .single();

    return NextResponse.json({
      quote,
      lineItems: lineItems ?? [],
      defaults: {
        intro: settings?.quote_intro ?? '',
        disclaimer: settings?.quote_disclaimer ?? '',
      },
      clientName: client?.name ?? '',
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// POST — voeg een line item toe
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { userId, ...item } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const service = createServiceClient();

    // Get current max sort_order
    const { data: existing } = await service
      .from('line_items')
      .select('sort_order')
      .eq('quote_id', id)
      .order('sort_order', { ascending: false })
      .limit(1);

    const nextOrder = existing && existing.length > 0 ? existing[0].sort_order + 1 : 0;

    const { data: lineItem, error } = await service
      .from('line_items')
      .insert({
        quote_id: id,
        title: item.title ?? '',
        description: item.description ?? '',
        quantity: item.quantity ?? 1,
        rate: item.rate ?? 0,
        tax_percentage: item.tax_percentage ?? 21,
        item_type: item.item_type ?? 'other',
        margin_percentage: item.margin_percentage ?? null,
        margin_amount: item.margin_amount ?? null,
        sort_order: nextOrder,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ lineItem });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// PATCH — update een line item
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { userId, itemId, ...updates } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const service = createServiceClient();

    const { error } = await service
      .from('line_items')
      .update(updates)
      .eq('id', itemId)
      .eq('quote_id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// DELETE — verwijder een line item
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const itemId = searchParams.get('itemId');

    if (!userId || !itemId) {
      return NextResponse.json({ error: 'Missing params' }, { status: 400 });
    }

    const service = createServiceClient();

    const { error } = await service
      .from('line_items')
      .delete()
      .eq('id', itemId)
      .eq('quote_id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}