import { initializeOrGetAdminApp } from 'Admin/utils/firebase'
import { auth } from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'

const app = initializeOrGetAdminApp()

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {
    const authorization = request.headers.authorization
    if (authorization?.startsWith('Bearer ')) {
        const idToken = authorization.split('Bearer ')[1] ?? ''
        const decodedToken = await auth(app).verifyIdToken(idToken)

        if (decodedToken) {
            const expiresIn = 60 * 60 * 24 * 10 // Ten days
            const sessionCookie = await auth(app).createSessionCookie(idToken, {
                expiresIn,
            })

            response.setHeader(
                'Set-Cookie',
                `session=${sessionCookie};HttpOnly;Max-Age=${expiresIn};Secure;SameSite=Strict;Path=/;`,
            )
            return response
                .status(200)
                .json({ message: 'Successfully logged in!' })
        }
    }
    return response.status(400).json({ error: 'Could not log in!' })
}
