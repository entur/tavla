'use server'

import {
    getConfig,
    initializeAdminApp,
    userCanEditFolder,
} from 'app/(admin)/utils/firebase'
import { getUserFromSessionCookie } from 'app/(admin)/utils/server'
import createDOMPurify from 'dompurify'
import { getFirestore } from 'firebase-admin/firestore'
import { getDownloadURL, getStorage } from 'firebase-admin/storage'
import { JSDOM } from 'jsdom'
import { nanoid } from 'nanoid'
import { revalidatePath } from 'next/cache'
import { NextRequest } from 'next/server'
import { FolderDB } from 'types/db-types/folders'
import rateLimit from 'utils/rateLimit'

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
        return new Response(JSON.stringify({ error: 'Invalid token' }), {
            status: 401,
            headers: response.headers,
        })
    }

    try {
        await rateLimiter.check(response, 5, user.uid)
    } catch {
        response.headers.set('Content-Type', 'application/json')
        return new Response(JSON.stringify({ error: 'Too Many Requests' }), {
            headers: response.headers,
            status: 429,
        })
    }
    const data = await request.formData()
    const folderid = data.get('folderid') as FolderDB['id']

    const logo = data.get('logo') as File

    if (!logo || !folderid)
        return new Response(JSON.stringify({ error: 'Missing values' }), {
            headers: response.headers,
            status: 400,
        })

    try {
        await userCanEditFolder(folderid)
    } catch {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            headers: response.headers,
            status: 403,
        })
    }
    if (logo.size > 10_000_000)
        return new Response(JSON.stringify({ error: 'File size too big' }), {
            headers: response.headers,
            status: 413,
        })

    const allowedFileTypes = [
        'image/apng',
        'image/jpeg',
        'image/png',
        'image/svg+xml',
        'image/svg',
        'image/webp',
    ]
    if (!allowedFileTypes.includes(logo.type)) {
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
    await file.save(processedFile)

    const logoUrl = await getDownloadURL(file)

    if (!logoUrl)
        return new Response(
            JSON.stringify({ error: 'Failed to get logo url' }),
            {
                headers: response.headers,
                status: 500,
            },
        )

    await db.collection('folders').doc(folderid).update({
        logo: logoUrl,
    })
    revalidatePath(`/mapper/${folderid}`)
    return new Response(
        JSON.stringify({ message: 'Logo uploaded successfully' }),
        {
            headers: response.headers,
            status: 200,
        },
    )
}
