import js from '@eslint/js'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import prettier from 'eslint-plugin-prettier'
import react from 'eslint-plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
// Ensure compatibility with older plugins/configs
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
})

export default [
    {
        ignores: ['src/types/graphql/*', 'migrations/*'],
    },
    ...compat.extends(
        'next/core-web-vitals',
        'next/typescript',
        'plugin:@typescript-eslint/recommended',
        'prettier',
    ),
    {
        plugins: {
            '@typescript-eslint': typescriptEslint,
            prettier,
            react,
        },

        languageOptions: {
            parser: tsParser,
            ecmaVersion: 'latest',
            sourceType: 'module',

            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },

        rules: {
            'no-unused-vars': 'off',
            'no-console': 'warn',

            'react/jsx-curly-brace-presence': [
                'warn',
                {
                    props: 'never',
                    children: 'never',
                },
            ],

            '@typescript-eslint/no-unused-vars': 'warn',
            'prettier/prettier': 'warn',
        },
    },
]
