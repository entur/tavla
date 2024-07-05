'use server'
import { TFormFeedback, getFormFeedbackForError } from 'app/(admin)/utils'
import { FirebaseError } from 'firebase/app'
import { isString } from 'lodash'
import { revalidatePath } from 'next/cache'
import { deleteBoard, initializeAdminApp } from 'app/(admin)/utils/firebase'
import { redirect } from 'next/navigation'

initializeAdminApp()

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
