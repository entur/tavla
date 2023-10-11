import { verifyUserSession } from 'Admin/utils/auth'
import {
    createBoard,
    deleteBoard,
    initializeAdminApp,
    setBoard,
} from 'Admin/utils/firebase'
import { NextApiRequest, NextApiResponse } from 'next'
import { TBoard, TBoardID } from 'types/settings'

initializeAdminApp()

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {
    const user = await verifyUserSession(request)

    if (!user) return response.redirect('/#login')

    try {
        switch (request.method) {
            case 'GET':
                return response.redirect(`/edit/${await createBoard(user.uid)}`)
            case 'PUT':
                await setBoard(
                    JSON.parse(request.body).board as TBoard,
                    user.uid,
                )
                break
            case 'DELETE':
                return await deleteBoard(
                    JSON.parse(request.body).bid as TBoardID,
                    user.uid,
                )
            default:
                throw new Error('Method not allowed')
        }
        return response.status(200).json({})
    } catch (e) {
        if (e instanceof Error) {
            response.status(400).json({ error: e.message })
        }
    }
}
