#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = process.cwd();

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else {
      results.push(fullPath);
    }
  });

  return results;
}

function scanDashboard() {
  const dashboardPath = path.join(ROOT, "app/dashboard");

  if (!fs.existsSync(dashboardPath)) {
    console.log("❌ dashboard folder not found");
    return [];
  }

  const files = walk(dashboardPath);

  return files
    .filter((f) => f.endsWith("page.tsx"))
    .map((f) => {
      const route = f
        .replace(dashboardPath, "")
        .replace("/page.tsx", "");

      return {
        route: "/dashboard" + route,
        file: f,
      };
    });
}

function extractNav() {
  const layoutFile = path.join(ROOT, "app/dashboard/layout.tsx");

  if (!fs.existsSync(layoutFile)) return [];

  const content = fs.readFileSync(layoutFile, "utf-8");

  const matches = [...content.matchAll(/href:\s*["'`](.*?)["'`]/g)];

  return matches.map((m) => m[1]);
}

function findDrift(routes, nav) {
  const routePaths = routes.map((r) => r.route);
  const missingInNav = routePaths.filter((r) => !nav.includes(r));

  return { missingInNav };
}

// ===== ENFORCEMENT: BLOCK DIRECT FETCH =====
function scanForDirectFetch() {
  const srcPath = path.join(ROOT, "src");

  if (!fs.existsSync(srcPath)) return [];

  const files = walk(srcPath).filter((f) =>
    f.endsWith(".ts") || f.endsWith(".tsx")
  );

  const violations = [];

  files.forEach((file) => {
    const content = fs.readFileSync(file, "utf-8");

    const matches = content.match(/fetch\((.*?)\)/g) || [];

    matches.forEach((m) => {
      if (
        m.includes("http://") ||
        m.includes("https://") ||
        m.includes("/v1/")
      ) {
        violations.push({ file, code: m });
      }
    });
  });

  return violations;
}

// ===== ENFORCEMENT: BLOCK BUSINESS LOGIC IN UI (REFINED) =====
function scanForBusinessLogic() {
  const appPath = path.join(ROOT, "app");

  if (!fs.existsSync(appPath)) return [];

  const files = walk(appPath).filter(
    (f) =>
      f.endsWith(".tsx") &&
      !f.includes("/api/")
  );

  const violations = [];

  files.forEach((file) => {
    const content = fs.readFileSync(file, "utf-8");

    const patterns = [
      "status ===",
      "status !==",
      "status ==",
      "status !=",
      "subscriptionStatus",
      "workflow",
    ];

    patterns.forEach((p) => {
      if (content.includes(p)) {
        violations.push({ file, pattern: p });
      }
    });
  });

  return violations;
}

// ===== ENFORCEMENT: BLOCK companyId USAGE IN WEB =====
function scanForCompanyIdUsage() {
  const srcPath = path.join(ROOT, "src");

  if (!fs.existsSync(srcPath)) return [];

  const files = walk(srcPath).filter((f) =>
    f.endsWith(".ts") || f.endsWith(".tsx")
  );

  const violations = [];

  files.forEach((file) => {
    const content = fs.readFileSync(file, "utf-8");

    if (content.includes("companyId")) {
      violations.push({ file, pattern: "companyId" });
    }
  });

  return violations;
}

function main() {
  console.log("🔍 HAWANA WEB AUDIT START\n");

  const routes = scanDashboard();
  const nav = extractNav();
  const drift = findDrift(routes, nav);

  console.log("📊 ROUTES:");
  console.log(routes);

  console.log("\n📊 NAV:");
  console.log(nav);

  console.log("\n⚠️ DRIFT:");
  console.log(drift);

  const fetchViolations = scanForDirectFetch();
  const logicViolations = scanForBusinessLogic();
  const tenantViolations = scanForCompanyIdUsage();

  let hasErrors = false;

  // FETCH
  if (fetchViolations.length > 0) {
    console.error("\n❌ FETCH VIOLATIONS DETECTED:");
    console.error(fetchViolations);
    hasErrors = true;
  }

  // BUSINESS LOGIC
  if (logicViolations.length > 0) {
    console.error("\n❌ BUSINESS LOGIC VIOLATIONS DETECTED:");
    console.error(logicViolations);
    hasErrors = true;
  }

  // TENANT
  if (tenantViolations.length > 0) {
    console.error("\n❌ TENANT ISOLATION VIOLATIONS DETECTED:");
    console.error(tenantViolations);
    hasErrors = true;
  }

  if (hasErrors) {
    console.warn("\n⚠️ Violations موجودة — مسموح بالـ push مؤقتًا (Phase Extraction)");
  } else {
    console.log("\n✅ AUDIT CLEAN");
  }
}

main();