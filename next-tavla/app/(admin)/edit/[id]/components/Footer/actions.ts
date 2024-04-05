'use server'
import {
    hasBoardEditorAccess,
    initializeAdminApp,
} from 'app/(admin)/utils/firebase'
import { firestore } from 'firebase-admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { TBoardID } from 'types/settings'

initializeAdminApp()

export async function saveFooter(bid: TBoardID, footer?: string) {
    const access = hasBoardEditorAccess(bid)
    if (!access) return redirect('/')

    await firestore()
        .collection('boards')
        .doc(bid)
        .update({
            footer:
                footer?.length !== 0 ? footer : firestore.FieldValue.delete(),
            'meta.dateModified': Date.now(),
        })
    revalidatePath(`/edit/${bid}`)
}
