import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

type ParsedCompanyInfo = {
  name: string;
  address: {
    street: string;
    city: string;
    postal: string;
  };
  phone?: string;
  email?: string;
  kvk?: string;
  vat?: string;
  iban?: string;
  category?: 'loodgieters' | 'elektriciens' | 'cv_klimaat' | 'hoveniers' | 'schoonmaak' | 'klusbedrijf' | 'schilders' | 'dakdekkers';
};

type ParsedLineItem = {
  title: string;
  unit: 'hour' | 'piece' | 'm2' | 'meter' | 'visit' | 'day' | 'project';
  rate: number;
  item_type: 'labor' | 'transport' | 'material' | 'other';
};

type ParsedStandardText = {
  intro?: string;
  disclaimer?: string;
};

export type ParsedQuoteData = {
  company: ParsedCompanyInfo;
  lineItems: ParsedLineItem[];
  standardText: ParsedStandardText;
  quoteNumber?: string;
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString('base64');

    let mediaType: 'image/jpeg' | 'image/png' | 'application/pdf' = 'image/jpeg';
    if (file.type === 'application/pdf') {
      mediaType = 'application/pdf';
    } else if (file.type === 'image/png') {
      mediaType = 'image/png';
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY not found in environment');
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: [
              mediaType === 'application/pdf'
                ? {
                    type: 'document',
                    source: {
                      type: 'base64',
                      media_type: 'application/pdf',
                      data: base64Data,
                    },
                  }
                : {
                    type: 'image',
                    source: {
                      type: 'base64',
                      media_type: mediaType,
                      data: base64Data,
                    },
                  },
              {
                type: 'text',
                text: `Extract all information from this Dutch quote/invoice/offerte and return it as JSON.

Extract:
1. Company info (the sender, NOT the recipient):
   - name (company name)
   - address.street
   - address.city  
   - address.postal (postcode)
   - phone (optional)
   - email (optional)
   - kvk (KVK number, optional)
   - vat (BTW number, optional)
   - iban (bank account, optional)
   
   ALSO detect the industry category based on company name, services offered, and line items.
   Return category as ONE of these exact values:
   - "loodgieters" (plumbing, sanitair, loodgieterswerk, waterleiding, cv-ketel, boiler)
   - "elektriciens" (electrical, elektra, bedrading, stopcontacten, meterkast, schakelaar)
   - "cv_klimaat" (heating/cooling, verwarming, airco, klimaatbeheersing, warmtepomp, cv-installatie)
   - "hoveniers" (gardening, tuin, gazon, beplanting, tuinonderhoud, tuinaanleg, bestrating)
   - "schoonmaak" (cleaning, schoonmaken, poets, glazenwasser, bedrijfsschoonmaak)
   - "klusbedrijf" (handyman, klussen, reparaties, onderhoud, verbouwing, timmerwerk)
   - "schilders" (painting, schilderwerk, spuiten, stukadoor, behangen, latex)
   - "dakdekkers" (roofing, dakwerk, dakbedekking, goot, dakpannen, isolatie dak)
   
   If unclear, choose the BEST match based on the services described.

2. Line items (products/services offered):
   ⚠️ CRITICAL: You MUST extract EVERY SINGLE line item from the quote.
   DO NOT limit to 3 items - extract 5, 10, 20 items if they exist!
   
   For each item extract:
   - title (SHORT description - max 3-5 words, extract the main activity/product name only)
   - unit (one of: hour, piece, m2, meter, visit, day, project)
   - rate (price in euros, as number)
   - item_type (one of: labor, transport, material, other)
   
   IMPORTANT for titles:
   - Keep titles SHORT and concise (3-5 words max)
   - Extract the MAIN activity/product name only
   - Examples:
     * "Voorbereiding en werkzaamheden: Trapgat dicht zetten..." → "Voorbereiding en werkzaamheden"
     * "Materiaal: scharnieren, multiplex deurtje vlak..." → "Materiaal"
     * "Stukwerk wand twee zijde inclusief hoekspeer" → "Stukwerk wand"
     * "Schilderwerk inclusief primer en twee lagen" → "Schilderwerk"
   
   IMPORTANT for units:
   - If item is labor/work/service with hourly rate → "hour"
   - If item is materials/products sold per piece → "piece"
   - If item is surface work (floors, walls) → "m2"
   - If item is linear work (pipes, cables) → "meter"
   - If item is travel/visit costs → "visit"
   - If item is day rate → "day"
   - If item is fixed project price → "project"

   IMPORTANT for item_type — classify each item as ONE of:
   - "labor": work/service by the company itself — uurloon, arbeid, dagtarief, overwerktarief, installatiewerk, montage, reparatie, onderhoud, schoonmaakwerk, schilderwerk, stukwerk, etc.
   - "transport": all travel and transport related costs — voorrijkosten, reiskosten, parkeerkosten, transportkosten, bezorgkosten
   - "material": generic materials without a specific brand or product name — materiaalkosten, bevestigingsmateriaal, verbruiksmateriaal, etc. Do NOT use for named products.
   - "other": everything else — specific named products (plant species, brand names, model numbers), afvoerkosten, stortkosten, huurkosten materieel, onderaannemer costs, and any item that does not clearly fit labor/transport/material

   Examples:
   - "Uurloon" → labor
   - "Voorrijkosten" → transport
   - "Parkeerkosten" → transport
   - "Materiaalkosten" → material
   - "Gewone agrimonie" → other (specific plant)
   - "Mosa tegel 30x30" → other (specific product)
   - "Afvoer puin" → other
   - "Steiger huur" → other

3. Standard text:
   - intro (greeting/introduction text, optional)
   - disclaimer (terms/conditions at bottom, optional)

4. Quote number:
   - quoteNumber (the quote/invoice number shown on this document, e.g. "2025010029", "2022-0027", optional)

Return ONLY valid JSON, no markdown, no explanation:
{
  "company": {
    "name": "...",
    "address": { "street": "...", "city": "...", "postal": "..." },
    "phone": "...",
    "email": "...",
    "kvk": "...",
    "vat": "...",
    "iban": "...",
    "category": "klusbedrijf"
  },
  "lineItems": [
    { "title": "Uurloon", "unit": "hour", "rate": 65.00, "item_type": "labor" },
    { "title": "Voorrijkosten", "unit": "visit", "rate": 25.00, "item_type": "transport" },
    { "title": "Materiaalkosten", "unit": "piece", "rate": 45.00, "item_type": "material" },
    { "title": "Gewone agrimonie", "unit": "piece", "rate": 8.50, "item_type": "other" }
  ],
  "standardText": {
    "intro": "...",
    "disclaimer": "..."
  },
  "quoteNumber": "2025010029"
}`,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Claude API error:', error);
      return NextResponse.json(
        { error: `Claude API error: ${error.error?.message || 'Unknown error'}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    const textContent = data.content.find((c: any) => c.type === 'text')?.text;
    if (!textContent) {
      return NextResponse.json(
        { error: 'No text content in Claude response' },
        { status: 500 }
      );
    }

    const jsonText = textContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed: ParsedQuoteData = JSON.parse(jsonText);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Parse quote error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}