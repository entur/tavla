import { defineConfig } from 'cypress'

export default defineConfig({
    component: {
        devServer: {
            framework: 'next',
            bundler: 'webpack',
        },
        viewportHeight: 1080,
        viewportWidth: 1920,
    },
})
