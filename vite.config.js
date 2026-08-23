import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  root: "src",
  clearScreen: false,
  server: { host: "127.0.0.1", port: 1420, strictPort: true },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve("src/index.html"),
        settings: resolve("src/settings.html"),
        selection: resolve("src/selection.html"),
        selectionDot: resolve("src/selection-dot.html")
      }
    }
  }
});
