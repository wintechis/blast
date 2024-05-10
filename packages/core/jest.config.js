/**  @type {import('@jest/types').Config.ProjectConfig} */
const config = {
  transform: {
    "\\.[jt]sx?$": "ts-jest",
  },
  moduleNameMapper: {
    "(.+)\\.js": "$1"
  },
  extensionsToTreatAsEsm: [".ts"],
  collectCoverageFrom: [
    "src/**/*.{js,ts}"
  ],
  preset: "ts-jest/presets/js-with-ts",
  testEnvironment: "node",
  transform: {
    "node_modules/variables/.+\\.(j|t)sx?$": ["ts-jest", { "useESM": true }]
  },
  transformIgnorePatterns: [
    "node_modules/(?!variables/.*)"
  ]
};

export default config;
