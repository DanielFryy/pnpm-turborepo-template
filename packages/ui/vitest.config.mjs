import react from "@vitejs/plugin-react";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import("vitest/config").ViteUserConfig} */
const config = {
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setupBeforeEnv.ts", "./src/test/setup.tsx"],
    include: ["**/*.test.{ts,tsx}"],
    globals: true
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@repo/ui": resolve(__dirname, "../../packages/ui/src"),
      setupTests: resolve(__dirname, "./src/test/setup.tsx")
    }
  }
};

export default config;
