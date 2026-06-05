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

export async function POST(request: NextRequest) {
  try {
    const { clientId, userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const service = createServiceClient();

    // Get company
    const { data: membership } = await service
      .from('company_members')
      .select('company_id')
      .eq('user_id', userId)
      .single();

    if (!membership) {
      return NextResponse.json({ error: 'No company found' }, { status: 404 });
    }

    // Create draft quote
    const { data: quote, error: quoteError } = await service
      .from('quotes')
      .insert({
        company_id: membership.company_id,
        client_id: clientId,
        created_by_user_id: userId,
        status: 'draft',
      })
      .select()
      .single();

    if (quoteError || !quote) {
      return NextResponse.json({ error: quoteError?.message }, { status: 500 });
    }

    // Fetch generic products (labor, transport, material)
    const { data: products } = await service
      .from('products')
      .select('*')
      .eq('company_id', membership.company_id)
      .in('item_type', ['labor', 'transport', 'material'])
      .order('created_at', { ascending: true });

    // Pre-fill line items from generic products
    if (products && products.length > 0) {
      const lineItems = products.map((product, index) => ({
        quote_id: quote.id,
        title: product.title,
        description: '',
        quantity: 1,
        rate: product.rate,
        tax_percentage: 21,
        item_type: product.item_type,
        sort_order: index,
      }));

      await service.from('line_items').insert(lineItems);
    }

    return NextResponse.json({ quote });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}