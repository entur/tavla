'use server'

import { TFormFeedback, getFormFeedbackForError } from 'app/(admin)/utils'
import { revalidatePath } from 'next/cache'
import { TLogo, TOrganizationID } from 'types/settings'
import { getFilename } from './utils'
import { storage, firestore } from 'firebase-admin'
import {
    getConfig,
    initializeAdminApp,
    userCanEditOrganization,
} from 'app/(admin)/utils/firebase'
import { getDownloadURL } from 'firebase-admin/storage'
import { redirect } from 'next/navigation'
import { nanoid } from 'nanoid'

initializeAdminApp()

export async function upload(
    prevState: TFormFeedback | undefined,
    data: FormData,
) {
    const logo = data.get('logo') as File
    const oid = data.get('oid') as TOrganizationID

    if (!logo || !oid) return getFormFeedbackForError()

    if (logo.size > 10_000_000)
        return getFormFeedbackForError('file/size-too-big')

    const access = userCanEditOrganization(oid)
    if (!access) return redirect('/')

    const bucket = storage().bucket((await getConfig()).bucket)
    const file = bucket.file(`logo/${oid}-${nanoid()}`)
    await file.save(Buffer.from(await logo.arrayBuffer()))

    const logoUrl = await getDownloadURL(file)

    if (!logoUrl) return getFormFeedbackForError()

    await firestore().collection('organizations').doc(oid).update({
        logo: logoUrl,
    })

    revalidatePath('/')
}

export async function remove(oid?: TOrganizationID, logo?: TLogo) {
    if (!oid || !logo)
        return getFormFeedbackForError('auth/operation-not-allowed')

    const file = getFilename(logo)

    if (!file) return getFormFeedbackForError()

    const access = userCanEditOrganization(oid)
    if (!access) return redirect('/')

    const bucket = storage().bucket((await getConfig()).bucket)
    const logoFile = bucket.file('logo/' + file)

    await logoFile.delete()

    await firestore().collection('organizations').doc(oid).update({
        logo: firestore.FieldValue.delete(),
    })

    revalidatePath('/')
}
