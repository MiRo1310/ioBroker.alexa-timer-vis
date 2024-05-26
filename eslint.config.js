module.exports = {
  ignores: ["./node_modules/", "./.dev-server/"],
  files: ["./main.js"],
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
