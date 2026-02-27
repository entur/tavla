import js from '@eslint/js'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import prettier from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'
import react from 'eslint-plugin-react'
import nextPlugin from '@next/eslint-plugin-next'

export default [
    {
        ignores: [
            'src/types/graphql/*',
            'migrations/*',
            'firebaseFunctions/*',
            'next-env.d.ts',
        ],
    },

    js.configs.recommended,

    ...typescriptEslint.configs['flat/recommended'],

    {
        plugins: {
            '@next/next': nextPlugin,
        },
        rules: {
            ...nextPlugin.configs.recommended.rules,
            ...nextPlugin.configs['core-web-vitals'].rules,
        },
    },

    jsxA11y.flatConfigs.recommended,

    prettierConfig,

    {
        plugins: {
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
