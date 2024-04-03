'use server'
import { TFormFeedback, getFormFeedbackForError } from 'app/(admin)/utils'
import { FirebaseError } from 'firebase/app'
import { isString } from 'lodash'
import { revalidatePath } from 'next/cache'
import { addTag, removeTag } from './updateTags'
import { deleteBoard } from 'app/(admin)/utils/firebase'
import { redirect } from 'next/navigation'

export async function deleteBoardAction(
    prevState: TFormFeedback | undefined,
    data: FormData,
) {
    try {
        const bid = data.get('bid') as string

        await deleteBoard(bid)
        revalidatePath('/')
    } catch (e) {
        if (e instanceof FirebaseError || isString(e))
            return getFormFeedbackForError(e)
        return getFormFeedbackForError('general')
    }
    redirect('/boards')
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
