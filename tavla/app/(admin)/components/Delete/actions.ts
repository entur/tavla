'use server'

import { TFolderID } from 'types/settings'
import { deleteFolder } from 'app/(admin)/utils/firebase'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { TFormFeedback, getFormFeedbackForError } from 'app/(admin)/utils'
import { getUserFromSessionCookie } from 'app/(admin)/utils/server'
import { handleError } from 'app/(admin)/utils/handleError'

export async function deleteFolderAction(
    prevState: TFormFeedback | undefined,
    data: FormData,
) {
    const user = await getUserFromSessionCookie()

    if (!user) redirect('/')

    const oid = data.get('oid') as TFolderID
    if (!oid) return getFormFeedbackForError('general')

    const folderName = data.get('oname') as string
    const name = data.get('name') as string
    if (name !== folderName)
        return getFormFeedbackForError('folder/name-mismatch')

    try {
        await deleteFolder(oid)
        revalidatePath('/')
    } catch (e) {
        return handleError(e)
    }

    redirect('/oversikt')
}
