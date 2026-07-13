import { TEST_USER } from './fixtures'
import { expect, test } from './test'

test.use({ storageState: { cookies: [], origins: [] } })

test('log in with email and password lands on /oversikt with a session cookie', async ({
    page,
    context,
}) => {
    await page.goto('/?login=email')

    await page.getByLabel('E-post').fill(TEST_USER.email)
    await page.getByLabel('Passord', { exact: true }).fill(TEST_USER.password)
    await page.getByRole('button', { name: 'Logg inn', exact: true }).click()

    await page.waitForURL(/\/oversikt/)

    const cookies = await context.cookies()
    expect(cookies.find((c) => c.name === 'session')?.value).toBeTruthy()
})
