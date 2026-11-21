module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  setupFiles: ["<rootDir>/src/test/polyfills.js"],
  setupFilesAfterEnv: ["<rootDir>/src/test/setup.js"],
  moduleFileExtensions: ["js", "jsx"],
  testMatch: ["<rootDir>/src/**/*.test.jsx", "<rootDir>/src/**/*.test.js", "<rootDir>/src/**/*.test.mjs"],
};
