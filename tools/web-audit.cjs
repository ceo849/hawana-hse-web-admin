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

  console.log("\n✅ AUDIT COMPLETE");
}

main();