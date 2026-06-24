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

// POST — maak een nieuwe request aan met items (en optioneel foto's), nog zonder klant
export async function POST(request: NextRequest) {
  try {
    const { userId, items } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'At least one item is required' }, { status: 400 });
    }

    const service = createServiceClient();

    // Haal company_id op via company_members
    const { data: membership } = await service
      .from('company_members')
      .select('company_id')
      .eq('user_id', userId)
      .single();

    if (!membership) {
      return NextResponse.json({ error: 'No company found' }, { status: 404 });
    }

    // Maak de request aan (client_id is nog null)
    const { data: newRequest, error: requestError } = await service
      .from('requests')
      .insert({
        company_id: membership.company_id,
        created_by_user_id: userId,
        status: 'created',
      })
      .select()
      .single();

    if (requestError || !newRequest) {
      return NextResponse.json({ error: requestError?.message ?? 'Failed to create request' }, { status: 500 });
    }

    // Maak de request_items aan
    const itemRows = items.map((item: { title: string; description?: string }, index: number) => ({
      request_id: newRequest.id,
      title: item.title,
      description: item.description ?? null,
      sort_order: index,
    }));

    const { data: createdItems, error: itemsError } = await service
      .from('request_items')
      .insert(itemRows)
      .select();

    if (itemsError || !createdItems) {
      return NextResponse.json({ error: itemsError?.message ?? 'Failed to create items' }, { status: 500 });
    }

    // Koppel foto's aan de juiste items (op basis van volgorde)
    const photoRows: { request_item_id: string; storage_path: string }[] = [];
    items.forEach((item: { photos?: string[] }, index: number) => {
      const createdItem = createdItems[index];
      if (item.photos && createdItem) {
        for (const photoPath of item.photos) {
          photoRows.push({ request_item_id: createdItem.id, storage_path: photoPath });
        }
      }
    });

    if (photoRows.length > 0) {
      await service.from('request_item_photos').insert(photoRows);
    }

    return NextResponse.json({ request: newRequest });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}