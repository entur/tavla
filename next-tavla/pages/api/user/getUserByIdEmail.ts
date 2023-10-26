import { NextApiRequest, NextApiResponse } from 'next'
import { getUserByEmail } from 'Admin/utils/firebase'
import { verifyUserSession } from 'Admin/utils/auth'

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {
    const user = await verifyUserSession(request)

    if (!user) return response.status(401).json({ error: 'Unauthorized' })

    const { email } = request.query

    if (typeof email !== 'string') {
        return response.status(400).json({ message: 'Invalid email' })
    }

    try {
        const { uid } = await getUserByEmail(email)
        return response.status(200).json({ uid })
    } catch (error) {
        return response.status(404).json({ message: 'User not found' })
    }
}
