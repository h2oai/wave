module.exports = {
  roots: ["<rootDir>/src"],
  globals: {
    "IFRAME_URL": "http://localhost:3000",
    "BASENAME": ""
  },
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
  },
  setupFilesAfterEnv: [
    "<rootDir>/src/setupTests.ts"
  ],
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@static/(.*)\\.(css|jpg|png|svg)$": "<rootDir>/empty.test.assets.js",
    "^@static/(.*)$": "<rootDir>/static/$1",
    "monaco-editor": "<rootDir>/__mocks__/monaco-editor.js"
  }
}