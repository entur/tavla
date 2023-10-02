import { initializeAdminApp } from 'Admin/utils/firebase'
import { NextApiRequest, NextApiResponse } from 'next'

initializeAdminApp()

export default function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {
    const { mode, oobCode } = request.query

    switch (mode) {
        case 'resetPassword':
            return response.redirect(`/reset/${oobCode}`)
        default:
            return response.redirect('/')
    }
}
