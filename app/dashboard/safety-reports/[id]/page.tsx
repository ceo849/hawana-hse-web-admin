import { redirect } from "next/navigation";
import { requireAccessToken } from "@/lib/server-auth";
import { serverAppFetch } from "@/src/lib/server-app-fetch";
import PageHeader from "@/components/ui/page-header";

type SafetyReport = {
  id: string;
  title?: string | null;
  description?: string | null;
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditSafetyReportPage({ params }: PageProps) {
  const token = await requireAccessToken();
  const { id } = await params;
  const reportId = String(id ?? "").trim();

  if (!reportId) redirect("/dashboard/safety-reports");

  // =========================
  // LOAD REPORT
  // =========================
  const res = await serverAppFetch(`/safety-reports/${reportId}`, token);

  if (res.status === 401) redirect("/login");

  if (!res.ok) {
    return <div style={{ padding: 24 }}>Failed to load report</div>;
  }

  const sr = (await res.json()) as SafetyReport;

  // =========================
  // UPDATE ACTION
  // =========================
  async function updateReport(formData: FormData) {
    "use server";

    const tokenInner = await requireAccessToken();

    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();

    if (!title) {
      redirect(`/dashboard/safety-reports/${reportId}/edit`);
    }

    const updateRes = await serverAppFetch(
      `/safety-reports/${reportId}`,
      tokenInner,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
        }),
      }
    );

    if (updateRes.status === 401) redirect("/login");

    if (!updateRes.ok) {
      redirect(`/dashboard/safety-reports/${reportId}/edit`);
    }

    redirect(`/dashboard/safety-reports/${reportId}`);
  }

  return (
    <div style={{ padding: 24, fontFamily: "system-ui", maxWidth: 760 }}>
      <PageHeader
        title="Edit Safety Report"
        subtitle="Update report details"
      />

      <form action={updateReport} style={{ display: "grid", gap: 16 }}>
        <div
          style={{
            border: "1px solid #eee",
            borderRadius: 12,
            padding: 16,
            background: "#fff",
            display: "grid",
            gap: 14,
          }}
        >
          <div>
            <label style={{ fontWeight: 700 }}>Title</label>
            <input
              name="title"
              defaultValue={sr.title ?? ""}
              required
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "1px solid #ddd",
              }}
            />
          </div>

          <div>
            <label style={{ fontWeight: 700 }}>Description</label>
            <textarea
              name="description"
              defaultValue={sr.description ?? ""}
              rows={6}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "1px solid #ddd",
              }}
            />
          </div>
        </div>

        <button
          type="submit"
          style={{
            padding: "10px 16px",
            borderRadius: 10,
            background: "#111",
            color: "#fff",
            fontWeight: 700,
          }}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}