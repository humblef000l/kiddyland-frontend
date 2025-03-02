const nextJest = require('next/jest');

const createJestConfig = nextJest({
    dir:'./'
})

const customJestConfig = {
    setupFilesAfterEnv:["<rootDir>/jest.setup.ts"],
    testEnvironment:"jsdom",
    moduleNameMapper:{
        "^@/(.*)$": "<rootDir>/src/$1",
        "\\.(css|scss|sass)$": "identity-obj-proxy",
      },
    transform:{
        "^.+\\.(js|jsx|ts|tsx)$": ["@swc/jest"],
    }
}

module.exports = createJestConfig(customJestConfig);