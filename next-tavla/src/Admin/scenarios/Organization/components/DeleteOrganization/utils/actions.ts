'use server'
import { deleteOrganization as deleteOrg } from 'Admin/utils/firebase'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { TOrganizationID, TUserID } from 'types/settings'

export async function deleteOrganization(data: FormData) {
    'use server'

    const oid = data.get('oid') as TOrganizationID
    const uid = data.get('uid') as TUserID
    if (!oid || !uid) return

    await deleteOrg(oid, uid)
    revalidatePath('/')
    redirect('/organizations')
}
