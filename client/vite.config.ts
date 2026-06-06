import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/login": "http://localhost:8080",
      "/register": "http://localhost:8080",
    },
  },
});
