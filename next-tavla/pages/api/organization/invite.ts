import { TavlaError } from 'Admin/types/error'
import { verifyUserSession } from 'Admin/utils/auth'
import {
    getUserByEmail,
    initializeAdminApp,
    inviteUserToOrganization,
    userCanEditOrganization,
} from 'Admin/utils/firebase'
import { FeedbackCode } from 'hooks/useFormFeedback'
import { NextApiRequest, NextApiResponse } from 'next'
import { TOrganizationID } from 'types/settings'

initializeAdminApp()

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {
    const withFeedback = (status: number, feedbackCode: FeedbackCode) => {
        return response.status(status).json({ feedbackCode })
    }

    const user = await verifyUserSession(request)

    const { oid, email } = JSON.parse(request.body) as {
        oid: TOrganizationID
        email: string
    }

    if (!user || !userCanEditOrganization(user.uid, oid))
        return withFeedback(401, 'auth/not-allowed')

    const inviteeId = (await getUserByEmail(email))?.uid

    if (!inviteeId) {
        return withFeedback(404, 'invite/user-not-found')
    }

    return await inviteUserToOrganization(inviteeId, oid)
        .then(() => withFeedback(200, 'invite/success'))
        .catch((e) => {
            if (e instanceof TavlaError) {
                switch (e.code) {
                    case 'ORGANIZATION':
                        return withFeedback(400, 'invite/already-invited')
                }
            }
            return withFeedback(500, 'error')
        })
}
