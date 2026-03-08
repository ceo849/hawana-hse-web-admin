import { redirect } from "next/navigation";
import { requireAccessToken } from "@/lib/server-auth";
import { api } from "@/lib/core-api";

type PageProps = {
  searchParams?: Promise<{ error?: string }>;
};

export default async function NewSafetyReportPage({ searchParams }: PageProps) {
  await requireAccessToken();

  const resolvedSearchParams = await Promise.resolve(searchParams);
  const error = String(resolvedSearchParams?.error ?? "").trim();

  async function createSafetyReport(formData: FormData) {
    "use server";

    const token = await requireAccessToken();

    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();

    if (!title) {
      redirect(
        `/dashboard/safety-reports/new?error=${encodeURIComponent(
          "Title is required",
        )}`,
      );
    }

    const payload: Record<string, string> = { title };

    if (description) {
      payload.description = description;
    }

    const res = await fetch(api("/v1/safety-reports"), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (res.status === 401) redirect("/login");

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      redirect(
        `/dashboard/safety-reports/new?error=${encodeURIComponent(
          `Create safety report failed (${res.status}) ${text}`,
        )}`,
      );
    }

    redirect("/dashboard/safety-reports");
  }

  return (
    <div style={{ fontFamily: "system-ui", maxWidth: 900 }}>
      <div style={{ marginBottom: 12, fontSize: 13, color: "#666" }}>
        <a href="/dashboard">Dashboard</a> /
        <a href="/dashboard/safety-reports"> Safety Reports</a> /
        <span> Create Safety Report</span>
      </div>

      <h1 style={{ fontSize: 40, fontWeight: 900, marginBottom: 20 }}>
        Create Safety Report
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

      <form action={createSafetyReport} style={{ maxWidth: 800 }}>
        <input
          name="title"
          placeholder="Title"
          required
          style={{
            width: "100%",
            padding: 16,
            marginBottom: 12,
            borderRadius: 10,
            border: "1px solid #ddd",
          }}
        />

        <textarea
          name="description"
          rows={8}
          placeholder="Description"
          style={{
            width: "100%",
            padding: 16,
            marginBottom: 16,
            borderRadius: 10,
            border: "1px solid #ddd",
            resize: "vertical",
          }}
        />

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            type="submit"
            style={{
              padding: "16px 20px",
              borderRadius: 10,
              border: "none",
              background: "#111",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Create Safety Report
          </button>

          <a
            href="/dashboard/safety-reports"
            style={{
              display: "inline-block",
              padding: "16px 20px",
              borderRadius: 10,
              border: "1px solid #ddd",
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