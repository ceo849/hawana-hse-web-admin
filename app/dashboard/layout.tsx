// app/dashboard/layout.tsx
import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import Sidebar, { type SidebarNavItem } from "@/components/layout/sidebar";
import DashboardHeader from "@/components/layout/dashboard-header";
import { decodeJwtPayload } from "@/src/auth/jwt";

type Role = "OWNER" | "MANAGER" | "WORKER" | "VIEWER" | "UNKNOWN";

type NavItem = SidebarNavItem & { roles: Role[] };

const NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", roles: ["OWNER", "MANAGER", "WORKER", "VIEWER"] },

  // Users: OWNER + MANAGER
  { href: "/dashboard/users", label: "Users", roles: ["OWNER", "MANAGER"] },

  { href: "/dashboard/safety-reports", label: "Safety Reports", roles: ["OWNER", "MANAGER", "WORKER", "VIEWER"] },

  // ✅ Action Plans: للجميع
  { href: "/dashboard/action-plans", label: "Action Plans", roles: ["OWNER", "MANAGER", "WORKER", "VIEWER"] },

  // ✅ Admin Panel داخل /dashboard (عشان مايتكررش/ومايبقاش href غلط)
  { href: "/dashboard/admin", label: "Admin Panel", roles: ["OWNER"] },
];

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value ?? null;

  if (!accessToken) redirect("/login");

  const payload = decodeJwtPayload(accessToken);
  const role: Role = (payload?.role as Role) ?? "UNKNOWN";
  const email = payload?.email ?? undefined;

  const navItems: SidebarNavItem[] = NAV.filter((item) => item.roles.includes(role)).map(
    ({ href, label }) => ({ href, label })
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "system-ui" }}>
      <Sidebar role={role} email={email} navItems={navItems} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <DashboardHeader title="Dashboard" />
        <main style={{ padding: 24 }}>{children}</main>
      </div>
    </div>
  );
}