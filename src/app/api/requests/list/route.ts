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

// GET — alle aanvragen voor het actieve bedrijf, met klantnaam
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const companyId = searchParams.get('companyId');

    if (!userId || !companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const service = createServiceClient();

    const { data: requests } = await service
      .from('requests')
      .select('id, status, updated_at, client_id')
      .eq('company_id', companyId)
      .neq('status', 'archived')
      .order('updated_at', { ascending: false });

    if (!requests || requests.length === 0) {
      return NextResponse.json({ requests: [] });
    }

    const clientIds = [...new Set(requests.map((r) => r.client_id).filter(Boolean))];
    const { data: clients } = clientIds.length > 0
      ? await service.from('clients').select('id, name').in('id', clientIds)
      : { data: [] };

    const clientMap = new Map((clients ?? []).map((c) => [c.id, c.name]));

    const enriched = requests.map((r) => ({
      id: r.id,
      client_name: r.client_id ? (clientMap.get(r.client_id) ?? "Onbekende klant") : "Geen klant",
      status: r.status,
      updated_at: r.updated_at,
    }));

    return NextResponse.json({ requests: enriched });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}