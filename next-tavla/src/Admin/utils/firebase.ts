import { TConfig } from 'Admin/types/config'
import { TavlaError } from 'Admin/types/error'
import admin, { auth, firestore, storage } from 'firebase-admin'
import { getDownloadURL } from 'firebase-admin/storage'
import { UidIdentifier } from 'firebase-admin/lib/auth/identifier'
import { chunk, concat, isEmpty } from 'lodash'
import { notFound } from 'next/navigation'
import {
    TBoard,
    TBoardID,
    TOrganization,
    TOrganizationID,
    TUser,
    TUserID,
} from 'types/settings'

const FIREBASE_IN_OPERATOR_LIMIT = 30

initializeAdminApp()

export function initializeAdminApp() {
    if (admin.apps.length <= 0) {
        admin.initializeApp()
    }
}

export async function getConfig() {
    const doc = await firestore().collection('config').doc('env').get()
    return doc.data() as TConfig
}

export async function createUser(uid: TUserID) {
    return await firestore().collection('users').doc(uid).create({})
}

export async function verifySession(session?: string) {
    if (!session) return null
    try {
        return await auth().verifySessionCookie(session, true)
    } catch {
        return null
    }
}

export async function getBoard(bid: TBoardID) {
    const board = await firestore().collection('boards').doc(bid).get()
    return { id: board.id, ...board.data() } as TBoard
}

export async function getBoardsForUser(uid: TUserID) {
    const user = (
        await firestore().collection('users').doc(uid).get()
    ).data() as TUser

    if (!user)
        throw new TavlaError({
            code: 'NOT_FOUND',
            message: `Found no user with id ${uid}`,
        })

    const boardIDs = concat(user?.owner ?? [], user?.editor ?? [])

    if (isEmpty(boardIDs)) return []

    const batchedBoardIDs = chunk(boardIDs, FIREBASE_IN_OPERATOR_LIMIT)

    const boardQueries = batchedBoardIDs.map((batch) =>
        firestore()
            .collection('boards')
            .where(firestore.FieldPath.documentId(), 'in', batch)
            .get(),
    )

    const boardRefs = await Promise.all(boardQueries)

    return boardRefs
        .map((ref) =>
            ref.docs.map((doc) => ({ id: doc.id, ...doc.data() } as TBoard)),
        )
        .flat()
}

export async function setBoard(board: TBoard, uid: TUserID) {
    if (!board.id)
        throw new TavlaError({
            code: 'BOARD',
            message: 'No BoardID was provided.',
        })
    const writeAccess = await userCanWriteBoard(uid, board.id)
    if (!writeAccess)
        throw new TavlaError({
            code: 'BOARD',
            message: 'User does not have access to this board.',
        })

    const boardId = board.id

    // Remove uneccesary id field before storing
    delete board.id

    // Sanitize object by removing explicitly assigned undefined properties
    const sanitizedBoard = JSON.parse(JSON.stringify(board))

    return await firestore()
        .collection('boards')
        .doc(boardId)
        .set({
            ...sanitizedBoard,
            meta: { ...sanitizedBoard.meta, dateModified: Date.now() },
        })
}

export async function setLastActive(bid: TBoardID) {
    const board = await firestore().collection('boards').doc(bid).get()
    if (!board.exists)
        throw new TavlaError({
            code: 'BOARD',
            message: 'Board does not exist.',
        })

    firestore()
        .collection('boards')
        .doc(bid)
        .update({ 'meta.lastActive': Date.now() })
}

export async function setOrganizationLogo(logo: File, oid?: TOrganizationID) {
    if (!oid) return
    const bucket = storage().bucket((await getConfig()).bucket)
    const file = bucket.file(`logo/${oid}-${logo.name}`)
    await file.save(Buffer.from(await logo.arrayBuffer()))

    const logoUrl = await getDownloadURL(file)

    if (!logoUrl) return
    return firestore().collection('organizations').doc(oid).update({
        logo: logoUrl,
    })
}

