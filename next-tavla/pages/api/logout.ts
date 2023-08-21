import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {
    response.setHeader('Set-Cookie', `session="";Max-Age=-1;`)
    return response.status(200).json({ message: 'Successfully logged out!' })
}
