import { createReadStream, existsSync, mkdirSync, copyFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

const require = createRequire(import.meta.url);

/**
 * The MediaPipe WASM runtime is ~11.5 MB on disk (3.2 MB gzipped) and is only
 * fetched when a visitor opts into the camera. We serve it ourselves rather
 * than from Google's CDN: the site tells people nothing leaves their device, so
 * it must not then make a third-party request to prove it.
 *
 * The files are copied out of node_modules at dev/build time instead of being
 * committed, which keeps 11.5 MB of binaries out of git and guarantees the
 * runtime always matches the installed package version.
 */
const WASM_FILES = [
  "vision_wasm_internal.js",
  "vision_wasm_internal.wasm",
  "vision_wasm_nosimd_internal.js",
  "vision_wasm_nosimd_internal.wasm",
];

/**
 * Locate the package's `wasm` directory.
 *
 * Resolving "@mediapipe/tasks-vision/package.json" throws — the package's
 * exports map does not expose it — so resolve the main entry and take its
 * directory, which is the package root. Falls back to the plain node_modules
 * path if the exports map ever changes shape again.
 */
function findWasmDir(): string {
  try {
    const entry = require.resolve("@mediapipe/tasks-vision");
    const dir = path.join(path.dirname(entry), "wasm");
    if (existsSync(dir)) return dir;
  } catch {
    /* fall through */
  }
  const fallback = path.resolve("node_modules/@mediapipe/tasks-vision/wasm");
  return existsSync(fallback) ? fallback : "";
}

function mediapipeWasm(): Plugin {
  const wasmDir = findWasmDir();
  if (!wasmDir) {
    console.warn("[mediapipe-wasm] wasm directory not found; camera demo will not load");
  }

  return {
    name: "mediapipe-wasm",

    // Dev: stream the files straight out of node_modules.
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith("/vision/wasm/")) return next();
        const name = req.url.slice("/vision/wasm/".length).split("?")[0];
        if (!WASM_FILES.includes(name) || !wasmDir) return next();

        const file = path.join(wasmDir, name);
        if (!existsSync(file)) return next();

        res.setHeader(
          "Content-Type",
          name.endsWith(".wasm") ? "application/wasm" : "text/javascript"
        );
        createReadStream(file).pipe(res);
      });
    },

    // Build: copy them into dist alongside the model.
    closeBundle() {
      if (!wasmDir) return;
      const outDir = path.resolve("dist/vision/wasm");
      mkdirSync(outDir, { recursive: true });
      for (const name of WASM_FILES) {
        const from = path.join(wasmDir, name);
        if (existsSync(from)) copyFileSync(from, path.join(outDir, name));
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mediapipeWasm()],
});
