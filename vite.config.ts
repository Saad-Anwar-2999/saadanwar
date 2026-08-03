// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
// Imported from the package's ESM subpath (not the package root) because
// @lovable.dev/vite-tanstack-config@2.8.5's "main" entry (dist/index.cjs) does
// require("vite"), which fails under Vite 8's ESM-only build (ERR_REQUIRE_ESM).
// Its "module" build (dist/index.js) uses import and doesn't hit the bug.
import { defineConfig } from "@lovable.dev/vite-tanstack-config/dist/index.js";

// GitHub Pages serves this project from https://<user>.github.io/saadanwar/,
// so every asset URL and route match needs the "/saadanwar/" prefix. The
// deploy workflow sets GH_PAGES=true; local dev/build stay at "/".
const base = process.env.GH_PAGES === "true" ? "/saadanwar/" : "/";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    // GitHub Pages only serves static files, so ship a client-only SPA build:
    // prerender the app shell straight to index.html instead of relying on a
    // Nitro/Node server to render each request.
    spa: {
      enabled: true,
      prerender: { outputPath: "/index.html" },
    },
    router: { basepath: base },
  },
  vite: { base },
  // No server runtime on GitHub Pages — skip the Nitro build entirely.
  nitro: false,
});
