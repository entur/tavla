'use server'

import { TFormFeedback, getFormFeedbackForError } from 'app/(admin)/utils'
import {
    deleteOrganization,
    deleteUserBoards,
    initializeAdminApp,
} from 'app/(admin)/utils/firebase'
import { getUserFromSessionCookie } from 'app/(admin)/utils/server'
import { getAuth } from 'firebase-admin/auth'
import { redirect } from 'next/navigation'
import { logout } from '../../Login/actions'
import { getOrganizationsForUser } from 'app/(admin)/actions'
import { TUserID } from 'types/settings'

initializeAdminApp()

export async function deleteProfile(
    prevState: TFormFeedback | undefined,
    data: FormData,
) {
    const user = await getUserFromSessionCookie()
    if (!user) return redirect('/')

    const adminAuth = getAuth()

    const email = data.get('email') as string

    try {
        const userRecord = await adminAuth.getUser(user.uid)

        if (email !== userRecord.email)
            return getFormFeedbackForError('auth/email-mismatch')
        await deleteUserBoardsAndOrganizations(userRecord.uid)
        await adminAuth.deleteUser(userRecord.uid)
        await logout()
    } catch (error) {
        return getFormFeedbackForError()
    }
}

async function deleteUserBoardsAndOrganizations(uid: TUserID) {
    try {
        const organizations = await getOrganizationsForUser()

        return Promise.all(
            organizations.map((org) => {
                if (org.owners?.includes(uid) && org.owners.length < 2) {
                    if (!org.id) return
                    deleteOrganization(org.id)
                }
            }),
        ).then(deleteUserBoards)
    } catch (error) {
        return getFormFeedbackForError()
    }
}
