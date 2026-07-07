import { getSeedBoardId } from './fixtures'
import { expect, test } from './test'

test('editing a board title persists after reload', async ({ page }) => {
    const boardId = getSeedBoardId()
    const newTitle = `Renamed by E2E ${Date.now()}`

    await page.goto(`/tavler/${boardId}/rediger`)

    const titleInput = page.getByRole('textbox', { name: 'Navn på tavlen' })
    await expect(titleInput).toHaveValue('E2E seed board')

    await titleInput.fill(newTitle)

    const saveResponse = page.waitForResponse(
        (res) => res.request().method() === 'POST' && res.status() === 200,
    )
    await page.keyboard.press('Tab')
    await saveResponse

    await page.reload()
    await expect(
        page.getByRole('textbox', { name: 'Navn på tavlen' }),
    ).toHaveValue(newTitle)
})
