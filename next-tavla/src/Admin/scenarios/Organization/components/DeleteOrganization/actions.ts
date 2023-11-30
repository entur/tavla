'use server'

import { deleteOrganization } from 'Admin/utils/firebase'
import { redirect } from 'next/navigation'
import { TOrganizationID, TUserID } from 'types/settings'

export async function deleteOrg(data: FormData) {
    const oid = data.get('oid') as TOrganizationID
    const uid = data.get('uid') as TUserID

    if (!oid || !uid)
        return { variant: 'info', content: 'Organization or user missing' }

    const orgName = data.get('orgName') as string
    const nameInput = data.get('nameInput') as string

    if (orgName !== nameInput)
        return { variant: 'info', content: 'Organization name mismatch' }

    await deleteOrganization(oid, uid)
    redirect('/organizations')
}
