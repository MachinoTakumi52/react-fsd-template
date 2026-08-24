import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(import.meta.dirname, "./src") },
      { find: "@app", replacement: path.resolve(import.meta.dirname, "./src/app") },
      { find: "@app/*", replacement: path.resolve(import.meta.dirname, "./src/app/*") },
      { find: "@entities", replacement: path.resolve(import.meta.dirname, "./src/entities") },
      { find: "@entities/*", replacement: path.resolve(import.meta.dirname, "./src/entities/*") },
      { find: "@features", replacement: path.resolve(import.meta.dirname, "./src/features") },
      { find: "@features/*", replacement: path.resolve(import.meta.dirname, "./src/features/*") },
      { find: "@pages", replacement: path.resolve(import.meta.dirname, "./src/pages") },
      { find: "@pages/*", replacement: path.resolve(import.meta.dirname, "./src/pages/*") },
      { find: "@shared", replacement: path.resolve(import.meta.dirname, "./src/shared") },
      { find: "@shared/*", replacement: path.resolve(import.meta.dirname, "./src/shared/*") },
      { find: "@widgets", replacement: path.resolve(import.meta.dirname, "./src/widgets") },
      { find: "@widgets/*", replacement: path.resolve(import.meta.dirname, "./src/widgets/*") },
      { find: "app", replacement: path.resolve(import.meta.dirname, "./src/app") },
      { find: "app/*", replacement: path.resolve(import.meta.dirname, "./src/app/*") },
      { find: "entities", replacement: path.resolve(import.meta.dirname, "./src/entities") },
      { find: "entities/*", replacement: path.resolve(import.meta.dirname, "./src/entities/*") },
      { find: "features", replacement: path.resolve(import.meta.dirname, "./src/features") },
      { find: "features/*", replacement: path.resolve(import.meta.dirname, "./src/features/*") },
      { find: "pages", replacement: path.resolve(import.meta.dirname, "./src/pages") },
      { find: "pages/*", replacement: path.resolve(import.meta.dirname, "./src/pages/*") },
      { find: "shared", replacement: path.resolve(import.meta.dirname, "./src/shared") },
      { find: "shared/*", replacement: path.resolve(import.meta.dirname, "./src/shared/*") },
      { find: "widgets", replacement: path.resolve(import.meta.dirname, "./src/widgets") },
      { find: "widgets/*", replacement: path.resolve(import.meta.dirname, "./src/widgets/*") },
    ],
  },
});
