import { readFileSync } from 'node:fs'
import path from 'node:path'

export const TEST_USER = {
    email: 'e2e@tavla.test',
    password: 'e2etestpassword',
} as const

export function getSeedBoardId(): string {
    const seedPath = path.join(__dirname, '.auth', 'seed.json')
    const { boardId } = JSON.parse(readFileSync(seedPath, 'utf8'))
    return boardId
}
