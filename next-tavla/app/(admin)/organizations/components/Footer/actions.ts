'use server'
import { userCanEditOrganization } from 'app/(admin)/utils/firebase'
import { firestore } from 'firebase-admin'
import { redirect } from 'next/navigation'
import { TOrganizationID } from 'types/settings'

export async function setFooter(oid: TOrganizationID, footer: string) {
    const access = await userCanEditOrganization(oid)
    if (!access) return redirect('/')

    await firestore()
        .collection('organizations')
        .doc(oid)
        .update({ footer: footer })
}
