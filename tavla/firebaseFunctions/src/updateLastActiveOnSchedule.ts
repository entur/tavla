import * as admin from 'firebase-admin'
import { getActiveBoardsFromRedis } from './backendUtils'
import { scheduledFunction } from './functions'

admin.initializeApp()

export const updateLastActiveOnSchedule = scheduledFunction(
    '0 */6 * * *',
    undefined,
    async () => {
        const activeBoards = await getActiveBoardsFromRedis()
        const boardsCollection = admin.firestore().collection('boards')

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
