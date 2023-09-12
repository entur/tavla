import { createUser } from 'Admin/utils/firebase'
import { isArray } from 'lodash'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {
    const { uid } = request.query
    if (!uid || isArray(uid))
        return response
            .status(400)
            .json({ error: 'User document could not be created' })

    try {
        await createUser(uid)
        return response
            .status(200)
            .json({ message: 'User document successfully created' })
    } catch {
        return response
            .status(400)
            .json({ error: 'User document could not be created' })
    }
}
