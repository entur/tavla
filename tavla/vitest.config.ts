import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        // Rene enhetstester av utils — trenger ikke DOM. FormData er global i Node 18+.
        environment: 'node',
        include: ['app/**/*.test.ts', 'src/**/*.test.ts'],
    },
})
