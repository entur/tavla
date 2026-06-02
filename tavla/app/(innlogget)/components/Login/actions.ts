'use server'
import * as Sentry from '@sentry/nextjs'
import {
    initializeAdminApp,
    revokeUserTokenOnLogout,
} from 'app/(innlogget)/utils/firebase'
import admin, { auth } from 'firebase-admin'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createUser } from 'src/firebase'
import type { UserDB } from 'src/types/db-types/users'
import { logToGcp } from 'src/utils/logging'

initializeAdminApp()

export async function logout() {
    logToGcp('info', 'action:logout invoked')
    revokeUserTokenOnLogout()
    ;(await cookies()).delete('session')
    revalidatePath('/')
    redirect('/')
}

export async function login(token: string) {
    logToGcp('info', 'action:login invoked')
    const expiresIn = 60 * 60 * 24 * 10 // Ten days in seconds
    const sessionCookie = await admin.auth().createSessionCookie(token, {
        expiresIn: expiresIn * 1000, // Firebase expects the number in milliseconds
    })

    const user = await auth().verifySessionCookie(sessionCookie, true)
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

export async function create(uid: UserDB['uid']) {
    logToGcp('info', 'action:createUser invoked')
    try {
        await createUser(uid)
    } catch (error) {
        logToGcp(
            'error',
            `Failed to create user: ${error instanceof Error ? error.message : String(error)}`,
        )
        Sentry.captureException(error, {
            extra: {
                message: 'Error while creating new user',
            },
        })
        throw error
    }
}
