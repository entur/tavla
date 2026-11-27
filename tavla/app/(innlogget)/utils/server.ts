'use server'
import { cookies } from 'next/headers'
import { verifySession } from './firebase'

export async function getUserFromSessionCookie() {
    const session = (await cookies()).get('session')
    const user = await verifySession(session?.value)
    return user
}
