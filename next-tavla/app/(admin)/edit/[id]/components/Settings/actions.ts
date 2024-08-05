'use server'
import { getFormFeedbackForError } from 'app/(admin)/utils'
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
import {
    TBoard,
    TBoardID,
    TFooter,
    TOrganizationID,
    TTheme,
} from 'types/settings'
import { getBoard, getWalkingDistanceTile } from '../../actions'
import { getUserFromSessionCookie } from 'app/(admin)/utils/server'
import { isEmptyOrSpaces } from 'app/(admin)/edit/utils'

initializeAdminApp()

export async function saveSettings(
    bid: TBoardID,
    name: string,
    fontSize: TFontSize,
    theme: TTheme,
    footer?: TFooter,
) {
    const access = await hasBoardEditorAccess(bid)
    if (!access) return redirect('/')

    await firestore()
        .collection('boards')
        .doc(bid)
        .update({
            'meta.title': name.substring(0, 30),
            'meta.fontSize': fontSize,
            theme: theme,
            footer: {
                footer:
                    !footer?.footer || !isEmptyOrSpaces(footer?.footer)
                        ? footer?.footer
                        : firestore.FieldValue.delete(),
                override: footer?.override,
            },
            'meta.dateModified': Date.now(),
        })
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
}
