import js from "@eslint/js";
import vitest from "@vitest/eslint-plugin";
import prettier from "eslint-config-prettier/flat";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";

export default defineConfig([
  globalIgnores(["dist/"]),
  js.configs.recommended,
  {
    files: ["src/**/*.js"],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ["*.config.js", "scripts/**/*.js"],
    languageOptions: { globals: globals.node },
  },
  {
    // Tests run in Node with jsdom, so they use both sets of globals.
    files: ["tests/**/*.js"],
    ...vitest.configs.recommended,
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
    rules: {
      ...vitest.configs.recommended.rules,
      // Vitest's expect() takes an optional message as its second argument.
      "vitest/valid-expect": ["error", { maxArgs: 2 }],
    },
  },
  // Last, so it turns off any rule that conflicts with Prettier.
  prettier,
]);
