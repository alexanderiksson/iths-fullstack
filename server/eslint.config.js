import eslintPluginTs from "@typescript-eslint/eslint-plugin";
import parserTs from "@typescript-eslint/parser";

export default [
    {
        files: ["**/*.ts"],
        ignores: ["dist/**", "node_modules/**"],
        languageOptions: {
            parser: parserTs,
            ecmaVersion: "latest",
            sourceType: "module",
        },
        plugins: {
            "@typescript-eslint": eslintPluginTs,
        },
        rules: {
            semi: ["error", "always"],
            quotes: ["error", "double"],
            ...eslintPluginTs.configs.recommended.rules,
        },
    },
];
