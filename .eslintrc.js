module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'arrow-parens': 0,
    'no-multi-spaces': 0,
    "no-new": 0,
    "indent": ["error", 4, {"SwitchCase": 1}],
    // allow async-await
    'generator-star-spacing': 0,
    'comma-dangle': ['error', {
      'arrays': 'never',
      'objects': 'always',
      'imports': 'never',
      'exports': 'never',
      'functions': 'ignore'
    }],
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
