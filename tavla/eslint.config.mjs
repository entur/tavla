import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import prettierConfig from 'eslint-config-prettier/flat'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
})

const config = [
    {
        ignores: [
            '.next/*',
            'src/types/graphql/*',
            'migrations/*',
            'firebaseFunctions/*',
            'graphql-tools/*',
            'public/*',
            'python-venv/*',
            'next-env.d.ts',
        ],
    },

    /* 
    Next.js presets via FlatCompat (includes react, react-hooks, import,typescript-eslint/recommended, and @next/next rules).
    jsx-a11y/recommended extends the 6 rules in next/core-web-vitals to thel ~30-rule recommended set.
    */
    ...compat.extends(
        'next/core-web-vitals',
        'next/typescript',
        'plugin:jsx-a11y/recommended',
    ),

    // Disables rules that conflict with Prettier (must be last preset)
    prettierConfig,

    // Project-specific overrides
    {
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
        },
    },
]

export default config
