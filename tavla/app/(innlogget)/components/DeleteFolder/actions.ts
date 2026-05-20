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
    await logToGcp('info', 'action:deleteFolderAction invoked')
    const user = await getUserFromSessionCookie()

    if (!user) redirect('/')

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
        await logToGcp(
            'error',
            `Failed to delete folder ${folderid}: ${e instanceof Error ? e.message : String(e)}`,
        )
        return handleError(e)
    }

    redirect('/oversikt')
}
