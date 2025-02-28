'use server'
import { initializeAdminApp } from 'app/(admin)/utils/firebase'
import { handleError } from 'app/(admin)/utils/handleError'
import { firestore } from 'firebase-admin'
import { revalidatePath } from 'next/cache'
import { TBoardID, TTheme } from 'types/settings'
import * as Sentry from '@sentry/nextjs'
import { userHasAccessToEdit } from '../Settings/actions'

initializeAdminApp()

export async function setTheme(bid: TBoardID, theme?: TTheme) {
    userHasAccessToEdit(bid)

    try {
        await firestore()
            .collection('boards')
            .doc(bid)
            .update({
                theme: theme ?? 'dark',
                'meta.dateModified': Date.now(),
            })

        revalidatePath(`/edit/${bid}`)
    } catch (error) {
        Sentry.captureException(error, {
            extra: {
                message: 'Error while updating theme of board',
                boardID: bid,
                newTheme: theme,
            },
        })
        return handleError(error)
    }
}
