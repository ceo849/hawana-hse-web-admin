import type { ReactNode } from "react";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import DashboardShell from "@/components/layout/dashboard-shell";
import { type SidebarNavItem } from "@/components/layout/sidebar";
import { decodeJwtPayload } from "@/src/auth/jwt";

type Role = "OWNER" | "ADMIN" | "MANAGER" | "WORKER" | "VIEWER" | "UNKNOWN";

type NavItem = SidebarNavItem & {
  roles: Role[];
};

const NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", roles: ["OWNER", "ADMIN", "MANAGER", "WORKER", "VIEWER"] },
  { href: "/dashboard/users", label: "Users", roles: ["OWNER", "ADMIN"] },
  { href: "/dashboard/companies", label: "Companies", roles: ["OWNER"] },
  { href: "/dashboard/sites-projects", label: "Sites / Projects", roles: ["OWNER", "ADMIN", "MANAGER", "WORKER", "VIEWER"] },
  { href: "/dashboard/safety-reports", label: "Safety Reports", roles: ["OWNER", "ADMIN", "MANAGER", "WORKER", "VIEWER"] },
  { href: "/dashboard/action-plans", label: "Action Plans", roles: ["OWNER", "ADMIN", "MANAGER", "WORKER", "VIEWER"] },
  { href: "/dashboard/admin", label: "Admin Panel", roles: ["OWNER"] },
];

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  // ✅ Next 16 → cookies async
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("access_token")?.value ?? null;

  if (!accessToken) {
    redirect("/login");
  }

  const payload = decodeJwtPayload(accessToken);
  const role: Role = (payload?.role as Role) ?? "UNKNOWN";
  const email = payload?.email ?? undefined;

  const navItems: SidebarNavItem[] = NAV.filter((item) =>
    item.roles.includes(role),
  ).map(({ href, label }) => ({
    href,
    label,
  }));

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "system-ui",
        background: "#f9fafb",
      }}
    >
      <DashboardShell role={role} email={email} navItems={navItems}>
        <Suspense fallback={null}>{children}</Suspense>
      </DashboardShell>
    </div>
  );
}