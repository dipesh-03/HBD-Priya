import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/hbd-priya",
  test: {
    pool: 'threads',
    fileParallelism: false,
    maxWorkers: 1,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts"
  }
});
