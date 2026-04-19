// src/lib/server-safe-fetch.ts

import { redirect } from "next/navigation";
import { serverAppFetch } from "@/src/lib/server-app-fetch";

export async function serverSafeFetch(
  path: string,
  token?: string,
  options?: RequestInit
) {
  try {
    return await serverAppFetch(path, token as any, options);
  } catch (err: any) {
    if (err?.message === "SESSION_EXPIRED") {
      redirect("/login");
    }

    throw err;
  }
}