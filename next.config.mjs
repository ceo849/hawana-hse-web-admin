/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://192.168.1.3:3000",
  ],

  // ✅ ADDITIVE ONLY — REQUIRED FOR DOCKER RUNTIME
  output: "standalone",
};

export default nextConfig;