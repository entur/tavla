import { verifyUserSession } from 'Admin/utils/auth'
import { initializeAdminApp, setBoard } from 'Admin/utils/firebase'
import { NextApiRequest, NextApiResponse } from 'next'
import { TBoard } from 'types/settings'

initializeAdminApp()

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {
    const user = await verifyUserSession(request)
    if (!user)
        return response.status(401).json({ error: 'You are not logged in.' })

    const board = JSON.parse(request.body).board as TBoard
    try {
        switch (request.method) {
            case 'PUT':
                await setBoard(board, user.uid)
        }

        return response.status(200).json({})
    } catch (e) {
        if (e instanceof Error) {
            response.status(400).json({ error: e.message })
        }
    }
}
