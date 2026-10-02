'use server'

import { updateBoardsInFolder } from 'app/_utils/updateBoardsInFolder'
import {
    getConfig,
    initializeAdminApp,
    userCanEditFolder,
} from 'app/(innlogget)/utils/firebase'
import { getUserFromSessionCookie } from 'app/(innlogget)/utils/server'
import { getDownloadURL, getStorage } from 'firebase-admin/storage'
import { nanoid } from 'nanoid'
import { revalidatePath } from 'next/cache'
import type { NextRequest } from 'next/server'
import { updateFolder } from 'src/firebase'
import type { FolderDB } from 'src/types/db-types/folders'
import { logToGcp } from 'src/utils/logging'
import rateLimit from 'src/utils/rateLimit'
import { sanitizeSvg } from './sanitizeSvg'

initializeAdminApp()

const rateLimiter = rateLimit({
    maxUniqueTokens: 100,
    interval: 60000,
})
export async function POST(request: NextRequest) {
    const user = await getUserFromSessionCookie()
    const response = new Response()
    response.headers.set('Content-Type', 'application/json')
    if (!user?.uid) {
        logToGcp('warning', 'upload rejected: invalid token', {
            type: 'http',
            method: 'POST',
            path: '/api/upload',
            status: 401,
        })
        return new Response(JSON.stringify({ error: 'Invalid token' }), {
            status: 401,
            headers: response.headers,
        })
    }

    try {
        await rateLimiter.check(response, 5, user.uid)
    } catch {
        response.headers.set('Content-Type', 'application/json')
        logToGcp('warning', 'upload rejected: rate limited', {
            type: 'http',
            method: 'POST',
            path: '/api/upload',
            status: 429,
        })
        return new Response(JSON.stringify({ error: 'Too Many Requests' }), {
            headers: response.headers,
            status: 429,
        })
    }
    const data = await request.formData()
    const folderid = data.get('folderid') as FolderDB['id']

    const logo = data.get('logo') as File

    if (!logo || !folderid) {
        logToGcp('warning', 'upload rejected: missing values', {
            type: 'http',
            method: 'POST',
            path: '/api/upload',
            status: 400,
        })
        return new Response(JSON.stringify({ error: 'Missing values' }), {
            headers: response.headers,
            status: 400,
        })
    }
    const canEdit = await userCanEditFolder(folderid)
    if (!canEdit) {
        logToGcp('warning', 'upload rejected: unauthorized', {
            type: 'http',
            method: 'POST',
            path: '/api/upload',
            status: 403,
            folderId: folderid,
        })
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            headers: response.headers,
            status: 403,
        })
    }

    if (logo.size > 10_000_000) {
        logToGcp('warning', 'upload rejected: file too large', {
            type: 'http',
            method: 'POST',
            path: '/api/upload',
            status: 413,
            folderId: folderid,
            context: { size: logo.size },
        })
        return new Response(JSON.stringify({ error: 'File size too big' }), {
            headers: response.headers,
            status: 413,
        })
    }

    const allowedFileTypes = [
        'image/apng',
        'image/jpeg',
        'image/png',
        'image/svg+xml',
        'image/svg',
        'image/webp',
    ]
    if (!allowedFileTypes.includes(logo.type)) {
        logToGcp('warning', 'upload rejected: unsupported file type', {
            type: 'http',
            method: 'POST',
            path: '/api/upload',
            status: 415,
            folderId: folderid,
            context: { contentType: logo.type },
        })
        return new Response(
            JSON.stringify({ error: 'Unsupported file type' }),
            {
                headers: response.headers,
                status: 415,
            },
        )
    }
    let processedFile: Buffer

    if (logo.type === 'image/svg+xml') {
        const svgContent = new TextDecoder().decode(await logo.arrayBuffer())
        const sanitizedSVG = sanitizeSvg(svgContent)
        processedFile = Buffer.from(sanitizedSVG)
    } else {
        processedFile = Buffer.from(await logo.arrayBuffer())
    }
    const bucket = getStorage().bucket((await getConfig()).bucket)

    const file = bucket.file(`logo/${folderid}-${nanoid()}`)
    await file.save(processedFile, {
        metadata: {
            contentType: logo.type,
        },
    })

    const logoUrl = await getDownloadURL(file)

    if (!logoUrl) {
        logToGcp('error', 'upload failed: no logo url', {
            type: 'http',
            method: 'POST',
            path: '/api/upload',
            status: 500,
            folderId: folderid,
        })
        return new Response(
            JSON.stringify({ error: 'Failed to get logo url' }),
            {
                headers: response.headers,
                status: 500,
            },
        )
    }

    await updateFolder(folderid, { logo: logoUrl })
    await updateBoardsInFolder(folderid)
    revalidatePath(`/mapper/${folderid}`)
    logToGcp('info', 'upload succeeded', {
        type: 'http',
        method: 'POST',
        path: '/api/upload',
        status: 200,
        folderId: folderid,
    })
    return new Response(
        JSON.stringify({ message: 'Logo uploaded successfully' }),
        {
            headers: response.headers,
            status: 200,
        },
    )
}
