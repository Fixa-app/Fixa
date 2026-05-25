/**
 * AI Parsing Utility - Extract quote/invoice data using Claude Vision
 * 
 * Extracts:
 * - Company info (name, address, contact, KVK, VAT, IBAN)
 * - Line items (title, unit, rate)
 * - Standard text (intro, disclaimer)
 */

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

/**
 * Parse quote/invoice using our server-side API route
 */
export async function parseQuoteWithAI(file: File): Promise<ParsedQuoteData> {
  try {
    // Create FormData
    const formData = new FormData();
    formData.append('file', file);

    // Call our API route (server-side)
    const response = await fetch('/api/parse-quote', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to parse quote');
    }

    const parsed: ParsedQuoteData = await response.json();
    return parsed;
  } catch (error) {
    console.error('AI parsing error:', error);
    throw error;
  }
}