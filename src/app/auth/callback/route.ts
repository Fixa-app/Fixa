import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();

      // Use service role to bypass RLS for company check
      const serviceSupabase = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const { data: membership } = await serviceSupabase
        .from('company_members')
        .select('company_id')
        .eq('user_id', user?.id)
        .single();

      if (membership) {
        return NextResponse.redirect(`${origin}/dashboard`);
      } else {
        return NextResponse.redirect(`${origin}/onboarding/upload?uid=${user?.id}&has_key=${!!process.env.SUPABASE_SERVICE_ROLE_KEY}&membership=${JSON.stringify(membership)}`);
      }
    }
  }

return NextResponse.redirect(`${origin}/onboarding/upload`);
}