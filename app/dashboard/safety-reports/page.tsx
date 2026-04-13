// app/dashboard/safety-reports/page.tsx

import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PageHeader from "@/components/ui/page-header";
import { decodeJwtPayload } from "@/src/auth/jwt";

type Role =
  | "OWNER"
  | "ADMIN"
  | "MANAGER"
  | "WORKER"
  | "VIEWER"
  | "UNKNOWN";

type SafetyReport = {
  id: string;
  title: string | null;
  description: string | null;
  status: string | null;
  createdAt: string | null;
};

type SafetyReportsMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type SafetyReportsResponse = {
  data: SafetyReport[];
  meta?: SafetyReportsMeta;
};

type SearchParams = {
  page?: string;
  limit?: string;
};

function isSafetyReport(value: unknown): value is SafetyReport {
  if (typeof value !== "object" || value === null) return false;

  const c = value as Record<string, unknown>;

  return (
    typeof c.id === "string" &&
    (typeof c.title === "string" || c.title === null) &&
    (typeof c.description === "string" || c.description === null) &&
    (typeof c.status === "string" || c.status === null) &&
    (typeof c.createdAt === "string" || c.createdAt === null)
  );
}

function parseResponse(
  value: unknown,
  page: number,
  limit: number
): SafetyReportsResponse {
  if (Array.isArray(value)) {
    const data = value.filter(isSafetyReport);
    return {
      data,
      meta: {
        total: data.length,
        page,
        limit,
        totalPages: 1,
      },
    };
  }

  if (typeof value !== "object" || value === null) {
    return {
      data: [],
      meta: {
        total: 0,
        page,
        limit,
        totalPages: 1,
      },
    };
  }

  const c = value as Record<string, unknown>;

  const data = Array.isArray(c.data)
    ? c.data.filter(isSafetyReport)
    : [];

  const metaRaw =
    typeof c.meta === "object" && c.meta !== null
      ? (c.meta as Record<string, unknown>)
      : null;

  return {
    data,
    meta: {
      total:
        typeof metaRaw?.total === "number" ? metaRaw.total : data.length,
      page:
        typeof metaRaw?.page === "number" ? metaRaw.page : page,
      limit:
        typeof metaRaw?.limit === "number" ? metaRaw.limit : limit,
      totalPages:
        typeof metaRaw?.totalPages === "number"
          ? metaRaw.totalPages
          : 1,
    },
  };
}

function toInt(v: unknown, fallback: number) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

export default async function SafetyReportsPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams> | SearchParams;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) redirect("/login");

  const payload = decodeJwtPayload(token);
  const role: Role = (payload?.role as Role) ?? "UNKNOWN";

  const sp = searchParams
    ? await Promise.resolve(searchParams)
    : {};

  const page = toInt(sp.page ?? "1", 1);
  const limit = Math.min(Math.max(toInt(sp.limit ?? "20", 20), 1), 100);

  let parsed: SafetyReportsResponse;

  try {
    // ✅ FIX النهائي: direct call to Core (NO /api)
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/safety-reports?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (res.status === 401) redirect("/login");

    const json = await res.json();

    parsed = parseResponse(json, page, limit);
  } catch {
    return <div>Failed to load safety reports</div>;
  }

  return (
    <div style={{ fontFamily: "system-ui", padding: 24 }}>
      <PageHeader
        title="Safety Reports"
        subtitle="Operational reports"
      />

      <div style={{ marginBottom: 12 }}>
        Total: {parsed.meta?.total ?? 0}
      </div>

      <table style={{ width: "100%" }}>
        <tbody>
          {parsed.data.map((r) => (
            <tr key={r.id}>
              <td>{r.title ?? "-"}</td>
              <td>{r.status ?? "-"}</td>
              <td>{r.createdAt ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 16 }}>
        <Link href={`/dashboard/safety-reports?page=${page - 1}`}>
          Prev
        </Link>{" "}
        |{" "}
        <Link href={`/dashboard/safety-reports?page=${page + 1}`}>
          Next
        </Link>
      </div>
    </div>
  );
}