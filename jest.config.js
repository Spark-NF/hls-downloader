module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",

    testMatch: [
        "**/?(*.)+(spec|test).ts"
    ],

    coverageReporters: [
        "lcovonly",
        "html",
    ],

    collectCoverageFrom: [
        "src/**/*.ts",
    ],

    transform: {
        "^.+.tsx?$": [
            "ts-jest",
            {
                diagnostics: false,
                tsconfig: "tsconfig.json"
            }
        ],
    }
};