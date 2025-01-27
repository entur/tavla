'use server'
import { getOrganizationsForUser } from 'app/(admin)/actions'
import {
    deleteBoard,
    deleteOrganization,
    deleteOrganizationBoards,
    deleteUserFromFirebaseAuth,
    deleteUserFromFirestore,
    getUserWithBoardIds,
    removeUserFromOrg,
} from 'app/(admin)/utils/firebase'
import { getUserFromSessionCookie } from 'app/(admin)/utils/server'
import { getFormFeedbackForError } from 'app/(admin)/utils'
import { logout } from '../Login/actions'

export async function deleteAccount() {
    const user = await getUserFromSessionCookie()
    if (!user || !user.uid)
        return getFormFeedbackForError('auth/operation-not-allowed')

    try {
        await deleteOrgsAndBoardsWithSoleMember()
        await removeUserFromOrgs(user.uid)
        await deletePrivateBoardsForUser()
        await deleteUserFromFirestore()
        await deleteUserFromFirebaseAuth()
    } catch {
        return getFormFeedbackForError('firebase/general')
    }
    logout()
}

async function deleteOrgsAndBoardsWithSoleMember() {
    const allOrgsWithUser = await getOrganizationsForUser()

    const orgsWithSoleMember = allOrgsWithUser.filter(
        (org) => org.owners?.length === 1,
    )

    orgsWithSoleMember.forEach(async (org) => {
        if (org.id) {
            await deleteOrganizationBoards(org.id)
        }
    })

    orgsWithSoleMember.forEach(async (org) => {
        if (org.id) {
            await deleteOrganization(org.id)
        }
    })
}

async function deletePrivateBoardsForUser() {
    const userBoards = await getUserWithBoardIds()
    const ownerList = userBoards?.owner

    ownerList?.forEach((bid) => {
        deleteBoard(bid)
    })
}

async function removeUserFromOrgs(uid: string) {
    const allOrgsWithUser = await getOrganizationsForUser()

    const orgsWithMultipleMembers = allOrgsWithUser.filter(
        (org) => (org.owners?.length ?? 0) > 1,
    )

    orgsWithMultipleMembers.forEach((org) => {
        if (org.id) {
            removeUserFromOrg(org.id, uid)
        }
    })
}
