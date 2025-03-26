import baseConfig from './jest.config';

const config = {
    ...baseConfig,
    testMatch: ['**/*.e2e.test.ts'],
    setupFilesAfterEnv: ['<rootDir>/src/tests/e2e/setup.ts'],
};

export default config;