'use server'

import { cookies } from 'next/headers'
import {
    getUserByEmail,
    inviteUserToOrganization,
    removeUserFromOrganization,
    userCanEditOrganization,
    verifySession,
} from './firebase'
import { FeedbackCode } from 'hooks/useFormFeedback'
import { TOrganizationID } from 'types/settings'
import { revalidatePath } from 'next/cache'

export async function inviteUserAction(
    data: FormData,
    oid: TOrganizationID,
): Promise<FeedbackCode> {
    try {
        const email = data.get('email')?.toString() ?? ''
        const session = cookies().get('session')
        const user = await verifySession(session?.value)

        if (!user || !userCanEditOrganization(user.uid, oid))
            return 'auth/not-allowed'

        const inviteeId = (await getUserByEmail(email))?.uid
        if (!inviteeId) {
            return 'invite/user-not-found'
        }

        return await inviteUserToOrganization(inviteeId, oid)
            .then(() => {
                revalidatePath('/')
                return 'invite/success' as FeedbackCode
            })
            .catch((e) => {
                if (e.code === 'ORGANIZATION') return 'invite/already-invited'
                return 'error'
            })
    } catch (e) {
        return 'error'
    }
}

export async function removeUserAction(data: FormData) {
    try {
        const organizationId = data.get('organizationId')?.toString() ?? ''
        const userId = data.get('userId')?.toString() ?? ''

        removeUserFromOrganization(organizationId, userId)
        revalidatePath('/')
    } catch {}
}
