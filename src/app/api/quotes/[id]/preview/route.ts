import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

type Params = { params: Promise<{ id: string }> };

// GET — haal alle data op voor de quote preview
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const service = createServiceClient();

    const { data: quote } = await service
      .from('quotes')
      .select('*')
      .eq('id', id)
      .single();

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    const { data: lineItems } = await service
      .from('line_items')
      .select('*')
      .eq('quote_id', id)
      .order('sort_order', { ascending: true });

    const { data: client } = await service
      .from('clients')
      .select('name, address, email, phone')
      .eq('id', quote.client_id)
      .single();

    const { data: company } = await service
      .from('companies')
      .select('name, street, city, postal, phone, email, kvk, vat_number, iban, logo_url')
      .eq('id', quote.company_id)
      .single();

    const { data: settings } = await service
      .from('company_settings')
      .select('quote_intro, quote_disclaimer, next_quote_number, quote_number_format, last_parsed_quote_number')
      .eq('company_id', quote.company_id)
      .single();

    return NextResponse.json({
      quote,
      lineItems: lineItems ?? [],
      client,
      company,
      settings,
      companyId: quote.company_id,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// POST — verstuur offerte (wijs offertenummer toe, update status, stuur e-mail)
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const service = createServiceClient();

    // Haal quote + client + company op
    const { data: quote } = await service
      .from('quotes')
      .select('company_id, quote_number, client_id, job_title, client_token, client_token_expires_at')
      .eq('id', id)
      .single();

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    const [{ data: settings }, { data: client }, { data: company }] = await Promise.all([
      service.from('company_settings')
        .select('next_quote_number, quote_number_format')
        .eq('company_id', quote.company_id)
        .single(),
      service.from('clients')
        .select('name, email')
        .eq('id', quote.client_id)
        .single(),
      service.from('companies')
        .select('name, phone')
        .eq('id', quote.company_id)
        .single(),
    ]);

    // Genereer offertenummer als nog niet toegewezen
    let quoteNumber = quote.quote_number;
    if (!quoteNumber && settings?.next_quote_number) {
      const year = new Date().getFullYear();
      const format = settings.quote_number_format ?? '{YEAR}-{NUMBER}';
      quoteNumber = format
        .replace('{YEAR}', String(year))
        .replace('{NUMBER}', String(settings.next_quote_number).padStart(3, '0'));

      await Promise.all([
        service.from('quotes').update({
          quote_number: quoteNumber,
          status: 'awaiting_response',
          sent_at: new Date().toISOString(),
        }).eq('id', id),
        service.from('company_settings').update({
          next_quote_number: settings.next_quote_number + 1,
        }).eq('company_id', quote.company_id),
      ]);
    } else {
      await service.from('quotes').update({
        status: 'awaiting_response',
        sent_at: new Date().toISOString(),
      }).eq('id', id);
    }

    // Genereer of hergebruik hub-token
    let token = quote.client_token;
    const tokenExpired = !quote.client_token_expires_at || new Date(quote.client_token_expires_at) < new Date();
    if (!token || tokenExpired) {
      const { data: tokenData } = await service
        .from('quotes')
        .select('client_token')
        .eq('id', id)
        .single();

      // Genereer nieuw token via de token-route logica
      const newToken = Buffer.from(`${id}-${Date.now()}`).toString('base64url').slice(0, 32);
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

      await service.from('quotes').update({
        client_token: newToken,
        client_token_expires_at: expiresAt,
      }).eq('id', id);

      token = newToken;
    }

    // Stuur e-mail naar klant als e-mailadres bekend is
    const hubBaseUrl = process.env.NEXT_PUBLIC_HUB_URL ?? 'https://hub.hifixa.com';
    const hubUrl = `${hubBaseUrl}/${token}`;

    if (client?.email && process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const from = process.env.RESEND_FROM ?? 'Fixa <automated@hifixa.com>';

      await resend.emails.send({
        from,
        to: client.email,
        subject: `Offerte van ${company?.name ?? 'uw aannemer'}${quote.job_title ? `: ${quote.job_title}` : ''}`,
        html: `
          <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #111;">
            <p>Beste ${client.name},</p>
            <p>${company?.name ?? 'Uw aannemer'} heeft een offerte voor u klaarstaan${quote.job_title ? ` voor <strong>${quote.job_title}</strong>` : ''}.</p>
            <p>Bekijk de offerte via onderstaande knop. U kunt de offerte direct accepteren of een vraag stellen.</p>
            <p style="margin: 32px 0;">
              <a href="${hubUrl}"
                style="background: #111; color: #fff; padding: 14px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
                Offerte bekijken
              </a>
            </p>
            <p style="color: #666; font-size: 14px;">Of kopieer deze link: <a href="${hubUrl}" style="color: #666;">${hubUrl}</a></p>
            ${company?.phone ? `<p style="color: #666; font-size: 14px;">Vragen? Bel ons op ${company.phone}</p>` : ''}
            <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
            <p style="color: #aaa; font-size: 12px;">Deze e-mail is verstuurd via Fixa.</p>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true, quoteNumber, hubUrl });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// PATCH — update logo of offertenummer vanuit preview
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { userId, logoUrl, nextQuoteNumber, companyId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const service = createServiceClient();

    if (logoUrl && companyId) {
      await service.from('companies').update({ logo_url: logoUrl }).eq('id', companyId);
    }

    if (nextQuoteNumber && companyId) {
      await service.from('company_settings')
        .update({ next_quote_number: nextQuoteNumber })
        .eq('company_id', companyId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}