import { createTestBoard } from './fixtures'
import { expect, test } from './test'

test('editing a board title persists after reload', async ({ page }) => {
    const boardId = await createTestBoard('E2E board-edit board')
    const newTitle = `Renamed by E2E ${Date.now()}`

    await page.goto(`/tavler/${boardId}/rediger`)

    const titleInput = page.getByRole('textbox', { name: 'Navn på tavlen' })
    await titleInput.fill(newTitle)

    // Match on the response body, not just any 200 POST — the settings form
    // re-submits on every field's change/blur, so a different field's save
    // could otherwise be mistaken for this one.
    const saveResponse = page.waitForResponse(
        async (res) =>
            res.request().method() === 'POST' &&
            res.status() === 200 &&
            (res.request().postData() ?? '').includes(newTitle),
    )
    await page.keyboard.press('Tab')
    await saveResponse

    await page.reload()
    await expect(titleInput).toHaveValue(newTitle)
})
