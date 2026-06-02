import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Check if user already has a company
      const { data: { user } } = await supabase.auth.getUser();

      const { data: membership } = await supabase
        .from('company_members')
        .select('company_id')
        .eq('user_id', user?.id)
        .single();

      if (membership) {
        // Has company → go to dashboard
        return NextResponse.redirect(`${origin}/dashboard`);
      } else {
        // No company → start onboarding
        return NextResponse.redirect(`${origin}/onboarding/upload`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/?auth_error=1`);
}