'use server'

import {
    removeOrganizationLogo,
    setOrganizationLogo,
} from 'Admin/utils/firebase'
import { TFormFeedback, getFormFeedbackForError } from 'app/(admin)/utils'
import { revalidatePath } from 'next/cache'
import { TLogo, TOrganizationID } from 'types/settings'

export async function upload(
    prevState: TFormFeedback | undefined,
    data: FormData,
) {
    'use server'

    const logo = data.get('logo') as File
    const oid = data.get('oid') as TOrganizationID

    if (!logo || !oid) return getFormFeedbackForError()

    if (logo.size > 10_000_000)
        return getFormFeedbackForError('file/size-too-big')

    await setOrganizationLogo(logo, oid)
    revalidatePath('/')
}

export async function remove(oid?: TOrganizationID, logo?: TLogo) {
    'use server'

    if (!oid || !logo) return getFormFeedbackForError()

    const file = await getFileName(logo)

    if (!file) return getFormFeedbackForError()

    await removeOrganizationLogo(file, oid)
    revalidatePath('/')
}

export async function getFileName(logoUrl: string) {
    const regex = /\/o\/logo%2(.*?)\?alt=/

    const file = logoUrl.match(regex)

    if (!file || !file[1]) return

    return file[1]
}
