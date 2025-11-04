'use server'

import { TFormFeedback, getFormFeedbackForError } from 'app/(admin)/utils'
import { deleteFolder } from 'app/(admin)/utils/firebase'
import { handleError } from 'app/(admin)/utils/handleError'
import { getUserFromSessionCookie } from 'app/(admin)/utils/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { FolderDB } from 'types/db-types/folders'

export async function deleteFolderAction(
    prevState: TFormFeedback | undefined,
    data: FormData,
) {
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
        return handleError(e)
    }

    redirect('/oversikt')
}
