'use server'
import * as Sentry from '@sentry/nextjs'
import { getFoldersForUser } from 'app/(admin)/actions'
import { getFormFeedbackForError } from 'app/(admin)/utils'
import {
    deleteBoard,
    deleteFolder,
    deleteUserFromFirebaseAuth,
    deleteUserFromFirestore,
    getUserWithBoardIds,
    removeUserFromFolder,
} from 'app/(admin)/utils/firebase'
import { getUserFromSessionCookie } from 'app/(admin)/utils/server'
import { auth } from 'firebase-admin'
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
        await deleteFoldersAndBoardsWithSoleMember()
        await removeUserFromFolders(user.uid)
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

async function deleteFoldersAndBoardsWithSoleMember() {
    const allFoldersWithUser = await getFoldersForUser()

    const foldersWithSoleMember = allFoldersWithUser.filter(
        (folder) => folder.owners?.length === 1,
    )

    for (const folder of foldersWithSoleMember) {
        if (folder.id) {
            await deleteFolder(folder.id)
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

async function removeUserFromFolders(uid: string) {
    const allFoldersWithUser = await getFoldersForUser()

    const foldersWithMultipleMembers = allFoldersWithUser.filter(
        (folder) => (folder.owners?.length ?? 0) > 1,
    )

    foldersWithMultipleMembers.forEach((folder) => {
        if (folder.id) {
            removeUserFromFolder(folder.id, uid)
        }
    })
}
