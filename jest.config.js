/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom', // 在 Node.js 中模拟浏览器环境
  moduleNameMapper: {
    '^@hawk-tracker/(.*)$': '<rootDir>/packages/$1/src',
  },
  testMatch: ['**/test/**/*.test.ts'],
};
