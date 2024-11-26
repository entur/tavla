'use server'

import { TOrganizationID } from 'types/settings'
import { storage, firestore } from 'firebase-admin'
import {
    getConfig,
    initializeAdminApp,
    userCanEditOrganization,
} from 'app/(admin)/utils/firebase'
import { getDownloadURL } from 'firebase-admin/storage'
import { nanoid } from 'nanoid'
import createDOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'
import { NextRequest, NextResponse } from 'next/server'

initializeAdminApp()

export async function POST(request: NextRequest) {
    const data = await request.formData()

    const logo = data.get('logo') as File

    const oid = data.get('oid') as TOrganizationID

    if (!logo || !oid)
        return NextResponse.json({ error: 'Missing values' }, { status: 400 })

    if (logo.size > 10_000_000)
        return NextResponse.json(
            { error: 'File size too big' },
            { status: 413 },
        )

    const access = userCanEditOrganization(oid)
    if (!access) return NextResponse.redirect('/', { status: 403 })

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
        return NextResponse.json(
            { error: 'Failed to get logo url' },
            { status: 500 },
        )

    await firestore().collection('organizations').doc(oid).update({
        logo: logoUrl,
    })

    return NextResponse.json(
        { message: 'Logo uploaded successfully', logoUrl },
        { status: 200 },
    )
}
