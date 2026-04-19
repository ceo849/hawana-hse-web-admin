import nextConfig from "eslint-config-next";

const RESTRICTED_RULE = [
  "error",

  {
    selector: "CallExpression[callee.name='fetch']",
    message:
      "❌ ممنوع fetch مباشر — استخدم serverAppFetch أو apiClient فقط",
  },

  {
    selector:
      "Literal[value=/localhost:3001|127\\.0\\.0\\.1:3001|https?:\\/\\/.*:3001/]",
    message:
      "❌ ممنوع الاتصال المباشر بالـ Core",
  },

  {
    selector: "Literal[value=/\\/v1\\//]",
    message:
      "❌ ممنوع /v1 في Web — استخدم API Proxy فقط",
  },

  {
    selector: "Literal[value=/\\/api\\/v1/]",
    message:
      "❌ /api/v1 ممنوع — استخدم /api فقط",
  },
];

// ✅ FIX
const config = [
  ...nextConfig,

  {
    files: ["app/**/*.{ts,tsx}", "src/**/*.{ts,tsx}"],
    ignores: ["app/api/**"],

    rules: {
      "no-restricted-syntax": RESTRICTED_RULE,
    },
  },

  {
    files: ["app/api/**/*.ts"],
    rules: {
      "no-restricted-syntax": "off",
    },
  },

  {
    files: ["src/lib/server-app-fetch.ts"],
    rules: {
      "no-restricted-syntax": "off",
    },
  },

  {
    files: ["src/lib/api-client.ts"],
    rules: {
      "no-restricted-syntax": "off",
    },
  },

  {
    files: ["*.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
];

export default config;