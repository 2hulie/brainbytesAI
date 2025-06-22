// eslint.config.js
import js from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import jestPlugin from "eslint-plugin-jest";
import babelParser from "@babel/eslint-parser";

// Define constants before the export
const jestSettings = {
  version: 29, // Explicitly set Jest version
};

export default [
  // 1) Base ignore (you can still keep your ignores array if you want)
  //    but the .eslintignore file is the primary way to exclude unwanted files.
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/coverage/**",
      "**/*.md",
      "**/*.yml",
      "**/*.yaml",
      "**/*.css",
      "**/*.scss",
      "**/*.sass",
      "**/*.html",
      "**/*.json",
      "**/Dockerfile",
      "**/.github/**/*.yml",
      // You can list more here if you prefer the flat config approach
    ],
  },

  // 2) Backend (Node/CommonJS)
  {
    // Lint only JS/TS files in backend (excluding .test files)
    files: [
      "backend/**/*.{js,ts}",
      "!backend/**/*.test.{js,ts}",
      "!backend/**/*.mjs",
    ],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        require: "readonly",
        module: "readonly",
        exports: "readonly",
        process: "readonly",
        console: "readonly",
        setTimeout: "readonly",
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-console": "off",
    },
  },

  // 3) Backend tests with Jest
  {
    // Only .test.js or .test.ts in backend and all backend mocks
    files: [
      "backend/**/*.test.{js,ts}",
      "backend/**/*.mjs",
      "backend/__mocks__/**/*.js",
    ],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        require: "readonly",
        describe: "readonly",
        test: "readonly",
        expect: "readonly",
        jest: "readonly",
        beforeAll: "readonly",
        beforeEach: "readonly",
        afterAll: "readonly",
        afterEach: "readonly",
      },
    },
    plugins: { jest: jestPlugin },
    rules: {
      ...js.configs.recommended.rules,
      ...jestPlugin.configs.recommended.rules,
    },
  },

  // 4) Frontend (React, ES Modules)
  {
    files: ["frontend/**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ["@babel/preset-react"],
        },
      },
      globals: {
        window: "readonly",
        document: "readonly",
        localStorage: "readonly",
        setTimeout: "readonly",
      },
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      "no-unused-vars": "warn",
      "no-console": "warn",
      "react/react-in-jsx-scope": "off",
    },
  },

  {
    // Frontend tests with Jest
    files: [
      "frontend/**/*.test.{js,jsx,ts,tsx}",
      "frontend/__tests__/**/*.{js,jsx,ts,tsx}",
    ],
    settings: {
      jest: jestSettings,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ["@babel/preset-react"],
        },
      },
      globals: {
        jest: "readonly",
        describe: "readonly",
        test: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
      },
    },
    plugins: {
      react: reactPlugin,
      jest: jestPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...jestPlugin.configs.recommended.rules,
      "no-undef": "error",
    },
  },

  // Cypress tests
  {
    files: ["frontend/cypress/**/*.spec.{js,ts}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        describe: "readonly",
        it: "readonly",
        cy: "readonly",
      },
    },
    rules: {
      ...js.configs.recommended.rules,
    },
  },
];
