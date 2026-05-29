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

  // Call server-side API route (uses service role - bypasses RLS)
  const response = await fetch('/api/onboarding/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      company,
      lineItems,
      standardText,
      userId: user.id,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to save onboarding data');
  }

  const result = await response.json();

  // Clear sessionStorage after successful save
  sessionStorage.removeItem('onboarding_company');
  sessionStorage.removeItem('onboarding_lineItems');
  sessionStorage.removeItem('onboarding_standardText');
  sessionStorage.removeItem('onboarding_filename');

  return result;
}