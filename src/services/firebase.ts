import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'
import { firestore } from 'firebase'

import { Settings } from '../settings/index'
import { getDocumentId } from '../utils'

const SETTINGS_COLLECTION = 'settings'

type DocumentReference = firestore.DocumentReference

export const getSettings = (id: string): DocumentReference => {
    return firebase.firestore().collection(SETTINGS_COLLECTION).doc(id)
}

export const updateSettingField = async (
    docId: string,
    fieldId: string,
    fieldValue:
        | string
        | number
        | string[]
        | firebase.firestore.GeoPoint
        | { [key: string]: string[] },
): Promise<void> => {
    return firebase
        .firestore()
        .collection(SETTINGS_COLLECTION)
        .doc(docId)
        .update({ [fieldId]: fieldValue })
}

export const createSettings = async (
    settings: Settings,
): Promise<DocumentReference> => {
    return firebase.firestore().collection(SETTINGS_COLLECTION).add(settings)
}

export const uploadLogo = async (image: File): Promise<string> => {
    const token = await firebase.auth().currentUser.getIdToken()

    const getImageUploadToken = firebase
        .functions()
        .httpsCallable('getImageUploadToken')

    const documentId = getDocumentId()

    const response = await getImageUploadToken({ imageUid: documentId, token })

    await firebase.auth().signInWithCustomToken(response.data.uploadToken)

    const uploadTask = firebase
        .storage()
        .ref()
        .child(`images/${documentId}`)
        .put(image)

    return new Promise((resolve, reject) => {
        uploadTask.on(
            firebase.storage.TaskEvent.STATE_CHANGED,
            null,
            reject,
            async () => {
                resolve(await uploadTask.snapshot.ref.getDownloadURL())
            },
        )
    })
}
