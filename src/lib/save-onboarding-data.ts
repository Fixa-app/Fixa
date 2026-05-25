// Supabase save function for onboarding completion
// Add this to src/app/onboarding/preview/page.tsx

import { createClient } from '@/lib/supabase/client';

export async function saveOnboardingData() {
  const supabase = createClient();
  
  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('Not authenticated');
  }

  // Load data from sessionStorage
  const companyData = sessionStorage.getItem('onboarding_company');
  const lineItemsData = sessionStorage.getItem('onboarding_lineItems');
  const standardTextData = sessionStorage.getItem('onboarding_standardText');

  if (!companyData) {
    throw new Error('No company data found');
  }

  const company = JSON.parse(companyData);
  const lineItems = lineItemsData ? JSON.parse(lineItemsData) : [];
  const standardText = standardTextData ? JSON.parse(standardTextData) : {};

  // 1. Create company
  const { data: newCompany, error: companyError } = await supabase
    .from('companies')
    .insert({
      name: company.name,
      street: company.address?.street,
      city: company.address?.city,
      postal: company.address?.postal,
      phone: company.phone,
      email: company.email,
      kvk: company.kvk,
      vat_number: company.vat, // Maps to vat_number column
      iban: company.iban,
      category: company.category, // AI-detected category
    })
    .select()
    .single();

  if (companyError) {
    console.error('Company creation error:', companyError);
    throw new Error(`Failed to create company: ${companyError.message}`);
  }

  const companyId = newCompany.id;

  // 2. Link user to company as owner
  const { error: memberError } = await supabase
    .from('company_members')
    .insert({
      company_id: companyId,
      user_id: user.id,
      role: 'owner',
    });

  if (memberError) {
    console.error('Company member error:', memberError);
    throw new Error(`Failed to add user as company owner: ${memberError.message}`);
  }

  // 3. Create company settings (quote templates)
  const { error: settingsError } = await supabase
    .from('company_settings')
    .insert({
      company_id: companyId,
      quote_intro: standardText.intro || null,
      quote_disclaimer: standardText.disclaimer || null,
    });

  if (settingsError) {
    console.error('Settings creation error:', settingsError);
    // Non-fatal - continue even if settings fail
  }

  // 4. Create products/services
  if (lineItems.length > 0) {
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
      console.error('Products creation error:', productsError);
      throw new Error(`Failed to create products: ${productsError.message}`);
    }
  }

  // 5. Clear sessionStorage after successful save
  sessionStorage.removeItem('onboarding_company');
  sessionStorage.removeItem('onboarding_lineItems');
  sessionStorage.removeItem('onboarding_standardText');
  sessionStorage.removeItem('onboarding_filename');

  return { companyId, success: true };
}