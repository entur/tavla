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
            backgroundColor: {
                primary: 'var(--main-background-color)',
                secondary: 'var(--secondary-background-color)',
                tertiary: 'var(--tertiary-background-color)',
            },
            colors: {
                background: 'var(--main-background-color)',
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
                sm: '0.2em',
                DEFAULT: '0.5em',
            },
            borderColor: {
                primary: 'var(--divider-color)',
                secondary: 'var(--border-color)',
            },
            fontSize: {
                'em-xs': '0.5625em',
                'em-sm': '0.7em',
                'em-base': '1em',
                'em-lg': '1.3em',
            },
        },
    },
    safelist: Object.keys(transportModes).map((key) => `bg-${key}`),
    plugins: [],
} satisfies Config
