'use server'

import {
    getConfig,
    initializeAdminApp,
    userCanEditFolder,
} from 'app/(innlogget)/utils/firebase'
import { getUserFromSessionCookie } from 'app/(innlogget)/utils/server'
import createDOMPurify from 'dompurify'
import { getFirestore } from 'firebase-admin/firestore'
import { getDownloadURL, getStorage } from 'firebase-admin/storage'
import { JSDOM } from 'jsdom'
import { nanoid } from 'nanoid'
import { revalidatePath } from 'next/cache'
import type { NextRequest } from 'next/server'
import type { FolderDB } from 'src/types/db-types/folders'
import { logToGcp } from 'src/utils/logging'
import rateLimit from 'src/utils/rateLimit'

initializeAdminApp()

const db = getFirestore()

const rateLimiter = rateLimit({
    maxUniqueTokens: 100,
    interval: 60000,
})
export async function POST(request: NextRequest) {
    const user = await getUserFromSessionCookie()
    const response = new Response()
    response.headers.set('Content-Type', 'application/json')
    if (!user || !user.uid) {
        await logToGcp(
            'warning',
            'POST /api/upload: status=401 reason=invalid-token',
        )
        return new Response(JSON.stringify({ error: 'Invalid token' }), {
            status: 401,
            headers: response.headers,
        })
    }

    try {
        await rateLimiter.check(response, 5, user.uid)
    } catch {
        response.headers.set('Content-Type', 'application/json')
        await logToGcp(
            'warning',
            `POST /api/upload: status=429 uid=${user.uid}`,
        )
        return new Response(JSON.stringify({ error: 'Too Many Requests' }), {
            headers: response.headers,
            status: 429,
        })
    }
    const data = await request.formData()
    const folderid = data.get('folderid') as FolderDB['id']

    const logo = data.get('logo') as File

    if (!logo || !folderid) {
        await logToGcp(
            'warning',
            `POST /api/upload: status=400 uid=${user.uid} reason=missing-values`,
        )
        return new Response(JSON.stringify({ error: 'Missing values' }), {
            headers: response.headers,
            status: 400,
        })
    }

    try {
        await userCanEditFolder(folderid)
    } catch {
        await logToGcp(
            'warning',
            `POST /api/upload: status=403 uid=${user.uid} folderid=${folderid}`,
        )
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            headers: response.headers,
            status: 403,
        })
    }
    if (logo.size > 10_000_000) {
        await logToGcp(
            'warning',
            `POST /api/upload: status=413 uid=${user.uid} size=${logo.size}`,
        )
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
        await logToGcp(
            'warning',
            `POST /api/upload: status=415 uid=${user.uid} type=${logo.type}`,
        )
        return new Response(
            JSON.stringify({ error: 'Unsupported file type' }),
            {
                headers: response.headers,
                status: 415,
            },
        )
    }
    let processedFile: Buffer
    const window = new JSDOM('').window
    const DOMPurify = createDOMPurify(window)

    if (logo.type === 'image/svg+xml') {
        const svgContent = new TextDecoder().decode(await logo.arrayBuffer())
        const sanitizedSVG = DOMPurify.sanitize(svgContent)
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
        await logToGcp(
            'error',
            `POST /api/upload: status=500 uid=${user.uid} reason=no-logo-url`,
        )
        return new Response(
            JSON.stringify({ error: 'Failed to get logo url' }),
            {
                headers: response.headers,
                status: 500,
            },
        )
    }

    await db.collection('folders').doc(folderid).update({
        logo: logoUrl,
    })
    revalidatePath(`/mapper/${folderid}`)
    await logToGcp(
        'info',
        `POST /api/upload: status=200 uid=${user.uid} folderid=${folderid}`,
    )
    return new Response(
        JSON.stringify({ message: 'Logo uploaded successfully' }),
        {
            headers: response.headers,
            status: 200,
        },
    )
}
