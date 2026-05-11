import type { ReactNode } from "react";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import DashboardShell from "@/components/layout/dashboard-shell";
import MobileContainer from "@/components/ui/mobile-container";
import MobileBottomNav from "@/components/ui/mobile-bottom-nav";

import { type SidebarNavItem } from "@/components/layout/sidebar";
import { decodeJwtPayload } from "@/src/auth/jwt";

type Role = "OWNER" | "ADMIN" | "MANAGER" | "WORKER" | "VIEWER" | "UNKNOWN";

type NavItem = SidebarNavItem & {
  roles: Role[];
};

const NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", roles: ["OWNER","ADMIN","MANAGER","WORKER","VIEWER"] },
  { href: "/dashboard/users", label: "Users", roles: ["OWNER","ADMIN"] },
  { href: "/dashboard/companies", label: "Companies", roles: ["OWNER"] },
  { href: "/dashboard/sites-projects", label: "Sites / Projects", roles: ["OWNER","ADMIN","MANAGER","WORKER","VIEWER"] },
  { href: "/dashboard/safety-reports", label: "Safety Reports", roles: ["OWNER","ADMIN","MANAGER","WORKER","VIEWER"] },
  { href: "/dashboard/action-plans", label: "Action Plans", roles: ["OWNER","ADMIN","MANAGER","WORKER","VIEWER"] },
  { href: "/dashboard/billing", label: "Billing", roles: ["OWNER","ADMIN"] },
  { href: "/dashboard/admin", label: "Admin Panel", roles: ["OWNER"] },
];

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  await cookies();

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value ?? null;

  if (!accessToken) {
    redirect("/login");
  }

  // 🔥 ROOT FIX هنا
  let role: Role = "UNKNOWN";
  let email: string | undefined = undefined;

  try {
    const payload = decodeJwtPayload(accessToken);

    role = (payload?.role as Role) ?? "UNKNOWN";
    email = payload?.email ?? undefined;
  } catch (err) {
    console.error("JWT DECODE FAILED:", err);

    // 🔒 controlled failure بدل crash
    redirect("/login");
  }

  const navItems: SidebarNavItem[] = NAV
    .filter((item) => item.roles.includes(role))
    .map(({ href, label }) => ({
      href,
      label,
    }));

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "system-ui",
        background: "#f3f4f6",
      }}
    >
      <DashboardShell role={role} email={email} navItems={navItems}>
        <MobileContainer>{children}</MobileContainer>

        <Suspense fallback={null}>
          <MobileBottomNav />
        </Suspense>
      </DashboardShell>
    </div>
  );
}