import { verifyUserSession } from 'Admin/utils/auth'
import { deleteBoard } from 'Admin/utils/firebase'
import { NextApiRequest, NextApiResponse } from 'next'
import { TBoardID } from 'types/settings'

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {
    const { bid } = request.query
    const user = await verifyUserSession(request)
    if (!user) {
        return response.status(401).send('Not authenticated')
    }
    try {
        await deleteBoard(bid as TBoardID, user.uid)
        return response.status(200).send('Board deleted')
    } catch (error) {
        return response.status(500).send('Something went wrong')
    }
}
