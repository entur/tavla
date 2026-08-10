import { expect, test } from './test'

test('creating a board writes to Firestore and lands on the edit page', async ({
    page,
}) => {
    const boardName = `E2E board ${Date.now()}`

    await page.goto('/oversikt')

    await page
        .getByRole('button', { name: 'Opprett tavle', exact: true })
        .click()

    const nameInput = page.locator('input[name="name"]')
    await expect(nameInput).toBeVisible()
    await nameInput.fill(boardName)

    await page
        .getByRole('button', { name: 'Opprett tavle', exact: true })
        .last()
        .click()

    await page.waitForURL(/\/tavler\/[^/]+\/rediger/)
    await expect(
        page.getByRole('textbox', { name: 'Navn på tavlen' }),
    ).toHaveValue(boardName)
})
