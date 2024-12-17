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
import { notFound, redirect } from 'next/navigation'
import { TFontSize, TLocation } from 'types/meta'
import { TBoard, TBoardID, TOrganizationID } from 'types/settings'
import { getWalkingDistanceTile } from '../../actions'
import { getUserFromSessionCookie } from 'app/(admin)/utils/server'
import { getBoard } from 'Board/scenarios/Board/firebase'
import { isEmptyOrSpaces } from 'app/(admin)/edit/utils'
import { handleError } from 'app/(admin)/utils/handleError'
import * as Sentry from '@sentry/nextjs'

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
    } catch (error) {
        Sentry.captureException(error, {
            extra: {
                message: 'Error while saving title of board tile',
                boardID: bid,
            },
        })
        return handleError(error)
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
    } catch (error) {
        Sentry.captureException(error, {
            extra: {
                message: 'Error while updating font size of board',
                boardID: bid,
            },
        })
        return handleError(error)
    }
}

export async function saveLocation(bid: TBoardID, location?: TLocation) {
    const access = await hasBoardEditorAccess(bid)
    if (!access) return redirect('/')

    const board = await getBoard(bid)
    if (!board) {
        return notFound()
    }

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
    } catch (error) {
        Sentry.captureException(error, {
            extra: {
                message: 'Error while updating location of board',
                boardID: bid,
                location: location,
            },
        })
        return handleError(error)
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
    personal: boolean,
    toOrganization: TOrganizationID | undefined,
    fromOrganization?: TOrganizationID,
) {
    const user = await getUserFromSessionCookie()
    if (!user) return redirect('/')

    const access = await hasBoardOwnerAccess(bid)
    if (!access) return redirect('/')

    if (!personal && !toOrganization)
        return getFormFeedbackForError('create/organization-missing')

    if (fromOrganization) {
        const canEdit = await userCanEditOrganization(fromOrganization)
        if (!canEdit) return redirect('/')
    }

    if (toOrganization) {
        const canEdit = await userCanEditOrganization(toOrganization)
        if (!canEdit) return redirect('/')
    }

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

        if (toOrganization)
            await firestore()
                .collection('organizations')
                .doc(toOrganization)
                .update({ boards: admin.firestore.FieldValue.arrayUnion(bid) })
        else
            await firestore()
                .collection('users')
                .doc(user.uid)
                .update({ owner: admin.firestore.FieldValue.arrayUnion(bid) })

        revalidatePath(`/edit/${bid}`)
    } catch (error) {
        Sentry.captureException(error, {
            extra: {
                message: 'Error while moving board to new organization',
                boardID: bid,
                newOrg: toOrganization,
                oldOrg: fromOrganization,
            },
        })
        return handleError(error)
    }
}
