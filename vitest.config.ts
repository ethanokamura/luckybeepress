import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    environment: "node",
    include: [
      "__tests__/**/*.test.ts",
      "functions/src/__tests__/**/*.test.ts",
    ],
    coverage: {
      reporter: ["text", "html"],
      include: [
        "lib/firebase-helpers.ts",
        "app/api/admin/**/*.ts",
        "functions/src/index.ts",
      ],
      exclude: ["**/*.d.ts", "**/node_modules/**"],
    },
  },
});
