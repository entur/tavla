'use server'
import * as Sentry from '@sentry/nextjs'
import {
    initializeAdminApp,
    revokeUserTokenOnLogout,
} from 'app/(innlogget)/utils/firebase'
import { getAuth } from 'firebase-admin/auth'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import {
    addBoardIdToUser,
    createUser,
    getBoard,
    updateBoard,
} from 'src/firebase'
import type { BoardDB } from 'src/types/db-types/boards'
import type { UserDB } from 'src/types/db-types/users'
import { logToGcp } from 'src/utils/logging'

initializeAdminApp()

export async function logout() {
    logToGcp('info', 'action invoked: logout', {
        type: 'server-action',
        action: 'logout',
    })
    revokeUserTokenOnLogout()
    ;(await cookies()).delete('session')
    revalidatePath('/')
    redirect('/')
}

export async function login(token: string) {
    logToGcp('info', 'action invoked: login', {
        type: 'server-action',
        action: 'login',
    })
    const expiresIn = 60 * 60 * 24 * 10 // Ten days in seconds
    const sessionCookie = await getAuth().createSessionCookie(token, {
        expiresIn: expiresIn * 1000, // Firebase expects the number in milliseconds
    })

    const user = await getAuth().verifySessionCookie(sessionCookie, true)
    if (!user.email_verified) return 'auth/unverified'
    ;(await cookies()).set({
        name: 'session',
        value: sessionCookie,
        maxAge: expiresIn,
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
    })
    redirect('/oversikt')
}

export async function create(uid: UserDB['uid'], claimBoard?: BoardDB['id']) {
    logToGcp('info', 'action invoked: createUser', {
        type: 'server-action',
        action: 'createUser',
    })
    try {
        await createUser(uid)
    } catch (error) {
        logToGcp('error', 'action failed: createUser', {
            type: 'server-action',
            action: 'createUser',
            errorName: error instanceof Error ? error.name : undefined,
            errorMessage:
                error instanceof Error ? error.message : String(error),
        })
        Sentry.captureException(error, {
            extra: {
                message: 'Error while creating new user',
            },
        })
        throw error
    }

    if (!claimBoard) return

    try {
        const board = await getBoard(claimBoard)
        // Kun anonyme boards kan klames — forhindrer at claimBoard brukes til
        // å gi en ny bruker redigeringstilgang til et board de ikke eier.
        if (!board?.isAnonymousBoard) return

        await addBoardIdToUser(uid, claimBoard)
        await updateBoard(claimBoard, {
            isAnonymousBoard: false,
            isDraft: false,
        })
    } catch (error) {
        logToGcp('error', 'action failed: claim board for new user', {
            type: 'server-action',
            action: 'createUser',
            bid: claimBoard,
            errorName: error instanceof Error ? error.name : undefined,
            errorMessage:
                error instanceof Error ? error.message : String(error),
        })
        Sentry.captureException(error, {
            extra: {
                message: 'Error while claiming board for new user',
                boardID: claimBoard,
            },
        })
    }
}
