import type { Config } from 'tailwindcss'

const transportModes = {
    metro: 'var(--metro-color)',
    bus: 'var(--bus-color)',
    tram: 'var(--tram-color)',
    rail: 'var(--rail-color)',
    air: 'var(--air-color)',
    funicular: 'var(--funicular-color)',
    cableway: 'var(--cableway-color)',
    coach: 'var(--coach-color)',
    lift: 'var(--lift-color)',
    monorail: 'var(--monorail-color)',
    trolleybus: 'var(--trolleybus-color)',
    unknown: 'var(--unknown-color)',
    water: 'var(--water-color)',
}

module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        container: {
            padding: '2rem',
        },
        extend: {
            colors: {
                'base-primary': 'var(--main-background-color)',
                'base-secondary': 'var(--secondary-background-color)',
                'base-tertiary': 'var(--tertiary-background-color)',
                primary: 'var(--main-text-color)',
                secondary: 'var(--secondary-text-color)',
                tertiary: 'var(--tertiary-text-color)',
                error: 'var(--error-color)',
                success: 'var(--success-color)',
                warning: 'var(--warning-color)',
                highlight: 'var(--highlight-text-color)',
                'estimated-time': 'var(--estimated-time-color)',
                ...transportModes,
            },
            borderRadius: {
                DEFAULT: '0.5em',
            },
            fontSize: {
                'em-text-xs': '0.5625em',
                'em-text-sm': '0.7em',
                'em-text-base': '1em',
                'em-text-lg': '1.3em',
            },
        },
    },
    safelist: Object.keys(transportModes).map((key) => `bg-${key}`),
    plugins: [],
} satisfies Config
