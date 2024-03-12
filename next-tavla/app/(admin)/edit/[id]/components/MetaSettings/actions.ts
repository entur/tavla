'use server'
import { initializeAdminApp } from 'Admin/utils/firebase'
import { getFormFeedbackForError } from 'app/(admin)/utils'
import { firestore } from 'firebase-admin'
import { revalidatePath } from 'next/cache'
import { TFontSize, TLocation, TMeta } from 'types/meta'
import { TBoardID } from 'types/settings'

initializeAdminApp()

export async function saveMeta(bid: TBoardID, meta: TMeta) {
    await firestore().collection('boards').doc(bid).update({ meta: meta })
    revalidatePath(`/edit/${bid}`)
}

export async function saveTitle(bid: TBoardID, title: string) {
    await firestore()
        .collection('boards')
        .doc(bid)
        .update({ 'meta.title': title })
}

export async function saveFont(bid: TBoardID, font: TFontSize) {
    await firestore()
        .collection('boards')
        .doc(bid)
        .update({ 'meta.fontSize': font })
}

export async function saveLocation(bid: TBoardID, location: TLocation) {
    if (!location) return getFormFeedbackForError()
    await firestore()
        .collection('boards')
        .doc(bid)
        .update({ 'meta.location': location })
}
