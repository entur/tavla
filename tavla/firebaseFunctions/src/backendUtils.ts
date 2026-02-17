import { getRuntimeConfig } from './config'
import { BACKEND_KEY } from './config/secretParams'

type SingleActiveBoardFromRedis = {
    bid: string
    tid: string
    browser: string
    screen_width: number
    screen_height: number
}

type ActiveBoardsFromRedis = {
    count: number
    clients: SingleActiveBoardFromRedis[]
}

export async function getActiveBoardsFromRedis() {
    const { apiBaseUrl } = getRuntimeConfig()
    const activeBoards = (await fetch(`${apiBaseUrl}/heartbeat/active`, {
        headers: {
            Authorization: `Bearer ${BACKEND_KEY.value()}`,
        },
    }).then((res) => res.json())) as ActiveBoardsFromRedis
    return activeBoards
}
