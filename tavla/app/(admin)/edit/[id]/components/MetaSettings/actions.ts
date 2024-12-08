'use server'
import { getFormFeedbackForError, TFormFeedback } from 'app/(admin)/utils'
import {
    hasBoardEditorAccess,
    hasBoardOwnerAccess,
    initializeAdminApp,
    userCanEditOrganization,
} from 'app/(admin)/utils/firebase'
import admin, { firestore } from 'firebase-admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { TFontSize, TLocation } from 'types/meta'
import { TBoard, TBoardID, TOrganizationID } from 'types/settings'
import { getWalkingDistanceTile } from '../../actions'
import { getUserFromSessionCookie } from 'app/(admin)/utils/server'
import { getBoard } from 'Board/scenarios/Board/firebase'
import { isEmptyOrSpaces } from 'app/(admin)/edit/utils'
import { handleError } from 'app/(admin)/utils/handleError'

initializeAdminApp()

export async function saveTitle(
    state: TFormFeedback | undefined,
    bid: TBoardID,
    data: FormData,
) {
    const name = data.get('name') as string
    if (isEmptyOrSpaces(name))
        return getFormFeedbackForError('board/tiles-name-missing')

    const access = await hasBoardEditorAccess(bid)
    if (!access) return redirect('/')

    try {
        await firestore()
            .collection('boards')
            .doc(bid)
            .update({
                'meta.title': name.substring(0, 50),
                'meta.dateModified': Date.now(),
            })
        revalidatePath(`/edit/${bid}`)
    } catch (e) {
        return handleError(e)
    }
}

export async function saveFont(bid: TBoardID, data: FormData) {
    const access = await hasBoardEditorAccess(bid)
    if (!access) return redirect('/')

    const font = data.get('font') as TFontSize

    try {
        await firestore()
            .collection('boards')
            .doc(bid)
            .update({ 'meta.fontSize': font, 'meta.dateModified': Date.now() })
        revalidatePath(`/edit/${bid}`)
    } catch (e) {
        return handleError(e)
    }
}

export async function saveLocation(bid: TBoardID, location?: TLocation) {
    if (!bid) return getFormFeedbackForError()

    const access = await hasBoardEditorAccess(bid)
    if (!access) return redirect('/')

    const board = await getBoard(bid)
    if (!board) return getFormFeedbackForError('board/not-found')

    try {
        await firestore()
            .collection('boards')
            .doc(bid)
            .update({
                tiles: await getTilesWithDistance(board, location),
                'meta.location': location ?? firestore.FieldValue.delete(),
                'meta.dateModified': Date.now(),
            })
        revalidatePath(`/edit/${bid}`)
    } catch (e) {
        return handleError(e)
    }
}

async function getTilesWithDistance(board: TBoard, location?: TLocation) {
    return await Promise.all(
        board.tiles.map(async (tile) => {
            return await getWalkingDistanceTile(tile, location)
        }),
    )
}

export async function moveBoard(
    bid: TBoardID,
    oid?: TOrganizationID,
    fromOrganization?: TOrganizationID,
) {
    const user = await getUserFromSessionCookie()
    if (!user) return redirect('/')

    const access = await hasBoardOwnerAccess(bid)
    if (!access) return redirect('/')

    if (fromOrganization && !(await userCanEditOrganization(fromOrganization)))
        return redirect('/')

    if (oid && !(await userCanEditOrganization(oid))) return redirect('/')

    try {
        if (fromOrganization)
            await firestore()
                .collection('organizations')
                .doc(fromOrganization)
                .update({ boards: admin.firestore.FieldValue.arrayRemove(bid) })
        else
            await firestore()
                .collection('users')
                .doc(user.uid)
                .update({ owner: admin.firestore.FieldValue.arrayRemove(bid) })

        if (oid)
            await firestore()
                .collection('organizations')
                .doc(oid)
                .update({ boards: admin.firestore.FieldValue.arrayUnion(bid) })
        else
            await firestore()
                .collection('users')
                .doc(user.uid)
                .update({ owner: admin.firestore.FieldValue.arrayUnion(bid) })

        revalidatePath(`/edit/${bid}`)
    } catch (e) {
        return handleError(e)
    }
}
