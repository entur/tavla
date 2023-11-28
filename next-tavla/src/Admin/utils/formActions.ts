'use server'

import { cookies } from 'next/headers'
import {
    getUserByEmail,
    inviteUserToOrganization,
    removeUserFromOrganization,
    userCanEditOrganization,
    verifySession,
} from './firebase'
import { revalidatePath } from 'next/cache'
import { FeedbackCode } from 'utils/formStatuses'
import { TavlaError } from 'Admin/types/error'

export async function inviteUserAction(
    prevState: FeedbackCode | null, // eslint-disable-line @typescript-eslint/no-unused-vars
    data: FormData,
): Promise<FeedbackCode> {
    try {
        const oid = data.get('oid')?.toString() ?? ''
        const email = data.get('email')?.toString() ?? ''
        const session = cookies().get('session')
        const user = await verifySession(session?.value)

        if (!user || !userCanEditOrganization(user.uid, oid))
            return 'auth/not-allowed'

        const inviteeId = (await getUserByEmail(email))?.uid
        if (!inviteeId) {
            return 'invite/user-not-found'
        }

        return await inviteUserToOrganization(inviteeId, oid).then(() => {
            revalidatePath('/')
            return 'invite/success' as FeedbackCode
        })
    } catch (e) {
        if (e instanceof TavlaError && e.code === 'ORGANIZATION')
            return 'invite/already-invited'
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
