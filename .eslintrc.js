// https://typescript-eslint.io/docs/linting/
module.exports = {
  extends: ['plugin:prettier/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    // 'react'
    ],
  settings: {
    'import/extensions': ['.js', '.ts', '.tsx'],
    // 'import/resolver': {
    //   typescript: {
    //     project: ['./apps/*/tsconfig.json', './packages/*/tsconfig.json'],
    //   },
    // },
  },
  parserOptions: {
    project: ['./apps/*/tsconfig.json', './packages/*/tsconfig.json'],
  },
  rules: {
    /* eslint */
    'no-console': 'error',
    'max-lines': ['warn', { max: 600, skipComments: true }],
    'no-param-reassign': ['warn', { props: true }],
    /* TypeScript any类型相关规则, 原则上禁用any, 渐进式采用, 先把相关规则都设为warn */
    '@typescript-eslint/no-redeclare': 'off',
    '@typescript-eslint/consistent-type-imports': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn', // 禁止显式 any
    '@typescript-eslint/no-unsafe-argument': 'warn',
    '@typescript-eslint/no-unsafe-assignment': 'warn',
    '@typescript-eslint/no-unsafe-call': 'warn',
    '@typescript-eslint/no-unsafe-member-access': 'warn',
    '@typescript-eslint/no-unsafe-return': 'warn',
    /* react */

    // 'react/no-deprecated': 'warn',
    // 'react/no-unstable-nested-components': 'warn',
    // 'react/jsx-no-constructed-context-values': 'warn',
    // 'react/hook-use-state': ['warn', { allowDestructuredState: true }],
    // 'react/destructuring-assignment': ['warn', 'always', { ignoreClassFields: true, destructureInSignature: 'always' }],
    // 'react/jsx-curly-brace-presence': ['warn', 'never'],
    // 'react/jsx-no-bind': [
    //   'warn',
    //   { ignoreRefs: true, allowFunctions: true, allowArrowFunctions: true, allowBind: false },
    // ],
    // 'react/jsx-no-useless-fragment': 'warn',
    // 'react/jsx-pascal-case': 'warn',
    // 'react/jsx-props-no-spread-multi': 'warn',
    // 'react/no-array-index-key': 'warn',
    // 'react/no-multi-comp': 'warn',
    // 'react/no-object-type-as-default-prop': 'warn',
    // 'react/self-closing-comp': 'warn',

    // /* react Hooks 规则 */
    // 'react-hooks/rules-of-hooks': 'error',
    // 'react-hooks/exhaustive-deps': 'warn',
  },
};
