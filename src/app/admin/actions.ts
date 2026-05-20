"use server";

import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth/admin";
import { sendEmail } from "@/lib/email/send";
import TestEmail from "@/emails/test-email";

export async function sendTestEmail() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!(await isAdmin(user))) {
    throw new Error("Not authorized");
  }
  if (!user!.email) {
    throw new Error("Your user has no email on file");
  }

  await sendEmail({
    to: user!.email,
    subject: "Test email from Fixa",
    react: TestEmail({ recipientEmail: user!.email }),
  });
}
