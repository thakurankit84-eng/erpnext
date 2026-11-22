import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// In dev, the browser talks to Vite (same origin) and Vite forwards API calls to
// ERPNext. This avoids CORS and lets the ERPNext session cookie work.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const target = env.ERPNEXT_URL || "http://localhost:8000";
  const proxy = {
    target,
    changeOrigin: true,
    cookieDomainRewrite: "localhost",
  };
  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        "/api": proxy,
        "/files": proxy,
        "/private/files": proxy,
      },
    },
  };
});
