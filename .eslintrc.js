module.exports = {
  "parser": "@typescript-eslint/parser",
  "settings": {
    "react": {
      "version": "latest"
    }
  },
  "env": {
    "browser": true,
    "es6": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "react/display-name": "off",
    "no-console": [
      process.env.NODE_ENV === 'production' ? "error" : "warn",
      {
        "allow": [
          "warn",
          "error"
        ]
      }
    ],
    "no-debugger": process.env.NODE_ENV === 'production' ? "error" : "warn",
    "semi": [
      "error",
      "never",
      {
        "beforeStatementContinuationChars": "never"
      }
    ],
    "@typescript-eslint/member-delimiter-style": "off",
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/ban-ts-ignore": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "args": "after-used",
        "argsIgnorePattern": "^_"
      }
    ]
  }
}