// app/dashboard/users/new/page.tsx

export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { headers, cookies } from "next/headers";

import { requireAccessToken } from "@/lib/server-auth";
import PageHeader from "@/components/ui/page-header";
import { serverAppFetch } from "@/src/lib/server-app-fetch";
import ErrorState from "@/components/ui/error-state";

type PageProps = {
  searchParams?: Promise<{ error?: string }> | { error?: string };
};

const CREATE_USER_FALLBACK_MESSAGE = "Unable to create user";

const SAFE_CREATE_USER_MESSAGES = new Set([
  "email is required",
  "fullName is required",
  "password is required",
  "password must be at least 8 characters",
  "role is required",
  "Invalid role",
  "email already exists",
  "User limit reached for current plan",
  "Insufficient authority to create user with requested role",
]);

function sanitizeCreateUserMessage(value: unknown): string {
  if (Array.isArray(value)) {
    const messages = value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);

    if (
      messages.length > 0 &&
      messages.every((message) => SAFE_CREATE_USER_MESSAGES.has(message))
    ) {
      return messages.join(" | ");
    }

    return CREATE_USER_FALLBACK_MESSAGE;
  }

  if (typeof value === "string") {
    const message = value.trim();

    if (SAFE_CREATE_USER_MESSAGES.has(message)) {
      return message;
    }
  }

  return CREATE_USER_FALLBACK_MESSAGE;
}

function extractErrorMessage(data: unknown): string {
  if (typeof data !== "object" || data === null) {
    return CREATE_USER_FALLBACK_MESSAGE;
  }

  const candidate = data as Record<string, unknown>;

  return sanitizeCreateUserMessage(candidate.message ?? candidate.error);
}

function isNextRedirectError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest?: unknown }).digest === "string" &&
    (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

export default async function NewUserPage({ searchParams }: PageProps) {
  headers();
  cookies();

  const token = await requireAccessToken();

  const resolvedSearchParams = searchParams
    ? await Promise.resolve(searchParams)
    : {};

  const error = String(resolvedSearchParams?.error ?? "").trim();

  async function createUser(formData: FormData) {
    "use server";

    const payload = {
      fullName: String(formData.get("fullName") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      password: String(formData.get("password") ?? ""),
      role: String(formData.get("role") ?? "").trim(),
    };

    if (
      !payload.fullName ||
      !payload.email ||
      !payload.password ||
      !payload.role
    ) {
      redirect(
        `/dashboard/users/new?error=${encodeURIComponent(
          "All fields are required"
        )}`
      );
    }

    try {
      const tokenInner = await requireAccessToken();

      const res = await serverAppFetch(
        `/api/users`,
        tokenInner,
        {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      if (res.status === 401) {
        redirect("/login");
      }

      if (!res.ok) {
        const contentType = res.headers.get("content-type") ?? "";
        const isJson = contentType.includes("application/json");

        let message = "Create user failed";

        if (isJson) {
          const data = await res.json().catch(() => ({}));
          message = extractErrorMessage(data);
        } else {
          const text = await res.text().catch(() => "");
          if (text.trim()) {
            message = sanitizeCreateUserMessage(text);
          }
        }

        throw new Error(message);
      }
    } catch (error) {
      if (isNextRedirectError(error)) {
        throw error;
      }

      if (error instanceof Error && error.message === "SESSION_EXPIRED") {
        redirect("/login");
      }

      const message =
        error instanceof Error
          ? sanitizeCreateUserMessage(error.message)
          : CREATE_USER_FALLBACK_MESSAGE;

      redirect(`/dashboard/users/new?error=${encodeURIComponent(message)}`);
    }

    redirect("/dashboard/users");
  }

  return (
    <div style={container}>
      <PageHeader
        title="Create User"
        subtitle="Add a new system user and assign an access role"
      />

      {error && <ErrorState message={error} />}

      <form action={createUser} style={form}>
        <div style={card}>
          <div>
            <label style={label}>Full Name</label>
            <input
              name="fullName"
              placeholder="Enter full name"
              required
              style={input}
            />
          </div>

          <div>
            <label style={label}>Email</label>
            <input
              name="email"
              type="email"
              placeholder="Enter email"
              required
              style={input}
            />
          </div>

          <div>
            <label style={label}>Password</label>
            <input
              name="password"
              type="password"
              placeholder="Enter password"
              required
              style={input}
            />
          </div>

          <div>
            <label style={label}>Role</label>
            <select name="role" defaultValue="VIEWER" style={input}>
              <option value="OWNER">OWNER</option>
              <option value="ADMIN">ADMIN</option>
              <option value="MANAGER">MANAGER</option>
              <option value="WORKER">WORKER</option>
              <option value="VIEWER">VIEWER</option>
            </select>
          </div>
        </div>

        <div style={actionsRow}>
          <button type="submit" style={primaryBtn}>
            Create User
          </button>
        </div>
      </form>
    </div>
  );
}

/* ================= STANDARDIZED STYLES ================= */

const container: React.CSSProperties = {
  padding: 24,
  fontFamily: "system-ui",
  maxWidth: 760,
  margin: "0 auto",
};

const form: React.CSSProperties = {
  display: "grid",
  gap: 16,
};

const card: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  background: "#fff",
  padding: 16,
  display: "grid",
  gap: 14,
};

const label: React.CSSProperties = {
  marginBottom: 6,
  fontWeight: 700,
};

const input: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #ddd",
};

const actionsRow: React.CSSProperties = {
  display: "flex",
  gap: 10,
  alignItems: "center",
};

const primaryBtn: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: 10,
  background: "#111",
  color: "#fff",
};