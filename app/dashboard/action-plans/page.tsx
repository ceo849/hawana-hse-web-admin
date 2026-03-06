// app/dashboard/action-plans/page.tsx
import { redirect } from "next/navigation";
import { headers, cookies } from "next/headers";

type ActionPlan = {
  id: string;
  title: string;
  description?: string | null;
  status?: string | null;
  safetyReportId?: string | null;
  createdAt?: string | null;
};

async function getAppOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "127.0.0.1:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

export default async function ActionPlansPage() {
  const origin = await getAppOrigin();

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString(); // يمرر access_token للـ proxy

  const res = await fetch(`${origin}/api/action-plans`, {
    method: "GET",
    headers: {
      cookie: cookieHeader,
    },
    cache: "no-store",
  });

  if (res.status === 401) redirect("/login?next=/dashboard/action-plans");

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return (
      <div style={{ padding: 40, fontFamily: "system-ui" }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0 }}>
          Action Plans
        </h1>
        <pre
          style={{
            marginTop: 20,
            padding: 12,
            background: "#f7f7f7",
            borderRadius: 12,
            overflowX: "auto",
          }}
        >{`Failed to load action plans (${res.status})
${text}`}</pre>
      </div>
    );
  }

  const actionPlans = (await res.json()) as ActionPlan[];

  return (
    <div style={{ padding: 40, fontFamily: "system-ui" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0 }}>
          Action Plans
        </h1>

        <a
          href="/dashboard/action-plans/new"
          style={{
            padding: "10px 16px",
            background: "#111",
            color: "#fff",
            borderRadius: 10,
            textDecoration: "none",
            fontWeight: 800,
            display: "inline-block",
          }}
        >
          + New Action Plan
        </a>
      </div>

      {actionPlans.length === 0 ? (
        <div>No action plans found.</div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {actionPlans.map((ap) => (
            <div
              key={ap.id}
              style={{
                border: "1px solid #eee",
                borderRadius: 10,
                padding: 16,
                background: "#fff",
              }}
            >
              <div style={{ fontWeight: 800 }}>{ap.title}</div>

              <div style={{ marginTop: 6 }}>
                <b>Status:</b> {ap.status ?? "—"}
              </div>

              <div style={{ marginTop: 6 }}>
                <b>Safety Report:</b> {ap.safetyReportId ?? "—"}
              </div>

              <div style={{ marginTop: 10 }}>
                <a
                  href={`/dashboard/action-plans/${encodeURIComponent(ap.id)}`}
                  style={{ textDecoration: "underline" }}
                >
                  View
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}