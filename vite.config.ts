import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api/luma-events": {
        target: "https://api2.luma.com",
        changeOrigin: true,
        rewrite: () =>
          "/calendar/get-items?calendar_api_id=cal-KwZeQ0HC9LFQ3Fk",
      },
    },
  },
});
