'use server'

import { TFolderID } from 'types/settings'
import { storage, firestore } from 'firebase-admin'
import {
    getConfig,
    initializeAdminApp,
    userCanEditFolder,
} from 'app/(admin)/utils/firebase'
import { getDownloadURL } from 'firebase-admin/storage'
import { nanoid } from 'nanoid'
import createDOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'
import { NextRequest } from 'next/server'
import { revalidatePath } from 'next/cache'
import rateLimit from 'utils/rateLimit'
import { getUserFromSessionCookie } from 'app/(admin)/utils/server'

initializeAdminApp()

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
    const oid = data.get('oid') as TFolderID

    const logo = data.get('logo') as File

    if (!logo || !oid)
        return new Response(JSON.stringify({ error: 'Missing values' }), {
            headers: response.headers,
            status: 400,
        })

    try {
        await userCanEditFolder(oid)
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

    const bucket = storage().bucket((await getConfig()).bucket)
    const file = bucket.file(`logo/${oid}-${nanoid()}`)
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

    await firestore().collection('folders').doc(oid).update({
        logo: logoUrl,
    })
    revalidatePath(`/mapper/${oid}`)
    return new Response(
        JSON.stringify({ message: 'Logo uploaded successfully' }),
        {
            headers: response.headers,
            status: 200,
        },
    )
}
