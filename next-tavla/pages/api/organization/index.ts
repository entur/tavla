import { verifyUserSession } from 'Admin/utils/auth'
import { createOrganization, initializeAdminApp } from 'Admin/utils/firebase'
import { NextApiRequest, NextApiResponse } from 'next'

initializeAdminApp()

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {
    const user = await verifyUserSession(request)

    if (!user) return response.status(401).json({ error: 'Unauthorized' })
    try {
        switch (request.method) {
            case 'POST':
                const oid = await createOrganization(
                    user.uid,
                    JSON.parse(request.body).name as string,
                )
                return response.status(200).json({ oid: oid })
            default:
                throw new Error('Method not allowed')
        }
    } catch (e) {
        if (e instanceof Error) {
            response.status(400).json({ error: e.message })
        }
    }
}
