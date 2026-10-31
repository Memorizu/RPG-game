
module.exports = {
  testEnvironment: 'node',

  transform: {
    '^.+\\.js$': 'babel-jest',
  },

  testMatch: [
    '**/tests/**/*.test.js',
  ],

  moduleNameMapper: {
    '\\.(png|jpe?g|gif|svg|webp|ico)$':
      '<rootDir>/tests/fileMock.js',
  },

  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js',
  ],
};
