'use server'
import { getFormFeedbackForError } from 'app/(admin)/utils'
import {
    hasBoardEditorAccess,
    initializeAdminApp,
} from 'app/(admin)/utils/firebase'
import admin, { firestore } from 'firebase-admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { TFontSize, TLocation } from 'types/meta'
import { TBoard, TBoardID, TOrganizationID } from 'types/settings'
import { getBoard, getWalkingDistanceTile } from '../../actions'
import { getUserFromSessionCookie } from 'app/(admin)/utils/server'

initializeAdminApp()

export async function saveTitle(bid: TBoardID, name: string) {
    const access = await hasBoardEditorAccess(bid)
    if (!access) return redirect('/')

    await firestore()
        .collection('boards')
        .doc(bid)
        .update({
            'meta.title': name.substring(0, 30),
            'meta.dateModified': Date.now(),
        })
    revalidatePath(`/edit/${bid}`)
}

export async function saveFont(bid: TBoardID, font: TFontSize) {
    const access = await hasBoardEditorAccess(bid)
    if (!access) return redirect('/')

    await firestore()
        .collection('boards')
        .doc(bid)
        .update({ 'meta.fontSize': font, 'meta.dateModified': Date.now() })
    revalidatePath(`/edit/${bid}`)
}

export async function saveLocation(bid: TBoardID, location?: TLocation) {
    if (!bid) return getFormFeedbackForError()

    const access = await hasBoardEditorAccess(bid)
    if (!access) return redirect('/')

    const board = await getBoard(bid)
    if (!board) return getFormFeedbackForError('board/not-found')
    await firestore()
        .collection('boards')
        .doc(bid)
        .update({
            tiles: await getTilesWithDistance(board, location),
            'meta.location': location ?? firestore.FieldValue.delete(),
            'meta.dateModified': Date.now(),
        })
    revalidatePath(`/edit/${bid}`)
}

async function getTilesWithDistance(board: TBoard, location?: TLocation) {
    return await Promise.all(
        board.tiles.map(async (tile) => {
            return await getWalkingDistanceTile(tile, location)
        }),
    )
}

export async function moveBoardToPersonal(
    bid: TBoardID,
    fromOrganization?: TOrganizationID,
) {
    const user = await getUserFromSessionCookie()
    if (!user) return getFormFeedbackForError('auth/operation-not-allowed')

    if (fromOrganization) {
        const orgAccess = await hasBoardEditorAccess(bid)
        if (!orgAccess) return redirect('/')
    }

    firestore()
        .collection('users')
        .doc(String(user.uid))
        .update({
            ['owner']: admin.firestore.FieldValue.arrayUnion(bid),
        })

    firestore()
        .collection(fromOrganization ? 'organizations' : 'users')
        .doc(fromOrganization ? String(fromOrganization) : String(user.uid))
        .update({
            [fromOrganization ? 'boards' : 'owner']:
                admin.firestore.FieldValue.arrayRemove(bid),
        })

    revalidatePath(`/edit/${bid}`)
}

export async function moveBoardToOrganization(
    bid: TBoardID,
    oid?: TOrganizationID,
    fromOrganization?: TOrganizationID,
) {
    const user = await getUserFromSessionCookie()
    if (!user) return getFormFeedbackForError('auth/operation-not-allowed')

    const orgAccess = await hasBoardEditorAccess(bid)
    if (!orgAccess) return redirect('/')

    if (fromOrganization) {
        const orgAccess = await hasBoardEditorAccess(bid)
        if (!orgAccess) return redirect('/')
    }

    firestore()
        .collection('organizations')
        .doc(String(oid))
        .update({
            ['boards']: admin.firestore.FieldValue.arrayUnion(bid),
        })

    firestore()
        .collection(fromOrganization ? 'organizations' : 'users')
        .doc(fromOrganization ? String(fromOrganization) : String(user.uid))
        .update({
            [fromOrganization ? 'boards' : 'owner']:
                admin.firestore.FieldValue.arrayRemove(bid),
        })

    revalidatePath(`/edit/${bid}`)
}
