import type { DocumentData } from 'firebase/firestore'
import {
    DocumentReference,
    GeoPoint,
    QuerySnapshot,
    runTransaction,
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
import { Settings } from './settings'

const SETTINGS_COLLECTION = 'settings'
const INVITES_COLLECTION = 'invites'

export function getSettingsReference(id: string): DocumentReference {
    return doc(collection(db, SETTINGS_COLLECTION), id)
}

export async function updateFirebaseSettings(
    docId: string,
    settings: Partial<Settings>,
): Promise<void> {
    return updateDoc(doc(collection(db, SETTINGS_COLLECTION), docId), {
        ...settings,
        lastmodified: serverTimestamp(),
    })
}

export async function removeFromFirebaseArray(
    docId: string,
    fieldId: keyof Settings,
    fieldValue:
        | string
        | number
        | string[]
        | GeoPoint
        | { [key: string]: string[] },
): Promise<void> {
    return updateDoc(doc(collection(db, SETTINGS_COLLECTION), docId), {
        [fieldId]: arrayRemove(fieldValue),
        lastmodified: serverTimestamp(),
    })
}

export async function createSettings(
    settings: Settings,
): Promise<DocumentReference> {
    return addDoc(collection(db, SETTINGS_COLLECTION), settings)
}

export async function createSettingsWithId(
    settings: Settings,
    docId: string,
): Promise<void> {
    return await setDoc(
        doc(collection(db, SETTINGS_COLLECTION), docId),
        settings,
    )
}

export async function copySettingsToNewId(
    newDocId: string,
    currentDocId: string,
): Promise<boolean> {
    const currentDocRef: DocumentReference = getSettingsReference(currentDocId)
    const newDocRef: DocumentReference = getSettingsReference(newDocId)

    try {
        const inviteDocs = await getDocs(
            collection(
                db,
                SETTINGS_COLLECTION,
                currentDocId,
                INVITES_COLLECTION,
            ),
        )
        await runTransaction(db, async (transaction) => {
            // Get data
            const currentDoc = await transaction.get(currentDocRef)
            const newDoc = await transaction.get(newDocRef)

            const currentSettings = currentDoc.data() as Settings
            const newSettings = newDoc.data() as Settings

            if (newDoc.exists() && !newSettings.isScheduledForDelete)
                throw 'Board is already in use'

            // Set data
            if (newDoc.exists()) transaction.delete(newDocRef)

            transaction.set(newDocRef, currentSettings)
            transaction.update(currentDocRef, { isScheduledForDelete: true })
        })

        await runTransaction(db, async (transaction) => {
            inviteDocs.docs.forEach((d) => {
                transaction.set(
                    doc(
                        db,
                        SETTINGS_COLLECTION,
                        newDocId,
                        INVITES_COLLECTION,
                        d.id,
                    ),
                    d.data(),
                )
                transaction.delete(d.ref)
            })
        })
    } catch {
        return false
    }

    return true
}

export async function deleteDocument(docId: string): Promise<void> {
    return deleteDoc(doc(collection(db, SETTINGS_COLLECTION), docId))
}

export async function uploadLogo(
    image: File,
    onProgress: (progress: number) => void,
    onFinished: (url: string) => void,
    onError: () => void,
    documentId: string | undefined,
): Promise<void> {
    const token = await auth.currentUser?.getIdToken()
    type ResponseData = {
        uploadToken: string | undefined
    }

    type UploadData = {
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

export function getBoardOnSnapshot(
    boardID: string | undefined,
    observer: {
        next: (documentSnapshot: DocumentSnapshot) => void
        error: () => void
    },
): () => void {
    const documentReference = getSettingsReference(boardID ?? '')

    return onSnapshot(documentReference, observer)
}

export function getBoardsForUserOnSnapshot(
    user: User | null | undefined,
    observer: {
        next: (querySnapshot: QuerySnapshot) => void
        error: () => void
    },
): () => void {
    const boardsQuery = query(
        collection(db, SETTINGS_COLLECTION),
        where('owners', 'array-contains', user?.uid ?? ''),
    )
    return onSnapshot(boardsQuery, observer)
}

export function getBoardsByIds(
    boardIds: string[],
): Promise<Array<DocumentSnapshot<DocumentData>>> {
    return Promise.all(
        boardIds.map((id) => getDoc(doc(db, SETTINGS_COLLECTION, id))),
    )
}

export function getInvitesForUserOnSnapshot(
    userEmail: string | null,
    observer: {
        next: (querySnapshot: QuerySnapshot) => void
        error: () => void
    },
): () => void {
    const invitesQuery = query(
        collectionGroup(db, 'invites'),
        where('receiver', '==', userEmail),
    )
    return onSnapshot(invitesQuery, observer)
}

export function getInvitesForBoardOnSnapshot(
    parentDocId: string | undefined,
    observer: {
        next: (querySnapshot: QuerySnapshot) => void
        error: () => void
    },
): () => void {
    const invitesQuery = query(
        collection(db, SETTINGS_COLLECTION + '/' + parentDocId + '/invites'),
    )
    return onSnapshot(invitesQuery, observer)
}

export async function addNewInviteToBoard(
    parentDocId: string,
    receiver: string,
    sender: string | undefined,
): Promise<boolean> {
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

export async function removeRecievedBoardInvite(
    parentDocId: string,
    user: User | null | undefined,
): Promise<void> {
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

export async function removeSentBoardInviteAsOwner(
    parentDocId: string,
    currentUser: User | null | undefined,
    emailToRemove: string,
): Promise<void> {
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

export async function answerBoardInvitation(
    boardId: string,
    user: User | null | undefined,
    accept: boolean,
): Promise<void> {
    if (!user) return Promise.reject(new Error('Not logged in.'))

    type UploadData = {
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

export async function getOwnersDataByBoardIdAsOwner(
    boardId: string,
): Promise<BoardOwnersData[]> {
    type UploadData = {
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
