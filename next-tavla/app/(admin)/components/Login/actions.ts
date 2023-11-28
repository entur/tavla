'use server'
import { cookies } from 'next/headers'
import admin from 'firebase-admin'
import { initializeAdminApp } from 'Admin/utils/firebase'

initializeAdminApp()

export async function logout() {
    cookies().delete('session')
}

export async function login(data: FormData) {
    const email = data.get('email')
    const password = data.get('password')

    try {
        admin.auth().verifyIdToken
    } catch (error: unknown) {
        if (error instanceof FirebaseError) {
            setError(error)
        }
    }
}

export async function create(data: FormData) {}
