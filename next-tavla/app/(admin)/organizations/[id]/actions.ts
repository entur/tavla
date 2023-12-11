'use server'

import { setOrganziationFooterInfo } from 'Admin/utils/firebase'
import { revalidatePath } from 'next/cache'
import { TOrganizationID } from 'types/settings'

export async function setInfo(oid: TOrganizationID, info: string) {
    await setOrganziationFooterInfo(info, oid)
    revalidatePath('/')
}
