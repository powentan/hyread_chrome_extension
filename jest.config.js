module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  moduleDirectories: ['src', 'node_modules'],
  moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/src/$1.ts"
  },
  transformIgnorePatterns: ['options_vue.ts'],
  collectCoverageFrom: [
    "src/**/*.ts"
  ]
};
