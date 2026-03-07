import { redirect } from "next/navigation";
import { requireAccessToken } from "@/lib/server-auth";
import { api } from "@/lib/core-api";

type User = {
  id: string;
  email: string;
  fullName: string;
  role: string;
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditUserPage({ params }: PageProps) {
  const token = await requireAccessToken();
  const { id } = await params;

  const r = await fetch(api(`/v1/users/${id}`), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (r.status === 401) redirect("/login");
  if (!r.ok) redirect("/dashboard/users");

  const user: User = await r.json();

  async function updateUser(formData: FormData) {
    "use server";

    const tokenInner = await requireAccessToken();

    const fullName = String(formData.get("fullName") ?? "").trim();
    const role = String(formData.get("role") ?? "").trim();

    const payload: Record<string, string> = {};

    if (fullName) payload.fullName = fullName;
    if (role) payload.role = role;

    const res = await fetch(api(`/v1/users/${id}`), {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${tokenInner}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (res.status === 401) redirect("/login");
    if (!res.ok) redirect(`/dashboard/users/${id}`);

    redirect("/dashboard/users");
  }

  return (
    <div style={{ padding: 40, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 40, fontWeight: 900, marginBottom: 20 }}>
        Edit User
      </h1>

      <form action={updateUser} style={{ maxWidth: 700 }}>
        <input
          name="fullName"
          defaultValue={user.fullName}
          placeholder="Full Name"
          style={{
            width: "100%",
            padding: 16,
            marginBottom: 12,
            borderRadius: 10,
            border: "1px solid #ddd",
          }}
        />

        <input
          value={user.email}
          disabled
          style={{
            width: "100%",
            padding: 16,
            marginBottom: 12,
            borderRadius: 10,
            border: "1px solid #ddd",
            background: "#f7f7f7",
          }}
        />

        <select
          name="role"
          defaultValue={user.role}
          style={{
            width: "100%",
            padding: 16,
            marginBottom: 16,
            borderRadius: 10,
            border: "1px solid #ddd",
          }}
        >
          <option value="OWNER">OWNER</option>
          <option value="MANAGER">MANAGER</option>
          <option value="VIEWER">VIEWER</option>
        </select>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: 16,
            borderRadius: 10,
            border: "none",
            background: "#111",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Update User
        </button>
      </form>
    </div>
  );
}