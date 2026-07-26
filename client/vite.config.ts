import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

const serveSvgz = (): Plugin => ({
  name: "serve-svgz-images",
  configureServer(server) {
    server.middlewares.use((request, response, next) => {
      if (request.url?.split(/[?#]/, 1)[0].toLowerCase().endsWith(".svgz")) {
        response.setHeader("Content-Encoding", "gzip");
        response.setHeader("Content-Type", "image/svg+xml");
      }
      next();
    });
  },
  configurePreviewServer(server) {
    server.middlewares.use((request, response, next) => {
      if (request.url?.split(/[?#]/, 1)[0].toLowerCase().endsWith(".svgz")) {
        response.setHeader("Content-Encoding", "gzip");
        response.setHeader("Content-Type", "image/svg+xml");
      }
      next();
    });
  },
});

export default defineConfig({
  plugins: [serveSvgz(), react()],
  server: {
    proxy: {
      "/api": "http://127.0.0.1:8080",
      "/health": "http://127.0.0.1:8080",
    },
  },
});
