'use server'
import { cookies } from 'next/headers'
import { logToGcp } from 'src/utils/logging'
import { initializeAdminApp, verifySession } from './firebase'

initializeAdminApp()

export async function getUserFromSessionCookie() {
    const session = (await cookies()).get('session')
    const user = await verifySession(session?.value)
    await logToGcp(
        'info',
        `Incoming user session request: user=${user?.uid ?? 'unauthenticated'}`,
    )
    return user
}
