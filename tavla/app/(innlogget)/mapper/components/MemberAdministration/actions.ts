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
import { getUserFromSessionCookie } from '../../../utils/server'

export async function removeUserAction(
    _prevState: TFormFeedback | undefined,
    data: FormData,
) {
    const folderId = data.get('folderid')?.toString() ?? ''
    const uid = data.get('uid')?.toString() ?? ''

    logToGcp('info', 'action:removeUserAction invoked', { folderId })
    const access = await userCanEditFolder(folderId)
    if (!access) return redirect('/')

    try {
        await removeUserFromFolder(folderId, uid)
        revalidatePath('/')
    } catch (error) {
        logToGcp(
            'error',
            `Failed to remove user from folder: ${error instanceof Error ? error.message : String(error)}`,
            { folderId },
        )
        Sentry.captureException(error, {
            extra: {
                message: 'Error while removing user from folder',
                folderID: folderId,
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
    logToGcp('info', 'action:inviteUserAction invoked', {
        folderId: folderid,
    })

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
        const _user = await getUserFromSessionCookie()

        logToGcp(
            'error',
            `Failed to invite user to folder: ${error instanceof Error ? error.message : String(error)}`,
            {
                folderId: folder.id,
            },
        )
        Sentry.captureException(error, {
            extra: {
                message: 'Error while inviting user to folder',
                folderID: folderid,
            },
        })
        return handleError(error)
    }
}
