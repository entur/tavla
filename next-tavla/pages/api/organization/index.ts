import { verifyUserSession } from 'Admin/utils/auth'
import {
    createOrganization,
    deleteOrganization,
    getOrganizationsWithUser,
    initializeAdminApp,
} from 'Admin/utils/firebase'
import { NextApiRequest, NextApiResponse } from 'next'
import { TOrganizationID } from 'types/settings'

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
            case 'GET':
                const organizations = await getOrganizationsWithUser(user.uid)
                return response
                    .status(200)
                    .json({ organizations: organizations })
            case 'DELETE':
                await deleteOrganization(
                    JSON.parse(request.body).oid as TOrganizationID,
                    user.uid,
                )
                break
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
