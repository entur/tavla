'use server'
import { isEmptyOrSpaces } from 'app/(admin)/edit/utils'
import { getFormFeedbackForError } from 'app/(admin)/utils'
import { userCanEditOrganization } from 'app/(admin)/utils/firebase'
import { handleError } from 'app/(admin)/utils/handleError'
import { firestore } from 'firebase-admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { TOrganizationID } from 'types/settings'

export async function setFooter(
    oid: TOrganizationID | undefined,
    data: FormData,
) {
    if (!oid) return getFormFeedbackForError()
    const access = await userCanEditOrganization(oid)
    if (!access) return redirect('/')

    const message = data.get('footer') as string

    try {
        await firestore()
            .collection('organizations')
            .doc(oid)
            .update({
                footer: !isEmptyOrSpaces(message)
                    ? message
                    : firestore.FieldValue.delete(),
            })
        revalidatePath(`organizations/${oid}`)
    } catch (e) {
        return handleError(e)
    }
}