export async function createBoard(
    id: TUserID | TOrganizationID,
    board: TBoard,
    collection: 'users' | 'organizations',
) {
    const createdBoard = await firestore()
        .collection('boards')
        .add({
            ...board,
            meta: {
                ...board.meta,
                created: Date.now(),
                dateModified: Date.now(),
            },
        })
    firestore()
        .collection(collection)
        .doc(id)
        .update({
            [collection === 'users' ? 'owner' : 'boards']:
                admin.firestore.FieldValue.arrayUnion(createdBoard.id),
        })
    return createdBoard.id
}

export async function userCanWriteBoard(uid: TUserID, bid: TBoardID) {
    const user = await getUser(uid)
    const writeAccessFromUser = concat(user?.owner, user?.editor).includes(bid)
    if (writeAccessFromUser) return true

    const organization = await getOrganizationWithBoard(bid)
    const writeAccessFromOrganization = concat(
        organization?.owners,
        organization?.editors,
    ).includes(uid)

    return writeAccessFromOrganization
}

export async function deleteBoard(bid: TBoardID, uid: TUserID) {
    const deleteAccess = await userCanDeleteBoard(uid, bid)
    if (!deleteAccess) {
        throw new TavlaError({
            code: 'BOARD',
            message: 'User does not have access to this board.',
        })
    }

    return Promise.all([
        firestore().collection('boards').doc(bid).delete(),
        removeBoardFromUser(bid, uid),
    ])
}

export async function removeBoardFromUser(bid: TBoardID, uid: TUserID) {
    return firestore()
        .collection('users')
        .doc(uid)
        .update({
            owner: admin.firestore.FieldValue.arrayRemove(bid),
            editor: admin.firestore.FieldValue.arrayRemove(bid),
        })
}

export async function userCanDeleteBoard(uid: TUserID, bid: TBoardID) {
    const user = await getUser(uid)
    const userDeleteAccess = concat(user?.owner).includes(bid)
    if (userDeleteAccess) return true

    const organization = await getOrganizationWithBoard(bid)
    const deleteAccessFromOrganization = concat(
        organization?.owners,
        organization?.editors,
    ).includes(uid)

    return deleteAccessFromOrganization
}

export async function getUser(uid: TUserID) {
    const doc = await firestore().collection('users').doc(uid).get()
    return doc.data() as TUser
}

export async function getOrganization(oid: TOrganizationID) {
    const doc = await firestore().collection('organizations').doc(oid).get()
    return { ...doc.data(), id: doc.id } as TOrganization
}

export async function getOrganizationUsers(uid: TUserID, oid: TOrganizationID) {
    const organization = await getOrganization(oid)

    if (!organization || !organization.owners?.includes(uid)) return notFound()

    const uids = concat(organization.owners ?? [], organization.editors ?? [])
    const userResults = await auth().getUsers(
        uids.map((uid) => ({ uid } as UidIdentifier)),
    )

    return userResults.users.map(({ uid, email }) => ({ uid, email } as TUser))
}

export async function getOrganizationWithBoard(bid: TBoardID) {
    const ref = await firestore()
        .collection('organizations')
        .where('boards', 'array-contains', bid)
        .get()
    return ref.docs.map((doc) => doc.data() as TOrganization)[0]
}

export async function createOrganization(uid: TUserID, name: string) {
    const organization = await firestore()
        .collection('organizations')
        .add({
            name: name,
            owners: [uid],
            editors: [],
            boards: [],
        })
    return organization.id
}

export async function getOrganizationLogoWithBoard(bid: TBoardID) {
    const organization = await getOrganizationWithBoard(bid)
    return organization?.logo ?? null
}

export async function getOrganizationsWhereUserIsOwner(uid: TUserID) {
    const ref = await firestore()
        .collection('organizations')
        .where('owners', 'array-contains', uid)
        .get()
    return ref.docs.map((doc) => {
        return { ...doc.data(), id: doc.id } as TOrganization
    })
}

export async function getOrganizationsWhereUserIsEditor(uid: TUserID) {
    const ref = await firestore()
        .collection('organizations')
        .where('editors', 'array-contains', uid)
        .get()
    return ref.docs.map((doc) => {
        return { ...doc.data(), id: doc.id } as TOrganization
    })
}

