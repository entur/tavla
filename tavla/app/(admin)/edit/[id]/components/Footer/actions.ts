'use server'
import { isEmptyOrSpaces } from 'app/(admin)/edit/utils'
import {
    hasBoardEditorAccess,
    initializeAdminApp,
} from 'app/(admin)/utils/firebase'
import { firestore } from 'firebase-admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { TBoardID, TFooter } from 'types/settings'

initializeAdminApp()

export async function setFooter(bid: TBoardID, footer?: TFooter) {
    const access = hasBoardEditorAccess(bid)
    if (!access) return redirect('/')

    await firestore()
        .collection('boards')
        .doc(bid)
        .update({
            footer: {
                footer:
                    !footer?.footer || !isEmptyOrSpaces(footer?.footer)
                        ? footer?.footer
                        : firestore.FieldValue.delete(),
                override: footer?.override,
            },
            'meta.dateModified': Date.now(),
        })
    revalidatePath(`edit/${bid}`)
}
