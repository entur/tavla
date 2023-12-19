'use server'
import { deleteBoard } from 'Admin/utils/firebase'
import { getUserFromSessionCookie } from 'Admin/utils/formActions'
import { TFormFeedback, getFormFeedbackForError } from 'app/(admin)/utils'
import { FirebaseError } from 'firebase/app'
import { isString } from 'lodash'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { addTag, removeTag } from './updateTags'

export async function deleteBoardAction(
    prevState: TFormFeedback | undefined,
    data: FormData,
) {
    try {
        const user = await getUserFromSessionCookie()
        if (!user) redirect('/')
        const bid = data.get('bid') as string
        await deleteBoard(bid, user.uid)
        revalidatePath('/')
    } catch (e) {
        if (e instanceof FirebaseError || isString(e))
            return getFormFeedbackForError(e)
        return getFormFeedbackForError('general')
    }
}

export async function addTagAction(
    prevState: TFormFeedback | undefined,
    data: FormData,
) {
    try {
        const bid = data.get('bid') as string
        const tag = data.get('tag') as string
        await addTag({ bid, tag: tag })
        revalidatePath('/')
    } catch (e) {
        if (e instanceof FirebaseError || isString(e))
            return getFormFeedbackForError(e)
        return getFormFeedbackForError('general')
    }
}

export async function removeTagAction(
    prevState: TFormFeedback | undefined,
    data: FormData,
) {
    try {
        const bid = data.get('bid') as string
        const tag = data.get('tag') as string
        await removeTag({ bid, tag })
        revalidatePath('/')
    } catch (e) {
        if (e instanceof FirebaseError || isString(e))
            return getFormFeedbackForError(e)
        return getFormFeedbackForError('general')
    }
}
