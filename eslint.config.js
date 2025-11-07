// ESLint Flat Config for React + Vite project
import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        alert: 'readonly',
        fetch: 'readonly',
        navigator: 'readonly',
        URL: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        sessionStorage: 'readonly',
        localStorage: 'readonly',
        // Node.js globals (for API files)
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
    plugins: { react: reactPlugin },
    rules: {
      'react/react-in-jsx-scope': 'off',
      // Ensure variables used in JSX are marked as used
      'react/jsx-uses-react': 'warn',
      'react/jsx-uses-vars': 'warn',
      // Allow unused parameters (common in React)
      'no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        args: 'after-used' 
      }],
      // Allow case declarations
      'no-case-declarations': 'off',
      // Allow unnecessary try/catch for now
      'no-useless-catch': 'warn',
      // Don't require defined globals (handled above)
      'no-undef': 'error',
    },
    settings: {
      react: { version: 'detect' },
    },
  },
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.git/**'
    ],
  },
];
