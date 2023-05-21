module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  moduleDirectories: ['src', 'node_modules'],
  // transformIgnorePatterns: ['./node_modules'],
};
