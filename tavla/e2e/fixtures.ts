import { readFileSync } from 'node:fs'
import path from 'node:path'

export const TEST_USER = {
    email: 'e2e@tavla.test',
    password: 'e2etestpassword',
} as const

export function getSeedBoardId(): string {
    // Playwright global setup runs in a separate process from the test workers,
    // so in-memory globals cannot be used to share the generated seed board ID.
    // The seed file is a cross-process handoff for data created during setup.
    const seedPath = path.join(__dirname, '.auth', 'seed.json')
    const { boardId } = JSON.parse(readFileSync(seedPath, 'utf8'))
    return boardId
}
