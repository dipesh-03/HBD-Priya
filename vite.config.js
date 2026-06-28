import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
export default defineConfig({
    plugins: [react()],
    base: "/HBD-Priya/",
    test: {
        pool: 'threads',
        fileParallelism: false,
        maxWorkers: 1,
        environment: "jsdom",
        setupFiles: "./src/setupTests.ts"
    }
});
