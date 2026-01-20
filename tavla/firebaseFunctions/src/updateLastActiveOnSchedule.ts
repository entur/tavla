import * as admin from 'firebase-admin'
import { getRuntimeConfig } from './config'
import { BACKEND_KEY } from './config/secretParams'
import { scheduledFunction } from './functions'

admin.initializeApp()

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

function getBoardsCollection() {
    return admin.firestore().collection('boards')
}

async function getActiveBoardsFromRedis() {
    const { apiBaseUrl } = getRuntimeConfig()
    const activeBoards = (await fetch(`${apiBaseUrl}/heartbeat/active`, {
        headers: {
            Authorization: `Bearer ${BACKEND_KEY.value()}`,
        },
    }).then((res) => res.json())) as ActiveBoardsFromRedis
    return activeBoards
}

export const updateLastActiveOnSchedule = scheduledFunction(
    '0 */6 * * *',
    undefined,
    async () => {
        const activeBoards = await getActiveBoardsFromRedis()
        const boardsCollection = getBoardsCollection()

        let successCount = 0

        const updatePromises = activeBoards.clients.map(async (client) => {
            try {
                await boardsCollection.doc(client.bid).update({
                    'meta.lastActiveTimestamp': Date.now(),
                })
                successCount++
            } catch (error) {
                console.log(
                    `Could not set lastActiveTimeStamp. Board ${client.bid} does not exist in database`,
                )
            }
        })

        await Promise.all(updatePromises)

        console.log(
            `Updated lastActive for ${successCount} boards at ${new Date().toISOString()}`,
        )
        console.log(`Total active boards from Redis: ${activeBoards.count}`)
    },
)
