import { test as base, expect } from '@playwright/test'

const test = base.extend({
    page: async ({ page }, use) => {
        await page.route('**/web.cmp.usercentrics.eu/**', (route) =>
            route.abort(),
        )
        await use(page)
    },
})

export { expect, test }
