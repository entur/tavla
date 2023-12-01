// eslint-disable @typescript-eslint/no-unused-vars
'use server'

import { cookies } from 'next/headers'
import {
    createOrganization,
    getUserByEmail,
    inviteUserToOrganization,
    removeUserFromOrganization,
    userCanEditOrganization,
    verifySession,
} from './firebase'
import { revalidatePath } from 'next/cache'
import { FeedbackCode } from 'utils/formStatuses'
import { TavlaError } from 'Admin/types/error'

async function getUserFromSessionCookie() {
    const session = cookies().get('session')
    const user = await verifySession(session?.value)
    return user
}

export async function inviteUserAction(
    prevState: FeedbackCode | undefined,
    data: FormData,
): Promise<FeedbackCode> {
    try {
        const oid = data.get('oid')?.toString() ?? ''
        const email = data.get('email')?.toString() ?? ''
        const user = await getUserFromSessionCookie()

        if (!user || !userCanEditOrganization(user.uid, oid))
            return 'auth/not-allowed'

        const inviteeId = (await getUserByEmail(email))?.uid
        if (!inviteeId) {
            return 'invite/user-not-found'
        }

        await inviteUserToOrganization(inviteeId, oid)
        revalidatePath('/')
        return 'invite/success'
    } catch (e) {
        if (e instanceof TavlaError && e.code === 'ORGANIZATION')
            return 'invite/already-invited'
        return 'error'
    }
}

export async function removeUserAction(
    prevState: FeedbackCode | undefined,
    data: FormData,
): Promise<FeedbackCode | undefined> {
    try {
        const organizationId = data.get('organizationId')?.toString() ?? ''
        const userId = data.get('userId')?.toString() ?? ''

        removeUserFromOrganization(organizationId, userId)
        revalidatePath('/')
    } catch {
        return 'remove-user/error'
    }
}

export async function createOrganizationAction(
    prevState: FeedbackCode | undefined,
    data: FormData,
): Promise<FeedbackCode> {
    try {
        const name = data.get('organizationName')?.toString() ?? ''

        if (name === '') return 'create-org/no-name'

        const user = await getUserFromSessionCookie()

        if (!user) throw new Error()

        await createOrganization(user.uid, name)
        revalidatePath('/')

        return 'create-org/success'
    } catch {
        return 'error'
    }
}
