'use server'
import { cookies } from 'next/headers'
import { initializeAdminApp, verifySession } from './firebase'

initializeAdminApp()

export async function getUserFromSessionCookie() {
    const session = cookies().get('session')
    return await verifySession(session?.value)
}
