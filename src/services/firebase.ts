import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'
import { firestore } from 'firebase'

import { Settings } from '../settings/index'
import { getDocumentId } from '../utils'

const SETTINGS_COLLECTION = 'settings'

type DocumentReference = firestore.DocumentReference
type QuerySnapshot = firestore.QuerySnapshot

export const getSettings = (id: string): DocumentReference => {
    return firebase.firestore().collection(SETTINGS_COLLECTION).doc(id)
}

export const getBoardsOnSnapshot = (
    userId: string,
    observer: {
        next: (querySnapshot: QuerySnapshot) => void
        error: () => void
    },
): (() => void) => {
    const db = firebase.firestore()
    return db
        .collection(SETTINGS_COLLECTION)
        .where('owners', 'array-contains', userId)
        .onSnapshot(observer)
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

export const uploadLogo = async (
    image: File,
    onProgress: (progress: number) => void,
    onFinished: (url: string) => void,
    onError: () => void,
): Promise<void> => {
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

    uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
            const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
            )

            onProgress(progress)
        },
        onError,
        async () => {
            onFinished(await uploadTask.snapshot.ref.getDownloadURL())
        },
    )
}
