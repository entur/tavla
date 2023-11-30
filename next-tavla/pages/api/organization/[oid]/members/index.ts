import { verifyUserSession } from 'Admin/utils/auth'
import {
    getOrganizationById,
    getUsersWithEmailsByUids,
} from 'Admin/utils/firebase'
import { concat } from 'lodash'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {
    try {
        const { oid } = request.query

        const user = await verifyUserSession(request)
        const organization = await getOrganizationById(oid as string)

        if (!organization) {
            return response
                .status(404)
                .json({ message: 'Organization not found' })
        }

        if (!user || !organization.owners?.includes(user.uid)) {
            return response.status(401).json({ message: 'Unauthorized' })
        }

        switch (request.method) {
            case 'GET':
                const members = await getUsersWithEmailsByUids(
                    concat(organization.owners, organization.editors ?? []),
                )
                return response.status(200).json({ members })
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
