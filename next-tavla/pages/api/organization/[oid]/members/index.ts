import { verifyUserSession } from 'Admin/utils/auth'
import {
    getOrganizationById,
    getUsersWithEmailsByUids,
    removeUserFromOrganization,
} from 'Admin/utils/firebase'
import { concat } from 'lodash'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {
    const { oid } = request.query

    const user = await verifyUserSession(request)
    const organization = await getOrganizationById(oid as string)

    const memberUids = concat(
        organization.owners ?? [],
        organization.editors ?? [],
    )

    if (!user || !memberUids.includes(user.uid)) {
        return response.status(401).json({ message: 'Unauthorized' })
    }

    if (!organization) {
        return response.status(404).json({ message: 'Organization not found' })
    }

    switch (request.method) {
        case 'GET':
            const members = await getUsersWithEmailsByUids(memberUids)
            return response.status(200).json({ members })
        case 'DELETE':
            removeUserFromOrganization(oid as string, request.body.uid)
        default:
            return response.status(405).json({ message: 'Method not allowed' })
    }
}
