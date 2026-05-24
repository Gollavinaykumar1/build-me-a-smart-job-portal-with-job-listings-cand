import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/build-me-a-smart-job-portal-with-job-listings-cand/",
  build: { outDir: "dist", assetsDir: "assets" },
  server: { port: 3000 },
});
