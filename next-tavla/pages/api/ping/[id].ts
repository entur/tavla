import { initializeAdminApp } from 'Admin/utils/firebase'
import { NextApiRequest, NextApiResponse } from 'next'
import { setLastActive } from 'utils/firebase'

initializeAdminApp()

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {
    const { id } = request.query
    try {
        await setLastActive(id as string)
        return response.status(200).json({ message: 'Successfully updated!' })
    } catch (error) {
        return response.status(400).json({ error: 'Could not update!' })
    }
}
