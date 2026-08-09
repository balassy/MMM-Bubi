import { defineConfig } from "eslint/config";
import globals from "globals";

export default defineConfig([
  {
    languageOptions: {
      globals: {
        ...globals.browser
      },

      ecmaVersion: 11,
      sourceType: "module"
    },

    rules: {
      "comma-dangle": ["error", "never"],
      "linebreak-style": ["off"],
      "no-underscore-dangle": ["off"]
    }
  }
]);