'use server'
import { isEmptyOrSpaces } from 'app/(admin)/edit/utils'
import {
    hasBoardEditorAccess,
    initializeAdminApp,
} from 'app/(admin)/utils/firebase'
import { handleError } from 'app/(admin)/utils/handleError'
import { firestore } from 'firebase-admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { TBoardID } from 'types/settings'

initializeAdminApp()

export async function setFooter(bid: TBoardID, data: FormData) {
    const access = hasBoardEditorAccess(bid)
    if (!access) return redirect('/')

    const footerText = data.get('footer') as string
    const override = (data.get('override') as string) === 'on'

    try {
        await firestore()
            .collection('boards')
            .doc(bid)
            .update({
                footer: {
                    footer: !isEmptyOrSpaces(footerText) ? footerText : '',
                    override: override,
                },
                'meta.dateModified': Date.now(),
            })
        revalidatePath(`edit/${bid}`)
    } catch (e) {
        return handleError(e)
    }
}
