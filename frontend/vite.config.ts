import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          if (id.includes("react-router")) return "vendor-router";
          if (
            id.includes("@reduxjs") ||
            id.includes("react-redux") ||
            id.includes("redux-persist")
          ) {
            return "vendor-state";
          }
          if (
            id.includes("@material-tailwind") ||
            id.includes("@floating-ui")
          ) {
            return "vendor-ui";
          }
          if (id.includes("@fortawesome")) return "vendor-icons";
          if (id.includes("react") || id.includes("scheduler")) {
            return "vendor-react";
          }

          return "vendor-misc";
        },
      },
    },
  },
  server: {
    proxy: {
      "/api": "http://localhost:3002",
      "/uploads": "http://localhost:3002",
    },
  },
});
