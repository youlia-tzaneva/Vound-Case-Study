import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],,
  base: '/vound-case-study/', // 👈 ADD THIS LINE (use your exact repo name)
});
