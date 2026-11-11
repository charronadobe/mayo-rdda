module.exports = {
  root: true,
  extends: 'airbnb-base',
  env: {
    browser: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    allowImportExportEverywhere: true,
    sourceType: 'module',
    requireConfigFile: false,
  },
  rules: {
    'import/extensions': ['error', { js: 'always' }], // require js file extensions in imports
    'linebreak-style': ['error', 'unix'], // enforce unix linebreaks
    'no-param-reassign': [2, { props: false }], // allow modifying properties of param
  },
  overrides: [
    {
      // Document Authoring plugins/apps: Lit components loaded inside da.live
      files: ['tools/**/*.js'],
      rules: {
        // modules come from da.live at runtime (DA SDK, nx components, da-lit import map)
        'import/no-unresolved': ['error', { ignore: ['^https?://', '^da-lit$'] }],
        // Lit convention: underscore-prefixed internal/reactive state and DA SDK fields
        'no-underscore-dangle': 'off',
        // Lit lifecycle and event handlers are class methods that may not use `this`
        'class-methods-use-this': 'off',
        // sequential uploads/requests are intentional (ordering, DA rate limits)
        'no-await-in-loop': 'off',
        'no-continue': 'off',
        'no-restricted-syntax': ['error', 'ForInStatement', 'LabeledStatement', 'WithStatement'],
        // helper modules export named functions that may grow
        'import/prefer-default-export': 'off',
      },
    },
  ],
};
