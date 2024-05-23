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
                tooltip: 'var(--tooltip-color)',
                'tooltip-text': 'var(--tooltip-text-color)',
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
            spacing: {
                'em-0.25': '0.25em',
                'em-0.5': '0.5em',
                'em-0.75': '0.75em',
                'em-1': '1em',
                'em-2': '2em',
                'em-3': '3em',
            },
            gridTemplateColumns: {
                'auto-fit-minmax': 'repeat(auto-fit, minmax(60vmin, 1fr))',
            },
            animation: {
                'ping-slow': 'ping 8s  infinite',
            },
            keyframes: {
                ping: {
                    '0%,75%': {
                        transform: 'scale(1)',
                        opacity: '1',
                    },
                    '100%': {
                        transform: 'scale(2)',
                        opacity: '0',
                    },
                },
            },
        },
    },
    safelist: Object.keys(transportModes).map((key) => `bg-${key}`),
    plugins: [],
} satisfies Config
