module.exports = {
    preset: "ts-jest",
    testEnvironment: "jest-environment-jsdom",

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

    globals: {
        "ts-jest": {
            diagnostics: false,
            tsConfig: "tsconfig.json"
        }
    }
};