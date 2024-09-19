'use server'

import { TOrganizationID } from 'types/settings'
import { deleteOrganization as deleteOrg } from 'app/(admin)/utils/firebase'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { TFormFeedback, getFormFeedbackForError } from 'app/(admin)/utils'
import { FirebaseError } from 'firebase/app'
import { getUserFromSessionCookie } from 'app/(admin)/utils/server'

export async function deleteOrganization(
    prevState: TFormFeedback | undefined,
    oid: TOrganizationID,
) {
    const user = await getUserFromSessionCookie()

    if (!oid || !user) return getFormFeedbackForError('general')

    try {
        await deleteOrg(oid)
        revalidatePath('/')
    } catch (e) {
        if (e instanceof FirebaseError) return getFormFeedbackForError(e)
        return getFormFeedbackForError('general')
    }

    redirect('/organizations')
}
