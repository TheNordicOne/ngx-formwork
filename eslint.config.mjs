import eslint from '@eslint/js';
import { configs as ngConfigs, processInlineTemplates } from 'angular-eslint';
import prettierConfig from 'eslint-config-prettier';
import { configs as jsoncConfigs } from 'eslint-plugin-jsonc';
import globals from 'globals';
import { config, configs as tsConfigs } from 'typescript-eslint';
import boundaries from 'eslint-plugin-boundaries';
import jasminePlugin from 'eslint-plugin-jasmine';

export default config(
  { ignores: ['.angular/*', 'dist/*'] },
  {
    name: 'JavaScript',
    files: ['**/*.js'],
    extends: [eslint.configs.recommended, prettierConfig],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {},
  },
  {
    name: 'TypeScript',
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tsConfigs.strictTypeChecked,
      ...tsConfigs.stylisticTypeChecked,
      ...ngConfigs.tsAll,
      prettierConfig,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    processor: processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'ngxfw',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'ngxfw',
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/prefer-on-push-component-change-detection': 'off',
      '@typescript-eslint/no-explicit-any': ['error', { fixToUnknown: true }],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'TSEnumDeclaration',
          message: "Enums are forbidden. Use an Object with 'as const' instead",
        },
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'interface',
          format: ['PascalCase'],
          custom: {
            regex: '^I[A-Z]',
            match: false,
          },
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
          custom: {
            regex: '^T[A-Z]',
            match: false,
          },
        },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/unbound-method': [
        'error',
        {
          ignoreStatic: true,
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { ignoreRestSiblings: true },
      ],
      '@angular-eslint/use-injectable-provided-in': 'off',
    },
  },
  {
    name: 'HTML',
    files: ['**/*.html'],
    extends: [...ngConfigs.templateAll, ...ngConfigs.templateAccessibility],
    rules: {
      '@angular-eslint/template/i18n': 'off',
      // Turning this off to be able to use signals
      // There currently is no way to differentiate between a signal and a function call, other thant adding prefixes or suffixes      "@angular-eslint/template/no-call-expression": "off",
    },
  },
  {
    files: ['src/**/*.spec.ts'],
    extends: [jasminePlugin.configs.recommended, prettierConfig],
    languageOptions: {
      globals: {
        ...globals.jasmine,
      },
    },
    plugins: { jasmine: jasminePlugin },
    rules: {},
  },
  {
    name: 'Angular',
    files: ['**/*.component.ts'],
    rules: {
      '@typescript-eslint/no-extraneous-class': 'off',
    },
  },
  {
    name: 'json',
    files: ['**/*.json'],
    extends: [
      ...jsoncConfigs['flat/recommended-with-jsonc'],
      ...jsoncConfigs['flat/prettier'],
    ],
    rules: {},
  },
  {
    name: 'Boundaries',
    plugins: {
      boundaries,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
      'boundaries/dependency-nodes': ['import', 'dynamic-import'],
      'boundaries/include': ['projects/**/lib/**/*'],
      'boundaries/elements': [
        {
          type: 'shared',
          mode: 'full',
          pattern: [
            'projects/**/lib/shared/**/*',
            'projects/**/lib/tokens/**/*',
            'projects/**/lib/types/**/*',
          ],
        },
        {
          type: 'feature',
          mode: 'full',
          capture: ['lib', 'featureName'],
          pattern: ['projects/**/lib/features/*/**/*'],
        },
        {
          type: 'core',
          mode: 'full',
          pattern: ['projects/**/lib/core/**/*'],
        },
        {
          type: 'root',
          mode: 'full',
          pattern: ['projects/**/lib/*'],
        },
        {
          type: 'index',
          mode: 'file',
          pattern: ['index.ts'],
        },
      ],
    },
    rules: {
      'boundaries/no-unknown': ['error'],
      'boundaries/no-unknown-files': ['error'],
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            {
              from: ['shared'],
              allow: ['shared'],
            },
            {
              from: ['feature'],
              allow: [
                'shared',
                ['feature', { featureName: '${from.featureName}' }],
              ],
            },
            {
              from: ['core'],
              allow: ['shared'],
            },
            {
              from: ['root'],
              allow: ['root', 'core', 'feature', 'shared'],
            },
          ],
        },
      ],
    },
  },
);
