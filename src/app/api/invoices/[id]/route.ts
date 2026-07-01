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

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const service = createServiceClient();

    const { data: invoice } = await service.from('invoices').select('*').eq('id', id).single();
    if (!invoice) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const [{ data: lineItems }, { data: client }, { data: company }] = await Promise.all([
      service.from('invoice_line_items').select('*').eq('invoice_id', id).order('sort_order', { ascending: true }),
      service.from('clients').select('name, address, email, phone').eq('id', invoice.client_id).single(),
      service.from('companies').select('name, street, city, postal, phone, email, kvk, vat_number, iban, logo_url').eq('id', invoice.company_id).single(),
    ]);

    return NextResponse.json({ invoice, lineItems: lineItems ?? [], client, company });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { userId, ...updates } = await request.json();

    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const service = createServiceClient();
    await service.from('invoices').update(updates).eq('id', id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}