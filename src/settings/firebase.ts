import type {
    DocumentData,
    DocumentReference,
    GeoPoint,
    QuerySnapshot,
} from 'firebase/firestore'
import {
    addDoc,
    arrayRemove,
    collection,
    collectionGroup,
    deleteDoc,
    doc,
    DocumentSnapshot,
    getDoc,
    getDocs,
    onSnapshot,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    where,
} from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import type { User } from 'firebase/auth'
import { signInWithCustomToken } from 'firebase/auth'
import { BoardOwnersData } from 'src/types'
import { auth, db, functions, storage } from './firebase-init'
import { FieldTypes } from './FirestoreStorage'
import { Settings } from './settings'

const SETTINGS_COLLECTION = 'settings'

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
    await setDoc(doc(collection(db, SETTINGS_COLLECTION), docId), settings)

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
                await copySubCollectionToId('invites', currentDocId, newDocId)
                return true
            }
            return false
        } else {
            await createSettingsWithId(settings, newDocId)
            await copySubCollectionToId('invites', currentDocId, newDocId)
            return true
        }
    } catch {
        return false
    }
}

export const copySubCollectionToId = async (
    subCollectionId: string,
    fromParentDocId: string,
    toParentDocId: string,
): Promise<void> => {
    const fromSubCollectionRef = collection(
        db,
        SETTINGS_COLLECTION,
        fromParentDocId,
        subCollectionId,
    )
    const toSubCollectionRef = collection(
        db,
        SETTINGS_COLLECTION,
        toParentDocId,
        subCollectionId,
    )

    const fromSubcollectionDocs = await getDocs(fromSubCollectionRef)

    fromSubcollectionDocs.docs.forEach((inviteDoc) => {
        setDoc(doc(toSubCollectionRef, inviteDoc.id), inviteDoc.data())
    })
}

export const setIdToBeDeleted = (docId: string): Promise<void> =>
    updateSingleSettingsField(docId, 'isScheduledForDelete', true)

export const deleteDocument = async (docId: string): Promise<void> =>
    deleteDoc(doc(collection(db, SETTINGS_COLLECTION), docId))

export const uploadLogo = async (
    image: File,
    onProgress: (progress: number) => void,
    onFinished: (url: string) => void,
    onError: () => void,
    documentId: string | undefined,
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
        imageUid: documentId,
        token,
    })

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

export const getBoardOnSnapshot = (
    boardID: string | undefined,
    observer: {
        next: (documentSnapshot: DocumentSnapshot) => void
        error: () => void
    },
): (() => void) => {
    const documentReference = getSettingsReference(boardID ?? '')

    return onSnapshot(documentReference, observer)
}

export const getBoardsForUserOnSnapshot = (
    user: User | null | undefined,
    observer: {
        next: (querySnapshot: QuerySnapshot) => void
        error: () => void
    },
): (() => void) => {
    const boardsQuery = query(
        collection(db, SETTINGS_COLLECTION),
        where('owners', 'array-contains', user?.uid ?? ''),
    )
    return onSnapshot(boardsQuery, observer)
}

export const getBoardsByIds = (
    boardIds: string[],
): Promise<Array<DocumentSnapshot<DocumentData>>> =>
    Promise.all(boardIds.map((id) => getDoc(doc(db, SETTINGS_COLLECTION, id))))

export const getInvitesForUserOnSnapshot = (
    userEmail: string | null,
    observer: {
        next: (querySnapshot: QuerySnapshot) => void
        error: () => void
    },
): (() => void) => {
    const invitesQuery = query(
        collectionGroup(db, 'invites'),
        where('receiver', '==', userEmail),
    )
    return onSnapshot(invitesQuery, observer)
}

export const getInvitesForBoardOnSnapshot = (
    parentDocId: string | undefined,
    observer: {
        next: (querySnapshot: QuerySnapshot) => void
        error: () => void
    },
): (() => void) => {
    const invitesQuery = query(
        collection(db, SETTINGS_COLLECTION + '/' + parentDocId + '/invites'),
    )
    return onSnapshot(invitesQuery, observer)
}

export const addNewInviteToBoard = async (
    parentDocId: string,
    receiver: string,
    sender: string | undefined,
): Promise<boolean> => {
    try {
        await addDoc(
            collection(
                db,
                SETTINGS_COLLECTION + '/' + parentDocId + '/' + 'invites',
            ),
            {
                receiver,
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
        where('receiver', '==', user.email),
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
): Promise<void> => {
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
        where('receiver', '==', emailToRemove),
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

    return response.data
}
