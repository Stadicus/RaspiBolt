import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import tseslint from '@typescript-eslint/eslint-plugin';
import * as mdx from 'eslint-plugin-mdx';

const eslintConfig = defineConfig([
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    '.source/**',
    '.claude/**',
    'node_modules/**',
  ]),
  ...nextVitals,
  {
    plugins: {
      '@typescript-eslint': tseslint,
    },
  },
  {
    ...mdx.flat,
    files: ['**/*.mdx'],
    rules: {
      ...mdx.flat.rules,
    },
  },
  {
    ...mdx.flatCodeBlocks,
    files: ['**/*.mdx'],
  },
]);

export default eslintConfig;
