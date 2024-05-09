module.exports = {
    root: true,
    env: {
      node: true,
      "vue/setup-compiler-macros": true,
    },
    extends: [
      "eslint:recommended",
      "@vue/typescript/recommended",
      "plugin:vue/vue3-recommended",
      "plugin:prettier/recommended",
    ],
    parserOptions: {
      ecmaVersion: 2020,
    },
    rules: {
      "prettier/prettier": [
        "error",
        {
          htmlWhitespaceSensitivity: "ignore",
          printWidth: 80,
        },
      ],
    },
  }
  