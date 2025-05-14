'use server'
import { getFoldersForUser } from 'app/(admin)/actions'
import {
    deleteBoard,
    deleteFolder,
    deleteUserFromFirebaseAuth,
    deleteUserFromFirestore,
    getUserWithBoardIds,
    removeUserFromOrg,
} from 'app/(admin)/utils/firebase'
import { getFormFeedbackForError } from 'app/(admin)/utils'
import * as Sentry from '@sentry/nextjs'
import { auth } from 'firebase-admin'
import { getUserFromSessionCookie } from 'app/(admin)/utils/server'
import { logout } from '../Login/actions'

export async function deleteAccount(data: FormData) {
    const user = await getUserFromSessionCookie()
    if (!user || !user.uid) {
        return getFormFeedbackForError('auth/operation-not-allowed')
    }

    const userObject = await auth().getUser(user.uid)
    const confirmEmail = data.get('confirmEmail') as string
    if (userObject.email !== confirmEmail) {
        return getFormFeedbackForError('delete/email-mismatch')
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
    await logout()
}

async function deleteOrgsAndBoardsWithSoleMember() {
    const allOrgsWithUser = await getFoldersForUser()

    const orgsWithSoleMember = allOrgsWithUser.filter(
        (org) => org.owners?.length === 1,
    )

    for (const org of orgsWithSoleMember) {
        if (org.id) {
            await deleteFolder(org.id)
        }
    }
}

async function deletePrivateBoardsForUser() {
    const privateBoards = await getUserWithBoardIds()
    const ownerList = privateBoards?.owner ?? []

    for (const bid of ownerList) {
        await deleteBoard(bid)
    }
}

async function removeUserFromOrgs(uid: string) {
    const allOrgsWithUser = await getFoldersForUser()

    const orgsWithMultipleMembers = allOrgsWithUser.filter(
        (org) => (org.owners?.length ?? 0) > 1,
    )

    orgsWithMultipleMembers.forEach((org) => {
        if (org.id) {
            removeUserFromOrg(org.id, uid)
        }
    })
}
