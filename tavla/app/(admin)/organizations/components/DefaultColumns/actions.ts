'use server'
import { getFormFeedbackForError, TFormFeedback } from 'app/(admin)/utils'
import {
    initializeAdminApp,
    userCanEditOrganization,
} from 'app/(admin)/utils/firebase'
import { handleError } from 'app/(admin)/utils/handleError'
import { firestore } from 'firebase-admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { TColumn } from 'types/column'
import { TOrganizationID } from 'types/settings'

initializeAdminApp()

export async function saveColumns(
    state: TFormFeedback | undefined,
    oid: TOrganizationID,
    columns: TColumn[],
) {
    const access = userCanEditOrganization(oid)
    if (!access) return redirect('/')
    if (columns.length === 0)
        return getFormFeedbackForError('organization/invalid-columns')

    try {
        await firestore().collection('organizations').doc(oid).update({
            'defaults.columns': columns,
        })
        revalidatePath(`/organizations/${oid}`)
    } catch (e) {
        return handleError(e)
    }
}
