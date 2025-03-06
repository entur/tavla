'use server'

import { TOrganizationID } from 'types/settings'
import { deleteOrganization as deleteOrg } from 'app/(admin)/utils/firebase'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { TFormFeedback, getFormFeedbackForError } from 'app/(admin)/utils'
import { getUserFromSessionCookie } from 'app/(admin)/utils/server'
import { handleError } from 'app/(admin)/utils/handleError'

export async function deleteOrganization(
    prevState: TFormFeedback | undefined,
    data: FormData,
) {
    const user = await getUserFromSessionCookie()

    if (!user) redirect('/')

    const oid = data.get('oid') as TOrganizationID
    if (!oid) return getFormFeedbackForError('general')

    const organizationName = data.get('oname') as string
    const name = data.get('name') as string
    if (name !== organizationName)
        return getFormFeedbackForError('organization/name-mismatch')

    try {
        await deleteOrg(oid)
        revalidatePath('/')
    } catch (e) {
        return handleError(e)
    }

    redirect('/boards')
}
