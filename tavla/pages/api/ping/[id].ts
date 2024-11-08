import { ping } from 'Board/scenarios/Board/firebase'
import { NextApiRequest, NextApiResponse } from 'next'
import { TBoardID } from 'types/settings'

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {
    const { id } = request.query
    if (!id) return response.status(400).json({ error: 'Could not update!' })
    try {
        await ping(id as TBoardID)
        return response.status(200).json({ message: 'Successfully updated!' })
    } catch {
        return response.status(400).json({ error: 'Could not update!' })
    }
}
