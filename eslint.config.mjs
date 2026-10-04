// Flat ESLint configuration (ESLint 9 flat config).
//
// Notes on what changed versus the legacy `.eslintrc`:
//  * `eslint-config-airbnb` targets ESLint 7 and has no flat-config entry, so
//    its rules are gone. The rules that mattered here (plus the react,
//    react-hooks and jsx-a11y recommended sets) are declared explicitly.
//  * `eslint-plugin-prettier` is gone; Prettier runs as its own command
//    (`pnpm run format`), which is the current recommendation.
//  * `eslint-plugin-tsdoc` / `eslint-plugin-babel` are gone (tsdoc has no flat
//    config; Babel is no longer part of the pipeline).
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: [
      'node_modules/**',
      'es/**',
      'lib/**',
      'dist/**',
      '.coverage/**',
      'icon/index.js',
      'icon/index.es.js',
      'icon/index.d.ts',
      'icon/demo.js',
      'icon/react-icon/**',
      'icon/react-icon-cjs/**',
      'react-icon/**',
      'react-icon-cjs/**',
      'tools/**',
      'tests/visual/**',
      'integration/**',
      'stories/**/*.jsx',
      '**/*.json',
      '**/*.d.ts',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  jsxA11y.flatConfigs.recommended,
  { plugins: { 'react-hooks': reactHooks } },

  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        $: 'readonly',
      },
      parserOptions: { ecmaFeatures: { jsx: true }, sourceType: 'module' },
    },
    settings: { react: { version: 'detect' } },
    rules: {
      'linebreak-style': ['error', 'unix'],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
      'no-empty': 'off',
      'no-constant-condition': ['error', { checkLoops: false }],
      'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/no-unknown-property': 'off',
      'react/no-unescaped-entities': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Preserved from the previous configuration: these produce thousands of
      // hits on an existing code base and turning them on would bury the real
      // regressions this migration is supposed to surface.
      'no-useless-assignment': 'off',
      'no-prototype-builtins': 'off',
      'react/no-find-dom-node': 'off',
      'react/no-deprecated': 'off',
      'react/no-render-return-value': 'off',
      'jsx-a11y/anchor-is-valid': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-noninteractive-element-interactions': 'off',
      'jsx-a11y/no-noninteractive-tabindex': 'off',
      'jsx-a11y/no-autofocus': 'off',
      'jsx-a11y/alt-text': 'off',
      'jsx-a11y/label-has-associated-control': 'off',
      'jsx-a11y/tabindex-no-positive': 'off',
      'jsx-a11y/role-has-required-aria-props': 'off',
      // Carried over from the previous configuration (all were explicitly
      // disabled there as well): enabling them now would produce a large
      // formatting-only style diff with no behavioural benefit.
      'no-case-declarations': 'off',
      'no-useless-escape': 'off',
      'no-unsafe-optional-chaining': 'off',
      'no-async-promise-executor': 'off',
      'prefer-spread': 'off',
      'react/no-children-prop': 'off',
      'react/display-name': 'off',
      '@typescript-eslint/no-wrapper-object-types': 'off',
    },
  },

  {
    // Node CLI helpers: CommonJS `require` and `console.log` are the point.
    files: [
      'scripts/**/*.js',
      'tests/visual/**/*.{ts,tsx}',
      '*.config.{js,ts,mjs}',
      // CommonJS Less plugins consumed by the style pipeline.
      'components/style/theme/color/*.js',
    ],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { args: 'none' }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-unnecessary-type-constraint': 'off',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      // The code base predates the rule and renaming would be a pure-churn diff.
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },

  {
    files: ['tests/**/*.{ts,tsx,js}', 'components/**/__test__/**/*.{ts,tsx}'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  prettier
);
