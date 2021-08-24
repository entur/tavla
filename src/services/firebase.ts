import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/functions'
import 'firebase/storage'

import { Settings } from '../settings/index'
import { getDocumentId } from '../utils'
import { FieldTypes } from '../settings/FirestoreStorage'

const SETTINGS_COLLECTION = 'settings'

type DocumentReference = firebase.firestore.DocumentReference
type QuerySnapshot = firebase.firestore.QuerySnapshot

export const getSettings = (id: string): DocumentReference =>
    firebase.firestore().collection(SETTINGS_COLLECTION).doc(id)

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
    fieldValue: FieldTypes,
): Promise<void> =>
    firebase
        .firestore()
        .collection(SETTINGS_COLLECTION)
        .doc(docId)
        .update({
            [fieldId]: fieldValue,
            lastmodified: firebase.firestore.FieldValue.serverTimestamp(),
        })

export const removeFromArray = async (
    docId: string,
    fieldId: string,
    fieldValue:
        | string
        | number
        | string[]
        | firebase.firestore.GeoPoint
        | { [key: string]: string[] },
): Promise<void> =>
    firebase
        .firestore()
        .collection(SETTINGS_COLLECTION)
        .doc(docId)
        .update({
            [fieldId]: firebase.firestore.FieldValue.arrayRemove(fieldValue),
            lastmodified: firebase.firestore.FieldValue.serverTimestamp(),
        })

export const deleteDocument = async (docId: string): Promise<void> =>
    firebase.firestore().collection(SETTINGS_COLLECTION).doc(docId).delete()

export const createSettings = async (
    settings: Settings,
): Promise<DocumentReference> =>
    firebase.firestore().collection(SETTINGS_COLLECTION).add(settings)

export const createSettingsWithId = async (
    settings: Settings,
    docId: string,
): Promise<void> => {
    firebase
        .firestore()
        .collection(SETTINGS_COLLECTION)
        .doc(docId)
        .set({ ...settings })
        .catch(() => {
            console.error(
                'Error creating document',
                `${SETTINGS_COLLECTION}/${docId}`,
            )
        })
}
export const uploadLogo = async (
    image: File,
    onProgress: (progress: number) => void,
    onFinished: (url: string) => void,
    onError: () => void,
): Promise<void> => {
    const token = await firebase.auth().currentUser?.getIdToken()

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
            firebase
                .firestore()
                .collection(SETTINGS_COLLECTION)
                .doc(documentId)
                .update({
                    lastmodified:
                        firebase.firestore.FieldValue.serverTimestamp(),
                })
        },
    )
}
