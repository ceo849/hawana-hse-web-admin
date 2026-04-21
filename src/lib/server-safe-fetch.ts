/**
 * ⚠️ DEPRECATED — DO NOT USE IN NEW CODE
 *
 * This helper is deprecated in favor of `serverAppFetch`.
 * It is intentionally kept for backward safety during Phase 4.3
 * until final verification confirms safe removal in a separate step.
 */

import { redirect } from "next/navigation";
import { serverAppFetch } from "@/src/lib/server-app-fetch";

// ✅ Guard لمنع تكرار redirect داخل نفس SSR cycle
let redirectTriggered = false;

export async function serverSafeFetch(
  path: string,
  token?: string,
  options?: RequestInit
) {
  try {
    return await serverAppFetch(path, token as any, options);
  } catch (err: any) {
    if (err?.message === "SESSION_EXPIRED") {
      if (!redirectTriggered) {
        redirectTriggered = true;
        redirect("/login"); // ✅ يحدث مرة واحدة فقط
      }

      // ❗ باقي calls يتم إيقافها بدون رمي redirect إضافي
      throw err;
    }

    throw err;
  }
}