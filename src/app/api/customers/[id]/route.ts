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

// GET — klantgegevens + historie (requests en quotes die bij deze klant horen)
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const service = createServiceClient();

    const { data: client } = await service
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    const [{ data: requests }, { data: quotes }] = await Promise.all([
      service.from('requests').select('id, status, updated_at').eq('client_id', id).order('updated_at', { ascending: false }),
      service.from('quotes').select('id, status, job_title, updated_at').eq('client_id', id).order('updated_at', { ascending: false }),
    ]);

    return NextResponse.json({
      client,
      requests: requests ?? [],
      quotes: quotes ?? [],
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}