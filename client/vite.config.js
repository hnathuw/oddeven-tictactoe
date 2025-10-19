import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";

export default defineConfig({
  plugins: [react()],
  css: { postcss: { plugins: [tailwind(), autoprefixer()] } },
  server: { port: 3000, host: true },
});
