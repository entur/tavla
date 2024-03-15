'use server'
import { initializeAdminApp } from 'Admin/utils/firebase'
import { getFormFeedbackForError } from 'app/(admin)/utils'
import { firestore } from 'firebase-admin'
import { revalidatePath } from 'next/cache'
import { TFontSize, TLocation } from 'types/meta'
import { TBoardID } from 'types/settings'

initializeAdminApp()

export async function saveTitle(bid: TBoardID, title: string) {
    await firestore()
        .collection('boards')
        .doc(bid)
        .update({ 'meta.title': title })
    revalidatePath(`/edit/${bid}`)
}

export async function saveFont(bid: TBoardID, font: TFontSize) {
    await firestore()
        .collection('boards')
        .doc(bid)
        .update({ 'meta.fontSize': font })
    revalidatePath(`/edit/${bid}`)
}

export async function saveLocation(bid: TBoardID, location?: TLocation) {
    if (!bid) return getFormFeedbackForError()
    await firestore()
        .collection('boards')
        .doc(bid)
        .update({
            'meta.location':
                location?.coordinate && location.name
                    ? location
                    : firestore.FieldValue.delete(),
        })
    revalidatePath(`/edit/${bid}`)
}
