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

// GET — alle data voor de request detail pagina
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const service = createServiceClient();

    const { data: req } = await service
      .from('requests')
      .select('*')
      .eq('id', id)
      .single();

    if (!req) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    const [{ data: items }, { data: client }] = await Promise.all([
      service.from('request_items').select('*').eq('request_id', id).order('sort_order', { ascending: true }),
      req.client_id
        ? service.from('clients').select('name, address, email, phone').eq('id', req.client_id).single()
        : Promise.resolve({ data: null }),
    ]);

    const itemIds = (items ?? []).map((i) => i.id);
    const { data: photos } = itemIds.length > 0
      ? await service.from('request_item_photos').select('*').in('request_item_id', itemIds)
      : { data: [] };

    // Genereer signed URLs voor alle foto's (bucket is privé)
    const allPaths = (photos ?? []).map((p) => p.storage_path);
    const signedUrlMap = new Map<string, string>();

    if (allPaths.length > 0) {
      const { data: signedUrls } = await service.storage
        .from('request-photos')
        .createSignedUrls(allPaths, 3600);

      for (const entry of signedUrls ?? []) {
        if (entry.signedUrl && entry.path) {
          signedUrlMap.set(entry.path, entry.signedUrl);
        }
      }
    }

    const itemsWithPhotos = (items ?? []).map((item) => ({
      ...item,
      photos: (photos ?? [])
        .filter((p) => p.request_item_id === item.id)
        .map((p) => signedUrlMap.get(p.storage_path) ?? null)
        .filter((url): url is string => url !== null),
    }));

    return NextResponse.json({
      request: req,
      items: itemsWithPhotos,
      client,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// PATCH — update request (client koppelen, status wijzigen)
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { userId, ...updates } = body;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const service = createServiceClient();
    await service.from('requests').update(updates).eq('id', id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}