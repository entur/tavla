import {
    getBoard,
    initializeAdminApp,
    setLastActive,
} from 'Admin/utils/firebase'
import { NextApiRequest, NextApiResponse } from 'next'
import { TBoardID } from 'types/settings'

initializeAdminApp()

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {
    const { id } = request.query
    const board = (await getBoard(id as TBoardID)) || undefined
    if (!board) {
        return response.status(404).json({ error: 'Board not found!' })
    }
    const active = board?.meta?.lastActive ?? 0
    const lastActiveDate = new Date(active).getTime()
    if (Date.now() - lastActiveDate > 1000 * 60 * 60 * 24) {
        try {
            await setLastActive(id as TBoardID)
            return response
                .status(200)
                .json({ message: 'Successfully updated!' })
        } catch (error) {
            return response.status(400).json({ error: 'Could not update!' })
        }
    }
}
