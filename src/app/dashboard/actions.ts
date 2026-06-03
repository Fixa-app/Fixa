"use server";

import { cookies } from "next/headers";

// Remember which company the user is currently viewing. Read back by the
// dashboard layout to drive the active company name/role and (later) data scope.
export async function setActiveCompany(companyId: string) {
  const store = await cookies();
  store.set("active_company_id", companyId, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });
}