export async function getOrganizationsWithUser(uid: TUserID) {
    const owner = await getOrganizationsWhereUserIsOwner(uid)
    const editor = await getOrganizationsWhereUserIsEditor(uid)
    return concat(owner, editor)
}

export async function getBoardsForOrganization(oid: TOrganizationID) {
    const boardIDs = (
        await firestore().collection('organizations').doc(oid).get()
    ).data()?.boards

    if (isEmpty(boardIDs)) return []

    const batchedBoardIDs = chunk(boardIDs, FIREBASE_IN_OPERATOR_LIMIT)

    const boardQueries = batchedBoardIDs.map((batch) =>
        firestore()
            .collection('boards')
            .where(firestore.FieldPath.documentId(), 'in', batch)
            .get(),
    )

    const boardRefs = await Promise.all(boardQueries)

    return boardRefs
        .map((ref) =>
            ref.docs.map((doc) => ({ id: doc.id, ...doc.data() } as TBoard)),
        )
        .flat()
}

export async function getUserByEmail(email: string) {
    const user = await auth()
        .getUserByEmail(email)
        .catch(() => null)

    return user
}

export async function getOrganizationById(oid: TOrganizationID) {
    const doc = await firestore().collection('organizations').doc(oid).get()
    return { ...doc.data(), id: oid } as TOrganization
}

export async function userCanEditOrganization(
    uid: TUserID,
    oid: TOrganizationID,
) {
    const organization = await getOrganizationById(oid)
    return organization?.owners?.includes(uid) ?? false
}

export async function userCanReadOrganization(
    uid: TUserID,
    oid: TOrganizationID,
) {
    const organization = await getOrganizationById(oid)
    return (
        organization?.owners
            ?.concat(organization.editors ?? [])
            .includes(uid) ?? false
    )
}

export async function inviteUserToOrganization(
    callerId: TUserID,
    inviteeId: TUserID,
    oid: TOrganizationID,
    pool: 'owners' | 'editors' = 'owners',
) {
    if (!(await userCanEditOrganization(callerId, oid)))
        throw 'auth/operation-not-allowed'

    const organization = await getOrganizationById(oid)

    if (!organization) throw 'organization/not-found'

    const peers = organization[pool]

    if (peers && peers.includes(inviteeId))
        throw 'organization/user-already-invited'

    return firestore()
        .collection('organizations')
        .doc(oid)
        .update({
            [pool]: admin.firestore.FieldValue.arrayUnion(inviteeId),
        })
}

export async function removeUserFromOrganization(
    callerId: TUserID,
    oid: TOrganizationID,
    uid: TUserID,
) {
    if (!(await userCanEditOrganization(callerId, oid)))
        throw 'auth/operation-not-allowed'
    return firestore()
        .collection('organizations')
        .doc(oid)
        .update({
            owners: admin.firestore.FieldValue.arrayRemove(uid),
            editors: admin.firestore.FieldValue.arrayRemove(uid),
        })
}

export async function deleteOrganization(oid: TOrganizationID, uid: TUserID) {
    const access = await userCanEditOrganization(uid, oid)
    if (!access) throw 'auth/operation-not-allowed'
    await deleteOrganizationBoards(oid, uid)
    await firestore().collection('organizations').doc(oid).delete()
}

export async function deleteOrganizationBoards(
    oid: TOrganizationID,
    uid: TUserID,
) {
    const boards = await getBoardsForOrganization(oid)

    return Promise.all(
        boards
            .filter((board) => board !== undefined)
            .map(
                (board) =>
                    board?.id && deleteOrganizationBoard(oid, board.id, uid),
            ),
    )
}

export async function deleteOrganizationBoard(
    oid: TOrganizationID,
    bid: TBoardID,
    uid: TUserID,
) {
    const access = await userCanEditOrganization(uid, oid)
    if (!access) throw 'auth/operation-not-allowed'
    return firestore().collection('boards').doc(bid).delete()
}
