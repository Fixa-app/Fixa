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

// POST — zet een request 1-op-1 om naar een quote: elk request-item wordt een line item.
// Geen AI-matching (te onbetrouwbaar bij kleine product-bibliotheken). Alle producten van
// de pro worden los aangeboden als "suggestie chips" op de quote-items-pagina, zodat de
// pro zelf, met eigen beoordeling, een relevante prijs kan toevoegen.
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
      service.from('request_items').select('id, title, description').eq('request_id', id).order('sort_order', { ascending: true }),
      service.from('products').select('id, title, rate, unit').eq('company_id', req.company_id),
    ]);

    // Foto's per item ophalen, signed URLs genereren voor referentie tijdens prijzen invullen
    const itemIds = (items ?? []).map((i) => i.id);
    const { data: photoRows } = itemIds.length > 0
      ? await service.from('request_item_photos').select('request_item_id, storage_path').in('request_item_id', itemIds)
      : { data: [] };

    const allPaths = (photoRows ?? []).map((p) => p.storage_path);
    const signedUrlMap = new Map<string, string>();
    if (allPaths.length > 0) {
      const { data: signedUrls } = await service.storage.from('request-photos').createSignedUrls(allPaths, 3600);
      for (const entry of signedUrls ?? []) {
        if (entry.signedUrl && entry.path) signedUrlMap.set(entry.path, entry.signedUrl);
      }
    }

    const photosByItemIndex = (items ?? []).map((item) =>
      (photoRows ?? [])
        .filter((p) => p.request_item_id === item.id)
        .map((p) => signedUrlMap.get(p.storage_path))
        .filter((url): url is string => !!url)
    );

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

    // 1-op-1: elk request-item wordt direct een line item, prijs op 0, pro vult zelf in
    const lineItemRows = (items ?? []).map((item, index) => ({
      quote_id: quote.id,
      title: item.title ?? '',
      description: item.description ?? '',
      quantity: 1,
      rate: 0,
      tax_percentage: 21,
      item_type: 'other',
      sort_order: index,
    }));

    let createdLineItems: { id: string }[] = [];
    if (lineItemRows.length > 0) {
      const { data: inserted } = await service.from('line_items').insert(lineItemRows).select('id');
      createdLineItems = inserted ?? [];
    }

    // Koppel referentie-foto's aan de juiste line item id, voor weergave tijdens prijzen invullen
    const referencePhotosByLineItemId: Record<string, string[]> = {};
    createdLineItems.forEach((li, index) => {
      if (photosByItemIndex[index] && photosByItemIndex[index].length > 0) {
        referencePhotosByLineItemId[li.id] = photosByItemIndex[index];
      }
    });

    await service.from('requests').update({
      status: 'converted',
      converted_to_quote_id: quote.id,
    }).eq('id', id);

    return NextResponse.json({
      quoteId: quote.id,
      // Alle producten van de pro, als losse suggesties — geen matching, gewoon zijn hele bibliotheek
      suggestedProducts: (products ?? []).map((p) => ({
        id: p.id,
        title: p.title,
        rate: p.rate,
        unit: p.unit,
      })),
      // Referentie-foto's per line item, voor weergave tijdens prijzen invullen
      referencePhotosByLineItemId,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}