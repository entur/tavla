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
    DocumentSnapshot,
} from 'firebase/firestore'

import { httpsCallable } from 'firebase/functions'

import type {
    DocumentReference,
    QuerySnapshot,
    GeoPoint,
    DocumentData,
} from 'firebase/firestore'

import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { signInWithCustomToken } from 'firebase/auth'

import { storage, db, auth, functions } from '../firebase-init'

import { Settings } from '../settings/index'
import { getDocumentId } from '../utils'
import { FieldTypes } from '../settings/FirestoreStorage'
import { BoardOwnersData } from '../types'

const SETTINGS_COLLECTION = 'settings'

export const getSettingsReference = (id: string): DocumentReference =>
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

export const getBoardOnSnapshot = (
    boardID: string | undefined,
    observer: {
        next: (documentSnapshot: DocumentSnapshot) => void
        error: () => void
    },
): (() => void) => {
    const q = getSettingsReference(boardID ?? '')

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

export const copySettingsToNewId = async (
    newDocId: string,
    currentDocId: string,
): Promise<boolean> => {
    const currentDocRef: DocumentReference = getSettingsReference(currentDocId)
    const newDocRef: DocumentReference = getSettingsReference(newDocId)

    try {
        const copyFromDocument = await getDoc(currentDocRef)
        if (!copyFromDocument.exists()) return false
        const settings = copyFromDocument.data() as Settings

        const copyToDocument = await getDoc(newDocRef)

        if (copyToDocument.exists()) {
            if (copyToDocument.data().isScheduledForDelete) {
                await deleteDoc(newDocRef)
                await createSettingsWithId(settings, newDocId)
                return true
            }
            return false
        } else {
            await createSettingsWithId(settings, newDocId)
            return true
        }
    } catch {
        return false
    }
}

export const setIdToBeDeleted = (docId: string): Promise<void> =>
    updateSingleSettingsField(docId, 'isScheduledForDelete', true)

export const getOwnerEmailsByUIDs = async (
    ownersList: string[],
): Promise<BoardOwnersData[]> => {
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

export const getEmailByUID = async (uid: string): Promise<BoardOwnersData> => {
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

export const getOwnerUIDByEmail = async (
    email: string,
): Promise<string | BoardOwnersData> => {
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

export const answerBoardInvitation = async (
    boardID: string,
    recipientUID: string,
    accept: boolean,
): Promise<void> => {
    interface UploadData {
        boardID: string
        recipientUID: string
        accept: boolean
    }

    const answerBoardInvitationFunction = httpsCallable<UploadData, void>(
        functions,
        'answerBoardInvitation',
    )

    await answerBoardInvitationFunction({
        boardID,
        recipientUID,
        accept,
    } as UploadData)
}

export const userIsOwner = async (
    documentId: string,
    userUID: string | undefined,
): Promise<boolean> => {
    try {
        const documentRef: DocumentReference = getSettingsReference(documentId)
        const document = await getDoc(documentRef)
        const settings: DocumentData | undefined = document.data()
        return settings?.owners?.includes(userUID) as boolean
    } catch {
        return false
    }
}
