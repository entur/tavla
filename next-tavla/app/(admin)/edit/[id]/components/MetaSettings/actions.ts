'use server'
import { initializeAdminApp } from 'Admin/utils/firebase'
import { firestore } from 'firebase-admin'
import { revalidatePath } from 'next/cache'
import { TMeta } from 'types/meta'
import { TBoardID } from 'types/settings'

initializeAdminApp()

export async function saveMeta(bid: TBoardID, meta: TMeta) {
    await firestore().collection('boards').doc(bid).update({ meta: meta })
    revalidatePath(`/edit/${bid}`)
}
