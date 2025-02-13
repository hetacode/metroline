module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'security',
  ],
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'plugin:security/recommended',
  ],
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  rules: {
    'max-len': ['error', {
      code: 240,
      tabWidth: 2,
      ignoreTrailingComments: true,
      ignoreComments: true,
    }],
    'consistent-return': 'off',
    'no-nested-ternary': 'off',
    'no-plusplus': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    // disable some rules from parents to avoid problems
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    'arrow-parens': ['error', 'as-needed'],
    'import/prefer-default-export': 'off',
    'object-curly-newline': ['error', {
      'multiline': true,
    }],
    'no-param-reassign': 'off',
    'security/detect-non-literal-fs-filename': 'off',
    'import/order': 'off',
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': ['error'],
    'security/detect-object-injection': 'off',
    'security/detect-non-literal-regexp': 'off',
  },
};
