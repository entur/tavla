'use server'
import {
    initializeAdminApp,
    userCanEditOrganization,
} from 'app/(admin)/utils/firebase'
import { handleError } from 'app/(admin)/utils/handleError'
import { firestore } from 'firebase-admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { TCountyID, TOrganizationID } from 'types/settings'

initializeAdminApp()

export async function setCounties(
    oid: TOrganizationID,
    countiesList: TCountyID[],
) {
    const access = userCanEditOrganization(oid)
    if (!access) return redirect('/')

    try {
        await firestore().collection('organizations').doc(oid).update({
            'defaults.counties': countiesList,
        })
        revalidatePath(`/organizations/${oid}`)
    } catch (e) {
        return handleError(e)
    }
}
