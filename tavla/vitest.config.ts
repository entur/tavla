import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
    resolve: {
        alias: {
            app: path.resolve(__dirname, 'app'),
            src: path.resolve(__dirname, 'src'),
            types: path.resolve(__dirname, 'src/types'),
            utils: path.resolve(__dirname, 'src/utils'),
        },
    },
    test: {
        environment: 'node',
        include: ['app/**/*.test.ts', 'src/**/*.test.ts'],
    },
})
