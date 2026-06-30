import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Must match the GitHub repo name exactly (case-sensitive in URLs).
  base: "/Vound-Case-Study/",
});
