import { dataColors } from './app/(admin)/oversikt/utils'
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
    taxi: 'var(--taxi-color)',
}

module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        container: {
            center: true,
            padding: {
                DEFAULT: '2rem',
                md: '0.5rem',
            },
        },
        extend: {
            backgroundColor: {
                primary: 'var(--main-background-color)',
                secondary: 'var(--secondary-background-color)',
                tertiary: 'var(--tertiary-background-color)',
                contrast: 'var(--contrast-background-color)',
                grey60: 'var(--grey60)',
                grey70: 'var(--grey70)',
                grey80: 'var(--grey80)',
                blue80: 'var(--blue80)',
                blue90: 'var(--blue90)',
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
                ...dataColors,
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
                'em-xl': '1.5em',
                'em-situation': '0.65em',
            },
            lineHeight: {
                'em-xs': '0.5625em',
                'em-sm': '0.7em',
                'em-base': '1.1em',
                'em-lg': '1.3em',
                'em-xl': '1.5em',
                'em-situation': '0.65em',
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
                pulse: 'pulse 3s ease-out infinite',
            },
            keyframes: {
                pulse: {
                    '0%': { transform: 'scale(1)', opacity: '1' },
                    '100%': { transform: 'scale(2.4)', opacity: '0' },
                },
            },
        },
    },
    safelist: Object.keys(transportModes).map((key) => `bg-${key}`),

    plugins: [],
} satisfies Config
