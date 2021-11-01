import {
    collection,
    getDoc,
    query,
    doc,
    where,
    onSnapshot,
    updateDoc,
    serverTimestamp,
    arrayRemove,
    deleteDoc,
    addDoc,
    setDoc,
} from 'firebase/firestore'

import { httpsCallable } from 'firebase/functions'

import type {
    DocumentReference,
    QuerySnapshot,
    GeoPoint,
} from 'firebase/firestore'

import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { signInWithCustomToken } from 'firebase/auth'

import { storage, db, auth, functions } from '../firebase-init'

import { Settings } from '../settings/index'
import { getDocumentId } from '../utils'
import { FieldTypes } from '../settings/FirestoreStorage'
import { BoardOwnersData } from '../types'

const SETTINGS_COLLECTION = 'settings'

export const getSettings = (id: string): DocumentReference =>
    doc(collection(db, SETTINGS_COLLECTION), id)

export const getBoardsOnSnapshot = (
    userId: string,
    observer: {
        next: (querySnapshot: QuerySnapshot) => void
        error: () => void
    },
): (() => void) => {
    const q = query(
        collection(db, SETTINGS_COLLECTION),
        where('owners', 'array-contains', userId),
    )
    return onSnapshot(q, observer)
}

export const getSharedBoardsOnSnapshot = (
    userUID: string | null,
    observer: {
        next: (querySnapshot: QuerySnapshot) => void
        error: () => void
    },
): (() => void) => {
    const q = query(
        collection(db, SETTINGS_COLLECTION),
        where('ownerRequestRecipients', 'array-contains', userUID),
    )
    return onSnapshot(q, observer)
}

export const updateSingleSettingsField = async (
    docId: string,
    fieldId: string,
    fieldValue: FieldTypes,
): Promise<void> =>
    updateDoc(doc(collection(db, SETTINGS_COLLECTION), docId), {
        [fieldId]: fieldValue,
        lastmodified: serverTimestamp(),
    })

export const updateMultipleSettingsFields = async (
    docId: string,
    settings: Settings,
): Promise<void> =>
    updateDoc(doc(collection(db, SETTINGS_COLLECTION), docId), {
        ...settings,
        lastmodified: serverTimestamp(),
    })

export const removeFromArray = async (
    docId: string,
    fieldId: string,
    fieldValue:
        | string
        | number
        | string[]
        | GeoPoint
        | { [key: string]: string[] },
): Promise<void> =>
    updateDoc(doc(collection(db, SETTINGS_COLLECTION), docId), {
        [fieldId]: arrayRemove(fieldValue),
        lastmodified: serverTimestamp(),
    })

export const deleteDocument = async (docId: string): Promise<void> =>
    deleteDoc(doc(collection(db, SETTINGS_COLLECTION), docId))

export const createSettings = async (
    settings: Settings,
): Promise<DocumentReference> =>
    addDoc(collection(db, SETTINGS_COLLECTION), settings)

export const createSettingsWithId = async (
    settings: Settings,
    docId: string,
): Promise<void> =>
    setDoc(doc(collection(db, SETTINGS_COLLECTION), docId), settings)

export const uploadLogo = async (
    image: File,
    onProgress: (progress: number) => void,
    onFinished: (url: string) => void,
    onError: () => void,
): Promise<void> => {
    const token = await auth.currentUser?.getIdToken()
    interface ResponseData {
        uploadToken: string | undefined
    }

    interface UploadData {
        imageUid: string | undefined
        token: string | undefined
    }

    const getImageUploadToken = httpsCallable<UploadData, ResponseData>(
        functions,
        'getImageUploadToken',
    )

    const documentId = getDocumentId()

    const response = await getImageUploadToken({ imageUid: documentId, token })

    if (response.data.uploadToken)
        await signInWithCustomToken(auth, response.data.uploadToken)

    const uploadTask = uploadBytesResumable(
        ref(storage, `images/${documentId}`),
        image,
    )

    uploadTask.on(
        'state_changed',
        (snapshot) => {
            const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
            )
            onProgress(progress)
        },
        onError,
        async () => {
            onFinished(
                await getDownloadURL(ref(storage, `images/${documentId}`)),
            )
            updateDoc(doc(collection(db, SETTINGS_COLLECTION), documentId), {
                lastmodified: serverTimestamp(),
            })
        },
    )
}

export const copySettingsToNewId = (
    newDocId: string,
    settings: Settings | null,
): Promise<boolean> => {
    const newDocRef: DocumentReference = getSettings(newDocId)

    return getDoc(newDocRef)
        .then((document) => {
            if (document.exists()) {
                return false
            } else {
                if (settings) {
                    createSettingsWithId(settings, newDocId)
                    return true
                } else {
                    return false
                }
            }
        })
        .catch(() => false)
}

export const setIdToBeDeleted = (docId: string): Promise<void> =>
    updateSingleSettingsField(docId, 'delete', true)

export const getOwnerEmailsByUIDs = async (ownersList: string[]) => {
    interface UploadData {
        ownersList: string[]
    }

    const getEmailsByUIDs = httpsCallable<UploadData, BoardOwnersData[]>(
        functions,
        'getEmailsByUIDs',
    )

    const response = await getEmailsByUIDs({ ownersList } as UploadData)
    const ownerData: BoardOwnersData[] = response.data

    return ownerData
}

export const getEmailByUID = async (uid: string) => {
    interface UploadData {
        ownersList: string[]
    }

    const getEmailsByUIDs = httpsCallable<UploadData, BoardOwnersData[]>(
        functions,
        'getEmailsByUIDs',
    )

    const response = await getEmailsByUIDs({ ownersList: [uid] } as UploadData)
    const ownerData: BoardOwnersData = response.data[0]

    return ownerData
}

export const getOwnerUIDByEmail = async (email: string) => {
    interface UploadData {
        email: string
    }

    const getUIDsByEmail = httpsCallable<UploadData, BoardOwnersData | string>(
        functions,
        'getUIDByEmail',
    )

    const response = await getUIDsByEmail({ email } as UploadData)
    const ownerData: BoardOwnersData | string = response.data

    return ownerData
}
