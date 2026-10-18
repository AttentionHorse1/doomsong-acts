import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  base: "/doomsong-acts/",
  build: {
    rollupOptions: {
      input: {
        background: resolve(import.meta.dirname, "background.html"),
        controls: resolve(import.meta.dirname, "index.html"),
        announcement: resolve(import.meta.dirname, "announcement.html"),
      },
    },
  },
});
