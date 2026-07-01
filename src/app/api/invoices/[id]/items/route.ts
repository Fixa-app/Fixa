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

// POST — voeg een lege regel toe
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { userId } = await request.json();

    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const service = createServiceClient();

    const { data: existing } = await service
      .from('invoice_line_items')
      .select('sort_order')
      .eq('invoice_id', id)
      .order('sort_order', { ascending: false })
      .limit(1);

    const nextOrder = existing && existing.length > 0 ? existing[0].sort_order + 1 : 0;

    const { data: lineItem } = await service
      .from('invoice_line_items')
      .insert({ invoice_id: id, title: '', description: '', quantity: 1, rate: 0, tax_percentage: 21, sort_order: nextOrder })
      .select()
      .single();

    return NextResponse.json({ lineItem });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// PATCH — update een bestaande regel
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { userId, itemId, ...updates } = await request.json();

    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const service = createServiceClient();
    await service.from('invoice_line_items').update(updates).eq('id', itemId).eq('invoice_id', id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// DELETE — verwijder een regel
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { userId, itemId } = await request.json();

    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const service = createServiceClient();
    await service.from('invoice_line_items').delete().eq('id', itemId).eq('invoice_id', id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}