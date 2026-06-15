'use server'
import * as Sentry from '@sentry/nextjs'
import { getFoldersForUser } from 'app/(innlogget)/actions'
import {
    deleteBoard,
    deleteFolder,
    deleteUserFromFirebaseAuth,
    deleteUserFromFirestore,
    getUserWithBoardIds,
    removeUserFromFolder,
} from 'app/(innlogget)/utils/firebase'
import { getFormFeedbackForError } from 'app/(innlogget)/utils/forms'
import { getUserFromSessionCookie } from 'app/(innlogget)/utils/server'
import { auth } from 'firebase-admin'
import { logToGcp } from 'src/utils/logging'
import { logout } from '../Login/actions'

export async function deleteAccount(data: FormData) {
    const user = await getUserFromSessionCookie()
    if (!user?.uid) {
        return getFormFeedbackForError('auth/operation-not-allowed')
    }
    logToGcp('info', 'action:deleteAccount invoked')

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
        logToGcp(
            'error',
            `Failed to delete account for user: ${error instanceof Error ? error.message : String(error)}`,
        )
        Sentry.captureException(error, {
            extra: {
                message: 'Error while deleting user account',
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
