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
    firebase
        .firestore()
        .collection(SETTINGS_COLLECTION)
        .doc(docId)
        .delete()
        .catch((error) => console.info('Error: Failed to delete document'))

export const deleteDocumentsSetToBeDeleted = async (): Promise<void> =>
    firebase
        .firestore()
        .collection(SETTINGS_COLLECTION)
        .where('delete', '==', true)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                deleteDocument(doc.id)
            })
        })

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

export const copySettingsToNewId = (
    newDocId: string,
    settings: Settings | null,
): Promise<boolean> => {
    const newDocRef: DocumentReference = getSettings(newDocId)
    const currentDoc = getDocumentId() as string
    return newDocRef
        .get()
        .then((doc) => {
            if (doc.exists) {
                console.info('This Tavla-ID already exists. No new ID created') // TODO: better user feedback needed
                return false
            } else {
                if (settings) {
                    createSettingsWithId(settings, newDocId)
                    console.info('new Tavla-ID created with id ' + newDocId)
                    return true
                } else {
                    console.error(
                        "Error: No current settings exist. Can't create new Tavla-ID.",
                    )
                    return false
                }
            }
        })
        .catch((error) => {
            console.error('Error copying to new Tavla-ID', error)
            return false
        })
}

export const setIdToBeDeleted = (docId: string) => {
    updateSettingField(docId, 'delete', true)
}
