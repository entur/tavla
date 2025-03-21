'use server'
import {
    InputType,
    TFormFeedback,
    getFormFeedbackForError,
} from 'app/(admin)/utils'
import {
    initializeAdminApp,
    userCanEditBoard,
    userCanEditOrganization,
} from 'app/(admin)/utils/firebase'
import { handleError } from 'app/(admin)/utils/handleError'
import { getBoard } from 'Board/scenarios/Board/firebase'
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
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { isEmptyOrSpaces, isOnlyWhiteSpace } from 'app/(admin)/edit/utils'
import { firestore } from 'firebase-admin'
import * as Sentry from '@sentry/nextjs'
import { getUserFromSessionCookie } from 'app/(admin)/utils/server'
import { getWalkingDistanceTile } from '../../actions'

initializeAdminApp()

async function userHasAccessToEditBoard(bid: string) {
    const access = await userCanEditBoard(bid)
    if (!access) return redirect('/')
}

export async function saveSettings(data: FormData) {
    const title = data.get('title') as string
    const bid = data.get('bid') as TBoardID
    const viewType = data.get('viewType') as string
    const theme = data.get('theme') as TTheme
    const font = data.get('font') as TFontSize

    let newOrganization = data.get('newOrganization') as string | undefined
    const oldOrganization = data.get('oldOrganization') as string
    const personal = (data.get('personal') as string) === 'on'
    if (newOrganization === 'undefined') {
        newOrganization = undefined
    }

    let location: TLocation | undefined | string = data.get(
        'newLocation',
    ) as string

    if (location) {
        location = JSON.parse(location) as TLocation
    } else {
        location = undefined
    }

    const footer = data.get('footer') as string
    const override = (data.get('override') as string) === 'on'

    const board = await getBoard(bid)
    const errors = {} as Record<InputType, TFormFeedback>

    if (!board) {
        errors['general'] = getFormFeedbackForError('board/not-found')
        return errors
    }

    try {
        if (isEmptyOrSpaces(title))
            errors['name'] = getFormFeedbackForError('board/tiles-name-missing')

        if (!personal && !newOrganization)
            errors['organization'] = getFormFeedbackForError(
                'create/organization-missing',
            )

        if (Object.keys(errors).length !== 0) {
            return errors
        }

        await saveTitle(bid, title)
        await moveBoard(bid, personal, newOrganization, oldOrganization)
        await saveLocation(board, location)
        await saveFont(bid, font)
        await setTheme(bid, theme)
        await setViewType(board, viewType)
        await setFooter(bid, { footer, override })

        revalidatePath(`/edit/${bid}`)
    } catch (error) {
        if (isRedirectError(error)) {
            redirect('/')
        }

        errors['general'] = handleError(error)
        return errors
    }
}

async function setFooter(bid: TBoardID, { footer, override }: TFooter) {
    userHasAccessToEditBoard(bid)

    let newFooter = {}

    const footerContainsText =
        footer && !isOnlyWhiteSpace(footer) && footer.trim() !== ''

    if (footerContainsText) {
        newFooter = { footer: footer, override: override }
    } else if (override) {
        newFooter = { override: override }
    } else {
        newFooter = firestore.FieldValue.delete()
    }

    try {
        await firestore().collection('boards').doc(bid).update({
            footer: newFooter,
            'meta.dateModified': Date.now(),
        })
        revalidatePath(`edit/${bid}`)
    } catch (error) {
        Sentry.captureException(error, {
            extra: {
                message: 'Error while setting footer of board',
                boardID: bid,
            },
        })
        return handleError(error)
    }
}

async function setTheme(bid: TBoardID, theme?: TTheme) {
    userHasAccessToEditBoard(bid)

    try {
        await firestore()
            .collection('boards')
            .doc(bid)
            .update({
                theme: theme ?? 'dark',
                'meta.dateModified': Date.now(),
            })

        revalidatePath(`/edit/${bid}`)
    } catch (error) {
        Sentry.captureException(error, {
            extra: {
                message: 'Error while updating theme of board',
                boardID: bid,
                newTheme: theme,
            },
        })
        return handleError(error)
    }
}

async function setViewType(board: TBoard, viewType: string) {
    userHasAccessToEditBoard(board.id ?? '')

    const shouldDeleteCombinedTiles = viewType === 'separate'

    try {
        await firestore()
            .collection('boards')
            .doc(board.id ?? '')
            .update({
                combinedTiles: shouldDeleteCombinedTiles
                    ? firestore.FieldValue.delete()
                    : [{ ids: board.tiles.map((tile) => tile.uuid) }],
                'meta.dateModified': Date.now(),
            })

        revalidatePath(`/edit/${board.id}`)
    } catch (e) {
        handleError(e)
    }
}

async function saveTitle(bid: TBoardID, title: string) {
    userHasAccessToEditBoard(bid)

    try {
        await firestore()
            .collection('boards')
            .doc(bid)
            .update({
                'meta.title': title.substring(0, 50),
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

async function saveFont(bid: TBoardID, font: TFontSize) {
    userHasAccessToEditBoard(bid)

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

async function saveLocation(board: TBoard, location?: TLocation) {
    userHasAccessToEditBoard(board.id ?? '')

    try {
        await firestore()
            .collection('boards')
            .doc(board.id ?? '')
            .update({
                tiles: await getTilesWithDistance(board, location),
                'meta.location': location ?? firestore.FieldValue.delete(),
                'meta.dateModified': Date.now(),
            })
        revalidatePath(`/edit/${board.id}`)
    } catch (error) {
        Sentry.captureException(error, {
            extra: {
                message: 'Error while updating location of board',
                boardID: board.id,
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

async function moveBoard(
    bid: TBoardID,
    personal: boolean,
    toOrganization: TOrganizationID | undefined,
    fromOrganization?: TOrganizationID,
) {
    const user = await getUserFromSessionCookie()
    if (!user) return redirect('/')

    userHasAccessToEditBoard(bid)

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
                .update({ boards: firestore.FieldValue.arrayRemove(bid) })
        else
            await firestore()
                .collection('users')
                .doc(user.uid)
                .update({ owner: firestore.FieldValue.arrayRemove(bid) })

        if (toOrganization && !personal)
            await firestore()
                .collection('organizations')
                .doc(toOrganization)
                .update({ boards: firestore.FieldValue.arrayUnion(bid) })
        else
            await firestore()
                .collection('users')
                .doc(user.uid)
                .update({ owner: firestore.FieldValue.arrayUnion(bid) })

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
