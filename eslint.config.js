import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  { ignores: ['build', 'dist', 'node_modules'] },
  js.configs.recommended,
  ...tsPlugin.configs['flat/recommended'],
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      // TypeScript already reports undefined identifiers.
      'no-undef': 'off',
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
];
