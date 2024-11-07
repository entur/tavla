'use server'
import { isEmptyOrSpaces } from 'app/(admin)/edit/utils'
import { getFormFeedbackForError } from 'app/(admin)/utils'
import { userCanEditOrganization } from 'app/(admin)/utils/firebase'
import { firestore } from 'firebase-admin'
import { FirebaseError } from 'firebase/app'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { TOrganizationID } from 'types/settings'

export async function setFooter(oid: TOrganizationID, message?: string) {
    const access = await userCanEditOrganization(oid)
    if (!access) return redirect('/')

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
        if (e instanceof FirebaseError) return getFormFeedbackForError(e)
        return getFormFeedbackForError('general')
    }
}
