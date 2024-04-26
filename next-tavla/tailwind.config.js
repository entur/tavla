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
                bgPrimary: 'var(--main-background-color)',
                bgSecondary: 'var(--secondary-background-color)',
                bgTertiary: 'var(--tertiary-background-color)',
                warning: 'var(--warning-color)',
            },
            borderRadius: {
                DEFAULT: '0.5em',
            },
        },
    },
    plugins: [],
}
