module.exports = {
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
        "@typescript-eslint/explicit-function-return-type": ["warn", { allowExpressions: true }],
        "@typescript-eslint/interface-name-prefix": ["error", { "prefixWithI": "always" }],
        "@typescript-eslint/no-non-null-assertion": "off",
        "indent": ["error"]
    },
    "overrides": [
        {
            "files": ["test/**/*"],
            "env": {
                "jest": true,
            },
            "rules": {
                "@typescript-eslint/no-explicit-any": "off",
            }
        }
    ]
};
