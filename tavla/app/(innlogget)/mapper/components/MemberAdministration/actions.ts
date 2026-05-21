'use server'
import * as Sentry from '@sentry/nextjs'
import { getFolderIfUserHasAccess } from 'app/(innlogget)/actions'
import {
    removeUserFromFolder,
    userCanEditFolder,
} from 'app/(innlogget)/utils/firebase'
import {
    getFormFeedbackForError,
    type TFormFeedback,
} from 'app/(innlogget)/utils/forms'
import { handleError } from 'app/(innlogget)/utils/handleError'
import { auth } from 'firebase-admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { addOwnerToFolder } from 'src/firebase'
import { logToGcp } from 'src/utils/logging'

export async function removeUserAction(
    _prevState: TFormFeedback | undefined,
    data: FormData,
) {
    const folderId = data.get('folderid')?.toString() ?? ''
    const uid = data.get('uid')?.toString() ?? ''

    const access = await userCanEditFolder(folderId)
    if (!access) return redirect('/')

    try {
        await removeUserFromFolder(folderId, uid)
        revalidatePath('/')
    } catch (error) {
        await logToGcp(
            'error',
            `Failed to remove user ${uid} from folder ${folderId}: ${error instanceof Error ? error.message : String(error)}`,
        )
        Sentry.captureException(error, {
            extra: {
                message: 'Error while removing user from folder',
                folderID: folderId,
                userID: uid,
            },
        })
        return handleError(error)
    }
}

export async function inviteUserAction(
    _prevState: TFormFeedback | undefined,
    data: FormData,
) {
    const folderid = data.get('folderid')?.toString() ?? ''

    const email = data.get('email')?.toString()
    if (!email) return getFormFeedbackForError('auth/invalid-email')

    const access = await userCanEditFolder(folderid)
    if (!access) return redirect('/')

    const invitee = await auth()
        .getUserByEmail(email)
        .catch(() => undefined)

    if (!invitee) return getFormFeedbackForError('auth/user-not-found')

    const folder = await getFolderIfUserHasAccess(folderid)

    if (!folder) return getFormFeedbackForError('folder/not-found')

    if (folder?.owners?.includes(invitee.uid))
        return getFormFeedbackForError('folder/user-already-invited')

    try {
        await addOwnerToFolder(folderid, invitee.uid)
        revalidatePath('/')
    } catch (error) {
        await logToGcp(
            'error',
            `Failed to invite user ${invitee.uid} to folder ${folderid}: ${error instanceof Error ? error.message : String(error)}`,
        )
        Sentry.captureException(error, {
            extra: {
                message: 'Error while inviting user to folder',
                folderID: folderid,
                inviteeID: invitee.uid,
            },
        })
        return handleError(error)
    }
}
