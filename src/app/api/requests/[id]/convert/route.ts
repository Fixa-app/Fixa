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

type MatchResult = {
  request_item_index: number;
  matched_title: string;
  matched_rate: number | null;
  matched_unit: string | null;
};

async function matchItemsAgainstProducts(
  requestItems: { title: string | null; description: string | null }[],
  products: { title: string; rate: number; unit: string }[]
): Promise<MatchResult[]> {
  // Geen producten om tegen te matchen — geef alles terug zonder prijs
  if (products.length === 0) {
    return requestItems.map((item, i) => ({
      request_item_index: i,
      matched_title: item.title ?? "",
      matched_rate: null,
      matched_unit: null,
    }));
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1500,
        messages: [{
          role: 'user',
          content: `Je krijgt een lijst van aanvraag-items (problemen die een klant heeft gemeld) en een lijst van eerder gebruikte producten/diensten met hun prijzen.

Voor elk aanvraag-item: zoek het best passende product op basis van titel-overeenkomst (synoniemen en gelijkaardige klussen meetellen, bijv. "lekkende kraan" matcht met "kraan repareren"). Als er geen redelijke match is, geef matched_rate en matched_unit als null en gebruik de oorspronkelijke titel van het aanvraag-item als matched_title.

Aanvraag-items:
${requestItems.map((item, i) => `${i}. ${item.title ?? ''}${item.description ? ' - ' + item.description : ''}`).join('\n')}

Eerder gebruikte producten:
${products.map((p) => `- ${p.title} (€${p.rate}/${p.unit})`).join('\n')}

Antwoord ALLEEN met een JSON array, geen andere tekst, in dit exacte formaat:
[{"request_item_index": 0, "matched_title": "...", "matched_rate": 45.00, "matched_unit": "hour"}, ...]`,
        }],
      }),
    });

    const data = await response.json();
    const text = data.content?.[0]?.text ?? '[]';
    const cleaned = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('AI matching failed, falling back to titles only:', error);
    return requestItems.map((item, i) => ({
      request_item_index: i,
      matched_title: item.title ?? "",
      matched_rate: null,
      matched_unit: null,
    }));
  }
}

// POST — zet een request om naar een quote, met AI-matching tegen eerdere producten
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const service = createServiceClient();

    const { data: req } = await service
      .from('requests')
      .select('*')
      .eq('id', id)
      .single();

    if (!req || !req.client_id) {
      return NextResponse.json({ error: 'Request not found or no client linked' }, { status: 400 });
    }

    const [{ data: items }, { data: products }] = await Promise.all([
      service.from('request_items').select('title, description').eq('request_id', id).order('sort_order', { ascending: true }),
      service.from('products').select('title, rate, unit').eq('company_id', req.company_id),
    ]);

    const matches = await matchItemsAgainstProducts(items ?? [], products ?? []);

    // Maak de quote aan
    const { data: quote, error: quoteError } = await service
      .from('quotes')
      .insert({
        company_id: req.company_id,
        client_id: req.client_id,
        created_by_user_id: userId,
        status: 'draft',
      })
      .select()
      .single();

    if (quoteError || !quote) {
      return NextResponse.json({ error: quoteError?.message ?? 'Failed to create quote' }, { status: 500 });
    }

    // Maak line items aan op basis van de matches
    const lineItemRows = matches.map((match, index) => ({
      quote_id: quote.id,
      title: match.matched_title,
      description: '',
      quantity: 1,
      rate: match.matched_rate ?? 0,
      tax_percentage: 21,
      item_type: 'other',
      sort_order: index,
    }));

    if (lineItemRows.length > 0) {
      await service.from('line_items').insert(lineItemRows);
    }

    // Markeer request als omgezet
    await service.from('requests').update({
      status: 'converted',
      converted_to_quote_id: quote.id,
    }).eq('id', id);

    return NextResponse.json({ quoteId: quote.id });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}