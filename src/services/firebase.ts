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
    getDocs,
    collectionGroup,
    documentId,
} from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { signInWithCustomToken } from 'firebase/auth'

import type {
    DocumentReference,
    QuerySnapshot,
    GeoPoint,
    DocumentData,
} from 'firebase/firestore'
import type { User } from 'firebase/auth'

import { storage, db, auth, functions } from '../firebase-init'

import { Settings } from '../settings/index'
import { getDocumentId } from '../utils'
import { FieldTypes } from '../settings/FirestoreStorage'
import { BoardOwnersData } from '../types'

const SETTINGS_COLLECTION = 'settings'

const currentDocumentId = getDocumentId()

export const getSettingsReference = (id: string): DocumentReference =>
    doc(collection(db, SETTINGS_COLLECTION), id)

export const userIsOwner = async (
    boardId: string,
    userUID: string | undefined,
): Promise<boolean> => {
    try {
        const documentRef: DocumentReference = getSettingsReference(boardId)
        const document = await getDoc(documentRef)
        const settings: DocumentData | undefined = document.data()
        return settings?.owners?.includes(userUID) as boolean
    } catch {
        return false
    }
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

export const createSettings = async (
    settings: Settings,
): Promise<DocumentReference> =>
    addDoc(collection(db, SETTINGS_COLLECTION), settings)

export const createSettingsWithId = async (
    settings: Settings,
    docId: string,
): Promise<void> =>
    setDoc(doc(collection(db, SETTINGS_COLLECTION), docId), settings)

export const deleteDocument = async (docId: string): Promise<void> =>
    deleteDoc(doc(collection(db, SETTINGS_COLLECTION), docId))

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

    const response = await getImageUploadToken({
        imageUid: currentDocumentId,
        token,
    })

    if (response.data.uploadToken)
        await signInWithCustomToken(auth, response.data.uploadToken)

    const uploadTask = uploadBytesResumable(
        ref(storage, `images/${currentDocumentId}`),
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
                await getDownloadURL(
                    ref(storage, `images/${currentDocumentId}`),
                ),
            )
            updateDoc(
                doc(collection(db, SETTINGS_COLLECTION), currentDocumentId),
                {
                    lastmodified: serverTimestamp(),
                },
            )
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

// The IN query does not support more than 10 documents
export const getBoardsByIdsOnSnapshot = (
    boardIds: string[],
    observer: {
        next: (querySnapshot: QuerySnapshot) => void
        error: () => void
    },
): (() => void) => {
    const q = query(
        collection(db, SETTINGS_COLLECTION),
        where(documentId(), 'in', boardIds),
    )
    return onSnapshot(q, observer)
}

export const getInvitesForUserOnSnapshot = (
    userEmail: string | null,
    observer: {
        next: (querySnapshot: QuerySnapshot) => void
        error: () => void
    },
): (() => void) => {
    const q = query(
        collectionGroup(db, 'invites'),
        where('reciever', '==', userEmail),
    )
    return onSnapshot(q, observer)
}

export const getInvitesForBoardOnSnapshot = (
    parentDocId: string | undefined,
    observer: {
        next: (querySnapshot: QuerySnapshot) => void
        error: () => void
    },
): (() => void) => {
    const q = query(
        collection(db, SETTINGS_COLLECTION + '/' + parentDocId + '/invites'),
    )
    return onSnapshot(q, observer)
}

export const addNewInviteToBoard = async (
    parentDocId: string,
    reciever: string,
    sender: string | undefined,
): Promise<boolean> => {
    try {
        await addDoc(
            collection(
                db,
                SETTINGS_COLLECTION + '/' + parentDocId + '/' + 'invites',
            ),
            {
                reciever,
                sender: sender ?? 'Ukjent',
                timeIssued: serverTimestamp(),
            },
        )
        return true
    } catch {
        return false
    }
}

export const removeRecievedBoardInvite = async (
    parentDocId: string,
    user: User | null | undefined,
): Promise<void> => {
    if (!user) return Promise.reject(new Error('Not logged in.'))
    const userInviteQuery = query(
        collection(
            db,
            SETTINGS_COLLECTION + '/' + parentDocId + '/' + 'invites',
        ),
        where('reciever', '==', user.email),
    )
    const querySnapshot = await getDocs(userInviteQuery)
    querySnapshot.forEach(async (invite) => {
        await deleteDoc(invite.ref)
    })
}

export const removeSentBoardInviteAsOwner = async (
    parentDocId: string,
    currentUser: User | null | undefined,
    emailToRemove: string,
) => {
    if (!currentUser) return Promise.reject(new Error('Not logged in.'))

    const settingsDoc = await getDoc(
        doc(collection(db, SETTINGS_COLLECTION), parentDocId),
    )
    if (!settingsDoc.exists())
        return Promise.reject(new Error('Document not found'))
    const owners: string[] = settingsDoc.data().owners
    if (!owners.includes(currentUser.uid))
        return Promise.reject(
            new Error(
                'Current user in not an owner of board with id: ' + parentDocId,
            ),
        )

    const userInviteQuery = query(
        collection(
            db,
            SETTINGS_COLLECTION + '/' + parentDocId + '/' + 'invites',
        ),
        where('reciever', '==', emailToRemove),
    )
    const querySnapshot = await getDocs(userInviteQuery)
    querySnapshot.forEach(async (invite) => {
        await deleteDoc(invite.ref)
    })
}

export const answerBoardInvitation = async (
    boardId: string,
    user: User | null | undefined,
    accept: boolean,
): Promise<void> => {
    if (!user) return Promise.reject(new Error('Not logged in.'))

    interface UploadData {
        boardId: string
    }

    const addInvitedUserToBoardOwnersFunction = httpsCallable<
        UploadData,
        boolean
    >(functions, 'addInvitedUserToBoardOwners')

    try {
        if (accept)
            await addInvitedUserToBoardOwnersFunction({
                boardId,
            } as UploadData)
        await removeRecievedBoardInvite(boardId, user)
    } catch {
        throw new Error(
            'Could not accept board invite. Additional info might be available above.',
        )
    }
}

export const getOwnersDataByBoardIdAsOwner = async (
    boardId: string,
): Promise<BoardOwnersData[]> => {
    interface UploadData {
        boardId: string
    }

    const getOwnersDataByBoardIdAsOwnerFunction = httpsCallable<
        UploadData,
        BoardOwnersData[]
    >(functions, 'getOwnersDataByBoardIdAsOwner')

    const response = await getOwnersDataByBoardIdAsOwnerFunction({
        boardId,
    } as UploadData)
    const ownerData: BoardOwnersData[] = response.data

    return ownerData
}
