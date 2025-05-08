// jest.config.js
module.exports = {
    testEnvironment: "jest-environment-jsdom",
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    testMatch: [
        "<rootDir>/src/**/__tests__/**/*.[jt]s?(x)",
        "<rootDir>/src/**/?(*.)+(spec|test).[jt]s?(x)",
    ],
    moduleNameMapper: {
        // Handle CSS imports (if you use them in components)
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",
        // Handle image imports
        "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/__mocks__/fileMock.js",
        // Handle module aliases (if you have them in tsconfig.json)
        "^@/components/(.*)$": "<rootDir>/src/components/$1",
        "^@/lib/(.*)$": "<rootDir>/src/lib/$1",
        "^@/utils/(.*)$": "<rootDir>/src/utils/$1",
        "^@/app/(.*)$": "<rootDir>/src/app/$1",
    },
    transform: {
        "^.+\\.(ts|tsx)$": ["babel-jest", {}],
    },
    collectCoverage: true,
    collectCoverageFrom: [
        "src/**/*.{ts,tsx}",
        "!src/**/*.d.ts",
        "!src/**/index.ts",
        "!src/app/api/auth/[...nextauth]/options.ts",
        "!src/app/layout.tsx",
        "!src/app/providers.tsx",
    ],
    coverageDirectory: "coverage",
    coverageReporters: ["json", "lcov", "text", "clover"],
};
