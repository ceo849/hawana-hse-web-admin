import { redirect } from "next/navigation";

import { requireAccessToken } from "@/lib/server-auth";

export default async function NewCompanyPage() {
  await requireAccessToken();

  redirect("/dashboard/companies");
}
