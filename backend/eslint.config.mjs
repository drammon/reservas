import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: ["eslint.config.mjs"]
  },

  // Backend Node.js
  {
    files: ["**/*.js"],

    plugins: {
      js
    },

    extends: ["js/recommended"],

    languageOptions: {
      sourceType: "commonjs",

      globals: {
        ...globals.node
      }
    },

    rules: {
      "no-unused-vars": "warn"
    }
  },

  // Jest tests
  {
    files: ["tests/**/*.js"],

    languageOptions: {
      globals: {
        ...globals.jest
      }
    }
  }
]);