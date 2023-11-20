'use server'
import { deleteOrganization as deleteOrg } from 'Admin/utils/firebase'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { TOrganization, TUserID } from 'types/settings'

export async function deleteOrganization(
    organization: TOrganization,
    uid: TUserID,
    data: FormData,
) {
    if (!organization.id || !uid) return { message: 'No organization or user.' }
    const organizationName = data.get('organizationName') as string
    if (organizationName !== organization.name)
        return { message: 'Organization name not matching.' }

    try {
        await deleteOrg(organization.id, uid)
        revalidatePath('/')
        redirect('/organizations')
    } catch (error) {
        console.error(error)
        return { message: 'Error deleting organization.' }
    }
}
