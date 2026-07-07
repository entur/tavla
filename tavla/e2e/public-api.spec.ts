import { getSeedBoardId } from './fixtures'
import { expect, test } from './test'

test('GET /api/board returns the seeded board without auth', async ({
    request,
}) => {
    const boardId = getSeedBoardId()
    const response = await request.get(`/api/board?id=${boardId}`)

    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body.board.id).toBe(boardId)
    expect(body.board.meta.title).toBe('E2E seed board')
    expect(body.board.isCombinedTiles).toBe(false)
    expect(Array.isArray(body.board.tiles)).toBe(true)
})
