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
};

type ParsedLineItem = {
  title: string;
  unit: 'hour' | 'piece' | 'm2' | 'meter' | 'visit' | 'day' | 'project';
  rate: number;
};

type ParsedStandardText = {
  intro?: string;
  disclaimer?: string;
};

export type ParsedQuoteData = {
  company: ParsedCompanyInfo;
  lineItems: ParsedLineItem[];
  standardText: ParsedStandardText;
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

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString('base64');

    // Determine media type
    let mediaType: 'image/jpeg' | 'image/png' | 'application/pdf' = 'image/jpeg';
    if (file.type === 'application/pdf') {
      mediaType = 'application/pdf';
    } else if (file.type === 'image/png') {
      mediaType = 'image/png';
    }

    // Get API key from environment
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY not found in environment');
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    // Call Claude Vision API
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
              // Use document type for PDFs, image type for images
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

2. Line items (products/services offered):
   ⚠️ CRITICAL: You MUST extract EVERY SINGLE line item from the quote.
   DO NOT limit to 3 items - extract 5, 10, 20 items if they exist!
   Count the items in the document and include them ALL.
   
   For each item extract:
   - title (SHORT description - max 3-5 words, extract the main activity/product name only)
   - unit (one of: hour, piece, m2, meter, visit, day, project)
   - rate (price in euros, as number)
   
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

3. Standard text:
   - intro (greeting/introduction text, optional)
   - disclaimer (terms/conditions at bottom, optional)

Return ONLY valid JSON, no markdown, no explanation:
{
  "company": {
    "name": "...",
    "address": { "street": "...", "city": "...", "postal": "..." },
    "phone": "...",
    "email": "...",
    "kvk": "...",
    "vat": "...",
    "iban": "..."
  },
  "lineItems": [
    { "title": "...", "unit": "hour", "rate": 65.00 },
    { "title": "...", "unit": "project", "rate": 1250.00 },
    { "title": "...", "unit": "m2", "rate": 45.00 }
  ],
  "standardText": {
    "intro": "...",
    "disclaimer": "..."
  }
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
    
    // Extract JSON from response
    const textContent = data.content.find((c: any) => c.type === 'text')?.text;
    if (!textContent) {
      return NextResponse.json(
        { error: 'No text content in Claude response' },
        { status: 500 }
      );
    }

    // Parse JSON (remove markdown fences if present)
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