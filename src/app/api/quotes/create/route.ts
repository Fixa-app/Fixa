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

    // Start met één leeg line item
    await service.from('line_items').insert({
      quote_id: quote.id,
      title: null,
      description: '',
      quantity: 1,
      rate: 0,
      tax_percentage: 21,
      item_type: 'other',
      sort_order: 0,
    });

    return NextResponse.json({ quote });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}