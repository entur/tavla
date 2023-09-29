import { verifyUserSession } from 'Admin/utils/auth'
import { deleteBoard, initializeAdminApp } from 'Admin/utils/firebase'
import { NextApiRequest, NextApiResponse } from 'next'
import { TBoardID } from 'types/settings'

initializeAdminApp()

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {
    const user = await verifyUserSession(request)
    if (!user) return response.redirect('/#login')
    const { bid } = request.query
    try {
        await deleteBoard(bid as TBoardID, user.uid)
        return response.redirect('/edit/boards')
    } catch (e) {
        if (e instanceof Error) {
            response.status(400).json({ error: e.message })
        }
    }
}
