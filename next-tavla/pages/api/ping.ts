import { initializeAdminApp } from 'Admin/utils/firebase'
import { NextApiRequest, NextApiResponse } from 'next'
import { setLastActive } from 'utils/firebase'

initializeAdminApp()

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {
    const document = request.headers.authorization
    if (document?.startsWith('documentId ')) {
        const documentId = document.split('documentId ')[1] ?? ''

        await setLastActive(documentId)

        return response.status(200).json({ message: 'Successfully updated!' })
    }
    return response.status(400).json({ error: 'Could not update!' })
}
