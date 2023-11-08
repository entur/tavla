import { verifyUserSession } from 'Admin/utils/auth'
import {
    getOrganizationById,
    removeUserFromOrganization,
} from 'Admin/utils/firebase'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {
    try {
        const { oid, uid } = request.query as { oid: string; uid: string }

        const organization = await getOrganizationById(oid)
        if (!organization) {
            return response
                .status(404)
                .json({ message: 'Organization not found' })
        }

        const requester = await verifyUserSession(request)

        if (!requester || !organization.owners?.includes(requester.uid)) {
            return response.status(401).json({ message: 'Unauthorized' })
        }

        switch (request.method) {
            case 'DELETE':
                await removeUserFromOrganization(oid, uid)
                return response.status(200).json({ message: 'User removed' })
            default:
                return response
                    .status(405)
                    .json({ message: 'Method not allowed' })
        }
    } catch (e) {
        if (e instanceof Error) {
            response.status(400).json({ error: e.message })
        }
    }
}
