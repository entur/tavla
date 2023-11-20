'use server'
import { deleteOrganization as deleteOrg } from 'Admin/utils/firebase'
import { TOrganizationID, TUserID } from 'types/settings'

export async function deleteOrganization(oid: TOrganizationID, uid: TUserID) {
    if (!oid || !uid) return { message: 'No organization or user.' }

    try {
        await deleteOrg(oid, uid)
    } catch (error) {
        return { message: 'Error deleting organization.' }
    }
}
