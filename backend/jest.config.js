module.exports = {
  reporters: [
    "default",
    ["jest-junit", { outputDirectory: "./reports", outputName: "junit.xml" }]
  ],
  collectCoverage: true,
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules/"],
};