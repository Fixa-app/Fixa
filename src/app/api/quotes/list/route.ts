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

// GET — alle offertes voor het actieve bedrijf, met klantnaam en totaalbedrag
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const companyId = searchParams.get('companyId');

    if (!userId || !companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const service = createServiceClient();

    const { data: quotes } = await service
      .from('quotes')
      .select('id, status, updated_at, client_id')
      .eq('company_id', companyId)
      .neq('status', 'archived')
      .order('updated_at', { ascending: false });

    if (!quotes || quotes.length === 0) {
      return NextResponse.json({ quotes: [] });
    }

    const clientIds = [...new Set(quotes.map((q) => q.client_id))];
    const quoteIds = quotes.map((q) => q.id);

    const [{ data: clients }, { data: lineItems }] = await Promise.all([
      service.from('clients').select('id, name').in('id', clientIds),
      service.from('line_items').select('quote_id, quantity, rate').in('quote_id', quoteIds),
    ]);

    const clientMap = new Map((clients ?? []).map((c) => [c.id, c.name]));
    const totalsMap = new Map<string, number>();
    for (const item of lineItems ?? []) {
      const current = totalsMap.get(item.quote_id) ?? 0;
      totalsMap.set(item.quote_id, current + item.quantity * item.rate);
    }

    const enriched = quotes.map((q) => ({
      id: q.id,
      client_name: clientMap.get(q.client_id) ?? "Onbekende klant",
      status: q.status,
      total_amount: totalsMap.get(q.id) ?? 0,
      updated_at: q.updated_at,
    }));

    return NextResponse.json({ quotes: enriched });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}