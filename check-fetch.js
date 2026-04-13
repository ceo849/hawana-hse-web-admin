// check-fetch.js (UPDATED)

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "app");

const errors = [];

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // ❌ detect any /v1 direct usage
    if (
      trimmed.includes("/v1/") &&
      !trimmed.includes("http") &&
      !trimmed.includes("NEXT_PUBLIC") &&
      !trimmed.includes("CORE_API")
    ) {
      errors.push({
        file: filePath,
        line: index + 1,
        code: trimmed,
      });
    }
  });
}

function walk(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (file.endsWith(".ts") || file.endsWith(".tsx")) {
      scanFile(fullPath);
    }
  });
}

walk(ROOT);

console.log("\n🔍 DIRECT /v1 USAGE:\n");

if (errors.length === 0) {
  console.log("✅ No issues found");
} else {
  errors.forEach((e) => {
    console.log(`❌ ${e.file}:${e.line}`);
    console.log(`   ${e.code}`);
    console.log("");
  });

  console.log(`\nTotal Issues: ${errors.length}`);
}