import { verifyUserSession } from 'Admin/utils/auth'
import {
    getOrganizationWithBoard,
    initializeAdminApp,
} from 'Admin/utils/firebase'
import { NextApiRequest, NextApiResponse } from 'next'

initializeAdminApp()

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {
    const user = await verifyUserSession(request)

    console.log('treff')

    if (!user) return response.status(401).json({ error: 'Unauthorized' })
    try {
        switch (request.method) {
            case 'GET':
                const organization = await getOrganizationWithBoard(
                    request.query.id as string,
                )
                return response.status(200).json({ organization })
            default:
                throw new Error('Method not allowed')
        }
    } catch (e) {
        if (e instanceof Error) {
            response.status(400).json({ error: e.message })
        }
    }
}
