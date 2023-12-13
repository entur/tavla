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
import { TFormFeedback, getFormFeedbackForError } from 'app/(admin)/utils'
import { FirebaseError } from 'firebase/app'
import { isString } from 'lodash'
import { redirect } from 'next/navigation'
import { TOrganizationID } from 'types/settings'

export async function getUserFromSessionCookie() {
    const session = cookies().get('session')
    return await verifySession(session?.value)
}

export async function inviteUserAction(
    prevState: TFormFeedback | undefined,
    data: FormData,
) {
    try {
        const oid = data.get('oid')?.toString() ?? ''

        const email = data.get('email')?.toString()
        if (!email) return getFormFeedbackForError('auth/invalid-email')

        const user = await getUserFromSessionCookie()

        if (!user || !userCanEditOrganization(user.uid, oid))
            return getFormFeedbackForError('auth/operation-not-allowed')

        const inviteeId = (await getUserByEmail(email))?.uid
        if (!inviteeId) return getFormFeedbackForError('auth/user-not-found')

        await inviteUserToOrganization(user.uid, inviteeId, oid)
        revalidatePath('/')
    } catch (e) {
        if (e instanceof FirebaseError || isString(e))
            return getFormFeedbackForError(e)
    }
}

export async function removeUserAction(
    prevState: TFormFeedback | undefined,
    data: FormData,
) {
    try {
        const organizationId = data.get('oid')?.toString() ?? ''
        const uid = data.get('uid')?.toString() ?? ''

        const user = await getUserFromSessionCookie()
        if (!user) redirect('/')

        await removeUserFromOrganization(user.uid, organizationId, uid)
        revalidatePath('/')
    } catch (e) {
        if (e instanceof FirebaseError || isString(e))
            return getFormFeedbackForError(e)
    }
}

export async function createOrganizationAction(
    prevState: TFormFeedback | undefined,
    data: FormData,
) {
    let oid: TOrganizationID | undefined
    try {
        const name = data.get('name')?.toString() ?? ''

        if (!name) return getFormFeedbackForError('organization/name-missing')

        const user = await getUserFromSessionCookie()

        if (!user) return getFormFeedbackForError('auth/operation-not-allowed')

        oid = await createOrganization(user.uid, name)
    } catch (e) {
        if (e instanceof FirebaseError || isString(e))
            return getFormFeedbackForError(e)
    }
    if (oid) redirect(`/organizations/${oid}`)
}
