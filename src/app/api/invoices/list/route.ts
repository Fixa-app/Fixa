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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const companyId = searchParams.get('companyId');

    if (!userId || !companyId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const service = createServiceClient();

    const { data: invoices } = await service
      .from('invoices')
      .select('id, invoice_number, status, due_date, updated_at, client_id')
      .eq('company_id', companyId)
      .neq('status', 'archived')
      .order('updated_at', { ascending: false });

    if (!invoices || invoices.length === 0) return NextResponse.json({ invoices: [] });

    const clientIds = [...new Set(invoices.map((i) => i.client_id).filter(Boolean))];
    const { data: clients } = clientIds.length > 0
      ? await service.from('clients').select('id, name').in('id', clientIds)
      : { data: [] };

    const clientMap = new Map((clients ?? []).map((c) => [c.id, c.name]));

    // Bereken totaal per factuur
    const invoiceIds = invoices.map((i) => i.id);
    const { data: allItems } = await service
      .from('invoice_line_items')
      .select('invoice_id, quantity, rate, tax_percentage')
      .in('invoice_id', invoiceIds);

    const totalMap = new Map<string, number>();
    for (const item of allItems ?? []) {
      const subtotal = item.quantity * item.rate;
      const tax = subtotal * (item.tax_percentage / 100);
      totalMap.set(item.invoice_id, (totalMap.get(item.invoice_id) ?? 0) + subtotal + tax);
    }

    return NextResponse.json({
      invoices: invoices.map((inv) => ({
        id: inv.id,
        invoice_number: inv.invoice_number,
        client_name: clientMap.get(inv.client_id) ?? "Onbekende klant",
        status: inv.status,
        due_date: inv.due_date,
        updated_at: inv.updated_at,
        total_amount: totalMap.get(inv.id) ?? 0,
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}