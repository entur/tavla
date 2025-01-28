'use server'
import { getOrganizationsForUser } from 'app/(admin)/actions'
import {
    deleteBoard,
    deleteOrganization,
    deleteUserFromFirebaseAuth,
    deleteUserFromFirestore,
    getUserWithBoardIds,
    removeUserFromOrg,
} from 'app/(admin)/utils/firebase'
import { getUserFromSessionCookie } from 'app/(admin)/utils/server'
import { getFormFeedbackForError } from 'app/(admin)/utils'
import { redirect } from 'next/navigation'
import * as Sentry from '@sentry/nextjs'

export async function deleteAccount() {
    const user = await getUserFromSessionCookie()
    if (!user || !user.uid) {
        return getFormFeedbackForError('auth/operation-not-allowed')
    }

    try {
        await deleteOrgsAndBoardsWithSoleMember()
        await removeUserFromOrgs(user.uid)
        await deletePrivateBoardsForUser()
        await deleteUserFromFirestore()
        await deleteUserFromFirebaseAuth()
    } catch (error) {
        Sentry.captureException(error, {
            extra: {
                message: 'Error while deleting user account',
                userID: user.uid,
            },
        })
        return getFormFeedbackForError('firebase/general')
    }
    redirect('/')
}

async function deleteOrgsAndBoardsWithSoleMember() {
    const allOrgsWithUser = await getOrganizationsForUser()

    const orgsWithSoleMember = allOrgsWithUser.filter(
        (org) => org.owners?.length === 1,
    )

    for (const org of orgsWithSoleMember) {
        if (org.id) {
            await deleteOrganization(org.id)
        }
    }
}

async function deletePrivateBoardsForUser() {
    const userBoards = await getUserWithBoardIds()
    const ownerList = userBoards?.owner ?? []

    for (const bid of ownerList) {
        await deleteBoard(bid)
    }
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
