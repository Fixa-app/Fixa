import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'crypto';

export const dynamic = 'force-dynamic';

function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

type Params = { params: Promise<{ id: string }> };

// POST — genereer (of geef bestaand) client hub token terug voor deze offerte.
// Token is 30 dagen geldig vanaf het moment van genereren/verversen.
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const service = createServiceClient();

    const { data: quote } = await service
      .from('quotes')
      .select('client_token, client_token_expires_at')
      .eq('id', id)
      .single();

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    const now = new Date();
    const isExpired = !quote.client_token_expires_at || new Date(quote.client_token_expires_at) < now;

    // Bestaand, nog geldig token gewoon teruggeven — niet onnodig verversen
    if (quote.client_token && !isExpired) {
      return NextResponse.json({ token: quote.client_token });
    }

    // Nieuw token genereren (32 bytes, URL-safe)
    const token = randomBytes(24).toString('base64url');
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

    await service.from('quotes').update({
      client_token: token,
      client_token_expires_at: expiresAt,
    }).eq('id', id);

    return NextResponse.json({ token });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}