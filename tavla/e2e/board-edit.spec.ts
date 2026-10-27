import { createTestBoard } from './fixtures'
import { expect, test } from './test'

test('editing a board title persists after reload', async ({ page }) => {
    const boardId = await createTestBoard('E2E board-edit board')
    const newTitle = `Renamed by E2E ${Date.now()}`

    await page.goto(`/tavler/${boardId}/rediger`)

    await page.getByRole('button', { name: 'Endre navn på tavla' }).click()

    const titleInput = page.getByRole('textbox', { name: 'Navn på tavla' })
    await titleInput.fill(newTitle)

    await page.getByRole('button', { name: 'Bekreft valg' }).click()
    await expect(
        page.getByRole('heading', { level: 1, name: newTitle }),
    ).toBeVisible()

    await page.reload()
    await expect(
        page.getByRole('heading', { level: 1, name: newTitle }),
    ).toBeVisible()
})
