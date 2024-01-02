'use server'

import { setOrganizationLogo } from 'Admin/utils/firebase'
import { TFormFeedback, getFormFeedbackForError } from 'app/(admin)/utils'
import { revalidatePath } from 'next/cache'
import { TOrganizationID } from 'types/settings'

export async function upload(
    prevState: TFormFeedback | undefined,
    data: FormData,
) {
    'use server'

    const logo = data.get('logo') as File
    const uid = data.get('uid') as TOrganizationID

    if (!logo || !uid) return getFormFeedbackForError()

    if (logo.size > 10_000_000)
        return getFormFeedbackForError('file/size-too-big')

    await setOrganizationLogo(logo, uid)
    revalidatePath('/')
}
