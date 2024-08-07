module.exports = {
  files: ["./main.js"],
  ignores: [
    "main.test.js",
    "**/test/**",
    "**/lib/tools.js",
    "**/.dev-server/**",
    "**/admin/**",
    "**/node_modules/**",
  ],
  languageOptions: {
    ecmaVersion: 2018,
    globals: {
      es6: true,
      node: true,
      mocha: true,
    },
  },
  rules: {
    indent: ["error", 2, { SwitchCase: 1 }],
    "no-console": "off",
    "no-var": "error",
    "no-trailing-spaces": "error",
    "prefer-const": "error",
    quotes: [
      "error",
      "double",
      {
        avoidEscape: true,
        allowTemplateLiterals: true,
      },
    ],
    semi: ["error", "always"],
  },
};
