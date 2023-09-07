import { TavlaError } from 'Admin/types/error'
import { NextApiRequest } from 'next'

export async function getBearerTokenFromRequest(request: NextApiRequest) {
    const authorization = request?.headers?.authorization

    if (!authorization)
        throw new TavlaError({
            code: 'AUTHORIZATION',
            message: 'Authorization header missing.',
        })

    if (!authorization?.startsWith('Bearer '))
        throw new TavlaError({
            code: 'AUTHORIZATION',
            message: 'Bearer token was ill formatted.',
        })

    const idToken = authorization.split('Bearer ')[1]
    if (!idToken)
        throw new TavlaError({
            code: 'AUTHORIZATION',
            message: 'Bearer token missing.',
        })

    return idToken
}