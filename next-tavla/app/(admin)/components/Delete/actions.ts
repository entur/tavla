'use server'

import { TOrganizationID, TUserID } from 'types/settings'
import { deleteOrganization as deleteOrg } from 'Admin/utils/firebase'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function deleteOrganization(oid: TOrganizationID, uid: TUserID) {
    await deleteOrg(oid, uid)
    revalidatePath('/')
    redirect('/organizations')
}
