import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { copyFileSync, mkdirSync, existsSync } from "fs";

// Plugin to copy manifest + icons to dist after build
function copyPublicPlugin() {
  return {
    name: "copy-public",
    closeBundle() {
      const files = ["manifest.json"];
      for (const f of files) {
        try { copyFileSync(resolve(__dirname, f), resolve(__dirname, "dist", f)); } catch {}
      }
      // Copy icons
      const iconsDir = resolve(__dirname, "public/icons");
      const distIconsDir = resolve(__dirname, "dist/icons");
      if (existsSync(iconsDir)) {
        mkdirSync(distIconsDir, { recursive: true });
        for (const size of ["icon16.png", "icon48.png", "icon128.png"]) {
          try { copyFileSync(resolve(iconsDir, size), resolve(distIconsDir, size)); } catch {}
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), copyPublicPlugin()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      input: {
        background: resolve(__dirname, "src/background/index.ts"),
        content: resolve(__dirname, "src/content/index.ts"),
        panel: resolve(__dirname, "panel.html"),
        popup: resolve(__dirname, "popup.html"),
      },
      output: {
        entryFileNames: (chunk) =>
          ["background", "content"].includes(chunk.name)
            ? "[name].js"
            : "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
});
