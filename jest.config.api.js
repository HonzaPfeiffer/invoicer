/** @type {import('jest').Config} */
module.exports = {
  displayName: 'API Integration Tests',
  testEnvironment: 'node',
  preset: 'ts-jest',
  testMatch: ['**/tests/api/**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/api/setup.ts'],
  collectCoverageFrom: [
    'src/app/api/**/*.ts',
    '!src/app/api/**/route.ts',
  ],
  coverageDirectory: 'coverage/api',
  coverageReporters: ['text', 'lcov', 'html'],
  testTimeout: 30000,
  verbose: true,
};
