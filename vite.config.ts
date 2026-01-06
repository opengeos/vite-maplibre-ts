import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  // Base path for GitHub Pages deployment
  // Uses repository name as base path in CI, root for local development
  base: process.env.GITHUB_ACTIONS ? "/vite-maplibre-ts/" : "/",
});
