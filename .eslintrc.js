module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    // allow inline styles to facilitate dynamic stying based on some boolean checks
    'react-native/no-inline-styles': 'off',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
  },
};
