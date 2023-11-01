import { verifyUserSession } from 'Admin/utils/auth'
import {
    getOrganizationById,
    removeUserFromOrganization,
} from 'Admin/utils/firebase'
import { concat } from 'lodash'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {
    try {
        const { oid, uid } = request.query as { oid: string; uid: string }

        const requester = await verifyUserSession(request)

        const organization = await getOrganizationById(oid)

        const memberUids = concat(
            organization.owners ?? [],
            organization.editors ?? [],
        )

        if (!requester || !memberUids.includes(requester.uid)) {
            return response.status(401).json({ message: 'Unauthorized' })
        }

        if (!organization) {
            return response
                .status(404)
                .json({ message: 'Organization not found' })
        }

        switch (request.method) {
            case 'POST':
            // Not yet implemented
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
