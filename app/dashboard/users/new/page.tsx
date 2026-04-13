// app/dashboard/users/new/page.tsx

export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import PageHeader from "@/components/ui/page-header";

type PageProps = {
  searchParams?: Promise<{ error?: string }> | { error?: string };
};

export default async function NewUserPage({ searchParams }: PageProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const resolvedSearchParams = searchParams
    ? await Promise.resolve(searchParams)
    : {};

  const error = String(resolvedSearchParams?.error ?? "").trim();

  async function createUser(formData: FormData) {
    "use server";

    const cookieStoreInner = await cookies();
    const tokenInner = cookieStoreInner.get("access_token")?.value;

    if (!tokenInner) {
      redirect("/login");
    }

    const payload = {
      fullName: String(formData.get("fullName") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      password: String(formData.get("password") ?? ""),
      role: String(formData.get("role") ?? "").trim(),
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenInner}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (res.status === 401) {
        redirect("/login");
      }

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Create user failed");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Create user failed";

      redirect(
        `/dashboard/users/new?error=${encodeURIComponent(message)}`
      );
    }

    redirect("/dashboard/users");
  }

  return (
    <div style={{ fontFamily: "system-ui", padding: 24, maxWidth: 760 }}>
      <PageHeader
        title="Create User"
        subtitle="Add a new system user and assign an access role"
      />

      {error ? (
        <div
          style={{
            marginBottom: 16,
            padding: 12,
            borderRadius: 10,
            background: "#fef2f2",
            color: "#991b1b",
            border: "1px solid #fecaca",
            whiteSpace: "pre-wrap",
          }}
        >
          {error}
        </div>
      ) : null}

      <form action={createUser} style={{ display: "grid", gap: 16 }}>
        <div
          style={{
            border: "1px solid #eee",
            borderRadius: 12,
            background: "#fff",
            padding: 16,
            display: "grid",
            gap: 14,
          }}
        >
          <div>
            <label htmlFor="fullName">Full Name</label>
            <input id="fullName" name="fullName" required />
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" required />
          </div>

          <div>
            <label htmlFor="role">Role</label>
            <select id="role" name="role" defaultValue="VIEWER">
              <option value="OWNER">OWNER</option>
              <option value="ADMIN">ADMIN</option>
              <option value="MANAGER">MANAGER</option>
              <option value="WORKER">WORKER</option>
              <option value="VIEWER">VIEWER</option>
            </select>
          </div>
        </div>

        <button type="submit">Create User</button>
      </form>
    </div>
  );
}