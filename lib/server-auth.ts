import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function requireAccessToken(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value ?? null;

  if (!token) redirect("/login");

  return token;
}
