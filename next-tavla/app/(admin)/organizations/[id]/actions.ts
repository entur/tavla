'use server'

import { setOrganziationFooterInfo } from 'Admin/utils/firebase'
import { getFormFeedbackForError } from 'app/(admin)/utils'
import { revalidatePath } from 'next/cache'
import { TOrganizationID } from 'types/settings'

export async function setInfo(oid: TOrganizationID, info: string) {
    try {
        await setOrganziationFooterInfo(info, 'oid')
        revalidatePath('/')
    } catch (e) {
        return getFormFeedbackForError('info/error')
    }
}
