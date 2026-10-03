import { defineConfig } from "vitest/config";
import tailwindcss from "@tailwindcss/vite";
import { noindexPlugin } from "./scripts/vite-plugin-noindex.js";

export default defineConfig({
  base: "./",
  plugins: [tailwindcss(), noindexPlugin(process.env.SITE_NOINDEX === "true")],
  test: {
    environment: "jsdom",
  },
});
