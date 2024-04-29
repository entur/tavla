/** @type {import('tailwindcss').Config} */
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
                alpha: 'var(--main-background-color)',
                beta: 'var(--secondary-background-color)',
                omega: 'var(--tertiary-background-color)',
                warning: 'var(--warning-color)',
            },
            borderRadius: {
                DEFAULT: '0.5em',
            },
        },
    },
    plugins: [],
}
