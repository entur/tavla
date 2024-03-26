'use server'
import { getFormFeedbackForError } from 'app/(admin)/utils'
import { initializeAdminApp } from 'app/(admin)/utils/firebase'
import { firestore } from 'firebase-admin'
import { revalidatePath } from 'next/cache'
import { TFontSize, TLocation } from 'types/meta'
import { TBoardID } from 'types/settings'

initializeAdminApp()

export async function saveTitle(data: FormData) {
    const bid = data.get('bid') as TBoardID
    const name = data.get('name') as string
    await firestore()
        .collection('boards')
        .doc(bid)
        .update({ 'meta.title': name, 'meta.dateModified': Date.now() })
    revalidatePath(`/edit/${bid}`)
}

export async function saveFont(data: FormData) {
    const bid = data.get('bid') as TBoardID
    const font = data.get('font') as TFontSize
    await firestore()
        .collection('boards')
        .doc(bid)
        .update({ 'meta.fontSize': font, 'meta.dateModified': Date.now() })
    revalidatePath(`/edit/${bid}`)
}

export async function saveLocation(bid: TBoardID, location?: TLocation) {
    if (!bid) return getFormFeedbackForError()
    await firestore()
        .collection('boards')
        .doc(bid)
        .update({
            'meta.location': location ?? firestore.FieldValue.delete(),
            'meta.dateModified': Date.now(),
        })
    revalidatePath(`/edit/${bid}`)
}
