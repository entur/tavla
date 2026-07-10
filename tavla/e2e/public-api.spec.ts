import { createTestBoard } from './fixtures'
import { expect, test } from './test'

test('GET /api/board returns the seeded board without auth', async ({
    request,
}) => {
    const title = 'E2E public-api board'
    const boardId = await createTestBoard(title)
    const response = await request.get(`/api/board?id=${boardId}`)

    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body.board.id).toBe(boardId)
    expect(body.board.meta.title).toBe(title)
    expect(body.board.isCombinedTiles).toBe(false)
    expect(Array.isArray(body.board.tiles)).toBe(true)
})
