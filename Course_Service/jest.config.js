/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: 'src/TestCases',             // make sure paths resolve inside package
    moduleFileExtensions: ['ts', 'js', 'json'],
    testMatch: ['**/*.test.ts']
};
