'use server'
import {
    initializeAdminApp,
    userCanEditOrganization,
} from 'app/(admin)/utils/firebase'
import { firestore } from 'firebase-admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { TColumn } from 'types/column'
import { TOrganizationID } from 'types/settings'

initializeAdminApp()

export async function saveColumns(oid: TOrganizationID, columns: TColumn[]) {
    const access = userCanEditOrganization(oid)
    if (!access) return redirect('/')

    await firestore().collection('organizations').doc(oid).update({
        'defaults.columns': columns,
    })
    revalidatePath(`/organizations/${oid}`)
}
