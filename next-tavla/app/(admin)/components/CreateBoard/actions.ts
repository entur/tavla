'use server'

import { getUserFromSessionCookie } from 'Admin/utils/formActions'
import { TFormFeedback, getFormFeedbackForError } from 'app/(admin)/utils'
import { revalidatePath } from 'next/cache'

export async function createBoard(
    prevState: TFormFeedback | undefined,
    data: FormData,
) {
    const user = await getUserFromSessionCookie()

    if (!user) return getFormFeedbackForError('general')

    console.log(data)

    revalidatePath('/')
}
