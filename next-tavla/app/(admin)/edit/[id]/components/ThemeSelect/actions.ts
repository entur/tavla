'use server'
import {
    hasBoardEditorAccess,
    initializeAdminApp,
} from 'app/(admin)/utils/firebase'
import { firestore } from 'firebase-admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { TBoardID, TTheme } from 'types/settings'

initializeAdminApp()

export async function setTheme(bid: TBoardID, theme?: TTheme) {
    const access = await hasBoardEditorAccess(bid)
    if (!access) return redirect('/')

    await firestore()
        .collection('boards')
        .doc(bid)
        .update({ theme: theme ?? 'dark', 'meta.dateModified': Date.now() })

    revalidatePath(`/edit/${bid}`)
}
