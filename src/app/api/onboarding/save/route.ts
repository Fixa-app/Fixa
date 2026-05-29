import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Service role client - bypasses RLS completely
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
    const supabase = createServiceClient();
    const body = await request.json();
    const { company, lineItems, standardText, userId } = body;

    if (!company || !userId) {
      return NextResponse.json(
        { error: 'Missing required data' },
        { status: 400 }
      );
    }

    // 1. Create company
    const { data: newCompany, error: companyError } = await supabase
      .from('companies')
      .insert({
        name: company.name,
        street: company.address?.street,
        city: company.address?.city,
        postal: company.address?.postal,
        phone: company.phone || null,
        email: company.email || null,
        kvk: company.kvk || null,
        vat_number: company.vat || null,
        iban: company.iban || null,
        category: company.category || null,
      })
      .select()
      .single();

    if (companyError) {
      console.error('Company error:', companyError);
      return NextResponse.json(
        { error: `Failed to create company: ${companyError.message}` },
        { status: 500 }
      );
    }

    const companyId = newCompany.id;

    // 2. Link user to company as owner
    const { error: memberError } = await supabase
      .from('company_members')
      .insert({
        company_id: companyId,
        user_id: userId,
        role: 'owner',
      });

    if (memberError) {
      console.error('Member error:', memberError);
      return NextResponse.json(
        { error: `Failed to add member: ${memberError.message}` },
        { status: 500 }
      );
    }

    // 3. Create company settings
    if (standardText?.intro || standardText?.disclaimer) {
      const { error: settingsError } = await supabase
        .from('company_settings')
        .insert({
          company_id: companyId,
          quote_intro: standardText.intro || null,
          quote_disclaimer: standardText.disclaimer || null,
        });

      if (settingsError) {
        console.error('Settings error:', settingsError);
        // Non-fatal
      }
    }

    // 4. Create products
    if (lineItems && lineItems.length > 0) {
      const products = lineItems.map((item: any) => ({
        company_id: companyId,
        title: item.title,
        unit: item.unit,
        rate: item.rate,
      }));

      const { error: productsError } = await supabase
        .from('products')
        .insert(products);

      if (productsError) {
        console.error('Products error:', productsError);
        return NextResponse.json(
          { error: `Failed to create products: ${productsError.message}` },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true, companyId });
  } catch (error) {
    console.error('Save onboarding error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}