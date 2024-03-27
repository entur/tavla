'use server'
import { cookies } from 'next/headers'
import admin, { firestore } from 'firebase-admin'
import { TUserID } from 'types/settings'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { initializeAdminApp } from 'app/(admin)/utils/firebase'

initializeAdminApp()

export async function logout() {
    cookies().delete('session')
    revalidatePath('/')
    redirect('/')
}

export async function login(token: string) {
    const expiresIn = 60 * 60 * 24 * 10 // Ten days in seconds
    const sessionCookie = await admin.auth().createSessionCookie(token, {
        expiresIn: expiresIn * 1000, // Firebase expects the number in milliseconds
    })

    cookies().set({
        name: 'session',
        value: sessionCookie,
        maxAge: expiresIn,
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
    })
}

export async function create(uid: TUserID) {
    await firestore().collection('users').doc(uid).create({})
}
