import { initializeAdminApp } from 'Admin/utils/firebase'
import { NextApiRequest, NextApiResponse } from 'next'
import { TSettings } from 'types/settings'
import { setBoardSettings } from 'utils/firebase'

initializeAdminApp()

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {
    const document = request.headers.authorization
    if (document?.startsWith('documentId ')) {
        const documentId = document.split('documentId ')[1] ?? ''

        const settings = request.body as TSettings
        await setBoardSettings(documentId, settings)

        return response.status(200).json({ message: 'Successfully updated!' })
    }
    return response.status(400).json({ error: 'Could not update!' })
}
