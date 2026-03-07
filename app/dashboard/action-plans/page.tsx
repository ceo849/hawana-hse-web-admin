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

type SearchParams = {
  status?: string;
};

type PageProps = {
  searchParams?: Promise<SearchParams> | SearchParams;
};

async function getAppOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "127.0.0.1:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

function normalizeStatus(value?: string) {
  const v = String(value ?? "").trim().toUpperCase();

  if (
    v === "OPEN" ||
    v === "IN_PROGRESS" ||
    v === "COMPLETED" ||
    v === "VERIFIED"
  ) {
    return v;
  }

  return "";
}

function getStatusStyle(status?: string | null) {
  const normalized = String(status ?? "").toUpperCase();

  if (normalized === "OPEN") {
    return {
      background: "#f3f4f6",
      color: "#111827",
      border: "1px solid #d1d5db",
    };
  }

  if (normalized === "IN_PROGRESS") {
    return {
      background: "#dbeafe",
      color: "#1d4ed8",
      border: "1px solid #93c5fd",
    };
  }

  if (normalized === "COMPLETED") {
    return {
      background: "#dcfce7",
      color: "#166534",
      border: "1px solid #86efac",
    };
  }

  if (normalized === "VERIFIED") {
    return {
      background: "#dcfce7",
      color: "#14532d",
      border: "1px solid #4ade80",
    };
  }

  return {
    background: "#f3f4f6",
    color: "#111827",
    border: "1px solid #d1d5db",
  };
}

export default async function ActionPlansPage({ searchParams }: PageProps) {
  const origin = await getAppOrigin();

  const resolvedSearchParams: SearchParams = searchParams
    ? await Promise.resolve(searchParams)
    : {};

  const selectedStatus = normalizeStatus(resolvedSearchParams.status);

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

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

  const filteredActionPlans = selectedStatus
    ? actionPlans.filter(
        (ap) => String(ap.status ?? "").toUpperCase() === selectedStatus
      )
    : actionPlans;

  return (
    <div style={{ padding: 40, fontFamily: "system-ui" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 20,
          flexWrap: "wrap",
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

      <form
        method="GET"
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: 20,
          padding: 14,
          border: "1px solid #eee",
          borderRadius: 12,
          background: "#fafafa",
        }}
      >
        <label style={{ fontWeight: 700 }}>Status</label>

        <select
          name="status"
          defaultValue={selectedStatus}
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #ddd",
            minWidth: 180,
          }}
        >
          <option value="">All statuses</option>
          <option value="OPEN">OPEN</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="VERIFIED">VERIFIED</option>
        </select>

        <button
          type="submit"
          style={{
            padding: "10px 16px",
            borderRadius: 10,
            border: "1px solid #111",
            background: "#111",
            color: "#fff",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          Apply
        </button>

        <a
          href="/dashboard/action-plans"
          style={{
            padding: "10px 16px",
            borderRadius: 10,
            border: "1px solid #ddd",
            background: "#fff",
            color: "#111",
            fontWeight: 700,
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Reset
        </a>
      </form>

      {filteredActionPlans.length === 0 ? (
        <div
          style={{
            border: "1px dashed #d1d5db",
            borderRadius: 12,
            padding: 18,
            background: "#fafafa",
          }}
        >
          <div style={{ fontWeight: 800, marginBottom: 6 }}>
            No action plans found
          </div>
          <div style={{ fontSize: 13, color: "#555" }}>
            {selectedStatus
              ? `No action plans match status: ${selectedStatus}`
              : "There are no action plans yet."}
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {filteredActionPlans.map((ap) => {
            const statusStyle = getStatusStyle(ap.status);

            return (
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

                <div style={{ marginTop: 10 }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "6px 10px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 800,
                      ...statusStyle,
                    }}
                  >
                    {ap.status ?? "—"}
                  </span>
                </div>

                <div style={{ marginTop: 10 }}>
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
            );
          })}
        </div>
      )}
    </div>
  );
}