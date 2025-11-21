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
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        fetch: 'readonly',
        FormData: 'readonly',
        URL: 'readonly',
        performance: 'readonly',
        process: 'readonly',
        Image: 'readonly',
      },
    },
    plugins: { react: reactPlugin },
    rules: {
      'react/react-in-jsx-scope': 'off',
      // Ensure variables used in JSX are marked as used
      'react/jsx-uses-react': 'warn',
      'react/jsx-uses-vars': 'warn',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
    settings: {
      react: { version: 'detect' },
    },
  },
  {
    // Node.js environment for scripts and api directories
    files: ['scripts/**/*.js', 'api/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        Buffer: 'readonly',
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        setTimeout: 'readonly',
      },
    },
  },
  {
    // Browser environment for monitoring and hooks
    files: ['src/lib/**/*.js', 'src/hooks/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        performance: 'readonly',
        setTimeout: 'readonly',
        dataLayer: 'writable',
      },
    },
  },
  {
    // Test environment
    files: ['tests/**/*.js', 'tests/**/*.jsx'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        beforeEach: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        vi: 'readonly',
      },
    },
  },
  {
    ignores: ['dist/**'],
  },
];
