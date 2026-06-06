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

type Params = { params: Promise<{ id: string }> };

// GET — haal foto's op voor een quote (optioneel gefilterd op line_item_id)
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const lineItemId = searchParams.get('lineItemId');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const service = createServiceClient();

    let query = service
      .from('quote_photos')
      .select('*')
      .eq('quote_id', id)
      .order('sort_order', { ascending: true });

    if (lineItemId) {
      query = query.eq('line_item_id', lineItemId);
    }

    const { data: photos } = await query;

    if (!photos || photos.length === 0) {
      return NextResponse.json({ photos: [] });
    }

    // Generate signed URLs for each photo
    const photosWithUrls = await Promise.all(
      photos.map(async (photo) => {
        const { data } = await service.storage
          .from('quote-photos')
          .createSignedUrl(photo.storage_path, 3600); // 1 hour
        return {
          ...photo,
          url: data?.signedUrl ?? null,
        };
      })
    );

    return NextResponse.json({ photos: photosWithUrls });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// POST — sla foto referentie op na upload naar Storage
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { userId, storagePath, lineItemId, sortOrder } = await request.json();

    if (!userId || !storagePath) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const service = createServiceClient();

    const { data: photo, error } = await service
      .from('quote_photos')
      .insert({
        quote_id: id,
        storage_path: storagePath,
        line_item_id: lineItemId ?? null,
        sort_order: sortOrder ?? 0,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Return signed URL
    const { data: urlData } = await service.storage
      .from('quote-photos')
      .createSignedUrl(storagePath, 3600);

    return NextResponse.json({
      photo: {
        ...photo,
        url: urlData?.signedUrl ?? null,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// DELETE — verwijder foto
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const photoId = searchParams.get('photoId');
    const storagePath = searchParams.get('storagePath');

    if (!userId || !photoId || !storagePath) {
      return NextResponse.json({ error: 'Missing params' }, { status: 400 });
    }

    const service = createServiceClient();

    // Verwijder uit Storage
    await service.storage.from('quote-photos').remove([storagePath]);

    // Verwijder uit DB
    await service.from('quote_photos').delete().eq('id', photoId).eq('quote_id', id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}