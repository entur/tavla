'use server'

import { deleteFolder } from 'app/(innlogget)/utils/firebase'
import {
    getFormFeedbackForError,
    type TFormFeedback,
} from 'app/(innlogget)/utils/forms'
import { handleError } from 'app/(innlogget)/utils/handleError'
import { getUserFromSessionCookie } from 'app/(innlogget)/utils/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { FolderDB } from 'src/types/db-types/folders'
import { logToGcp } from 'src/utils/logging'

export async function deleteFolderAction(
    _prevState: TFormFeedback | undefined,
    data: FormData,
) {
    const user = await getUserFromSessionCookie()

    if (!user) redirect('/')
    logToGcp('info', 'action:deleteFolderAction invoked')

    const folderid = data.get('folderid') as FolderDB['id']
    if (!folderid) return getFormFeedbackForError('general')

    const folderName = data.get('oname') as string
    const name = data.get('name') as string

    if (name !== folderName)
        return getFormFeedbackForError('folder/name-mismatch')

    try {
        await deleteFolder(folderid)
        revalidatePath('/')
    } catch (e) {
        logToGcp(
            'error',
            `Failed to delete folder: ${e instanceof Error ? e.message : String(e)}`,
            { folderId: folderid },
        )
        return handleError(e)
    }

    redirect('/oversikt')
}
