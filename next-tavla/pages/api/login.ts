import { getBearerTokenFromRequest } from 'Admin/utils/auth'
import { initializeAdminApp } from 'Admin/utils/firebase'
import { auth } from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'

initializeAdminApp()

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {
    try {
        const token = await getBearerTokenFromRequest(request)

        const expiresIn = 60 * 60 * 24 * 10 // Ten days in seconds
        const sessionCookie = await auth().createSessionCookie(token, {
            expiresIn: expiresIn * 1000, // Firebase expects the number in milliseconds
        })

        response.setHeader(
            'Set-Cookie',
            `session=${sessionCookie};HttpOnly;Max-Age=${expiresIn};Secure;SameSite=Strict;Path=/;`,
        )
        return response.status(200).json({ message: 'Successfully logged in.' })
    } catch (e) {
        if (e instanceof Error)
            return response
                .status(400)
                .json({ error: `Login failed, reason: ${e.message}` })
        return response
            .status(400)
            .json({ error: 'Login failed, reason: Unknown' })
    }
}
