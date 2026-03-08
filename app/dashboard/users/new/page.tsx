import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";

function getOriginFromHeaders(h: Headers): string {
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

export default async function NewUserPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    redirect("/login");
  }

  async function createUser(formData: FormData) {
    "use server";

    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
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
        cookie: cookieStore.toString(),
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

  const h = await headers();
  const searchParams = new URLSearchParams(h.get("x-invoke-query") ?? "");
  const error = searchParams.get("error");

  return (
    <div style={{ fontFamily: "system-ui", maxWidth: 720 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>
        Create User
      </h1>

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

      <form action={createUser} style={{ display: "grid", gap: 14 }}>
        <div>
          <label
            htmlFor="fullName"
            style={{ display: "block", marginBottom: 6, fontWeight: 600 }}
          >
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #ddd",
              borderRadius: 8,
            }}
          />
        </div>

        <div>
          <label
            htmlFor="email"
            style={{ display: "block", marginBottom: 6, fontWeight: 600 }}
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #ddd",
              borderRadius: 8,
            }}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            style={{ display: "block", marginBottom: 6, fontWeight: 600 }}
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #ddd",
              borderRadius: 8,
            }}
          />
        </div>

        <div>
          <label
            htmlFor="role"
            style={{ display: "block", marginBottom: 6, fontWeight: 600 }}
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
              borderRadius: 8,
            }}
          >
            <option value="OWNER">OWNER</option>
            <option value="ADMIN">ADMIN</option>
            <option value="MANAGER">MANAGER</option>
            <option value="WORKER">WORKER</option>
            <option value="VIEWER">VIEWER</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <button
            type="submit"
            style={{
              padding: "10px 16px",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
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
              borderRadius: 8,
              textDecoration: "none",
              color: "#111",
            }}
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}