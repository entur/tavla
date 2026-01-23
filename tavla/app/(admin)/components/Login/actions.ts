'use server'
import * as Sentry from '@sentry/nextjs'
import {
    initializeAdminApp,
    revokeUserTokenOnLogout,
} from 'app/(admin)/utils/firebase'
import admin, { auth, firestore } from 'firebase-admin'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { UserDB } from 'src/types/db-types/users'

initializeAdminApp()

export async function logout() {
    revokeUserTokenOnLogout()
    ;(await cookies()).delete('session')
    revalidatePath('/')
    redirect('/')
}

export async function login(token: string) {
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
    try {
        await firestore().collection('users').doc(uid).create({})
    } catch (error) {
        Sentry.captureException(error, {
            extra: {
                message: 'Error while creating new user',
                userID: uid,
            },
        })
        throw error
    }
}
