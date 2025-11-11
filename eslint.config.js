import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint' 
import prettier from 'eslint-plugin-prettier'
import eslintConfigPrettier from 'eslint-config-prettier'
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintPluginBetterTailwindcss from "eslint-plugin-better-tailwindcss";
import tailwindcss from '@tailwindcss/vite'

import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'vite.config.ts']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [...tseslint.configs.strictTypeChecked, eslintConfigPrettier],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.app.json', './tsconfig.node.json'],
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier: prettier,
      'simple-import-sort': simpleImportSort,
      'better-tailwindcss': eslintPluginBetterTailwindcss,
      tailwindcss: tailwindcss(),
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...eslintPluginBetterTailwindcss.configs["recommended-warn"].rules,
      "@typescript-eslint/ban-ts-comment": "warn",
      "better-tailwindcss/enforce-consistent-line-wrapping": ["warn", { printWidth: 120 }],
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'prettier/prettier': ['error', {}, { usePrettierrc: true }],
      '@typescript-eslint/no-unused-vars': ['warn'],
      "@typescript-eslint/no-unnecessary-type-parameters": "off",
      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            // Packages. `react` related packages come first.
            [
              '^react',
              '^(?!(core|features)$)@?\\w+',
            ],
            // Internal packages.
            [
              '^features.*',
              '^core.*',
            ],
            // Parent imports. Put `..` last.
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            // Other relative imports. Put same-folder imports and `.` last.
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            // Style imports.
            ['^.+\\.s?css$'],
          ],
        },
      ],
    },
    settings: {
      "better-tailwindcss": {
        entryPoint: "src/content/index.css",
      }
    }
  },
])
