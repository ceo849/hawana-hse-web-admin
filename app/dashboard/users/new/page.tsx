import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import PageHeader from "@/components/ui/page-header";

function getOriginFromHeaders(h: Headers): string {
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

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

    const h = await headers();
    const origin = getOriginFromHeaders(h);

    const payload = {
      fullName: String(formData.get("fullName") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      password: String(formData.get("password") ?? ""),
      role: String(formData.get("role") ?? "").trim(),
    };

    const response = await fetch(`${origin}/api/users`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        cookie: cookieStoreInner.toString(),
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 401) {
      redirect("/login");
    }

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      redirect(
        `/dashboard/users/new?error=${encodeURIComponent(
          `Create user failed (${response.status}) ${text}`,
        )}`,
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
            <label
              htmlFor="fullName"
              style={{ display: "block", marginBottom: 6, fontWeight: 700 }}
            >
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              placeholder="Enter full name"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #ddd",
                borderRadius: 10,
              }}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              style={{ display: "block", marginBottom: 6, fontWeight: 700 }}
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Enter email address"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #ddd",
                borderRadius: 10,
              }}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              style={{ display: "block", marginBottom: 6, fontWeight: 700 }}
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Enter password"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #ddd",
                borderRadius: 10,
              }}
            />
          </div>

          <div>
            <label
              htmlFor="role"
              style={{ display: "block", marginBottom: 6, fontWeight: 700 }}
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              required
              defaultValue="VIEWER"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #ddd",
                borderRadius: 10,
                background: "#fff",
              }}
            >
              <option value="OWNER">OWNER</option>
              <option value="ADMIN">ADMIN</option>
              <option value="MANAGER">MANAGER</option>
              <option value="WORKER">WORKER</option>
              <option value="VIEWER">VIEWER</option>
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            type="submit"
            style={{
              padding: "10px 16px",
              background: "#111",
              color: "#fff",
              border: "1px solid #111",
              borderRadius: 10,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Create User
          </button>

          <a
            href="/dashboard/users"
            style={{
              display: "inline-block",
              padding: "10px 16px",
              border: "1px solid #ddd",
              borderRadius: 10,
              textDecoration: "none",
              color: "#111",
              background: "#fff",
              fontWeight: 600,
            }}
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}