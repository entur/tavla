'use server'
import * as Sentry from '@sentry/nextjs'
import { getWalkingDistanceTile } from 'app/(admin)/tavler/[id]/rediger/actions'
import {
    isEmptyOrSpaces,
    isOnlyWhiteSpace,
} from 'app/(admin)/tavler/[id]/utils'
import {
    InputType,
    TFormFeedback,
    getFormFeedbackForError,
} from 'app/(admin)/utils'
import {
    initializeAdminApp,
    userCanEditBoard,
    userCanEditFolder,
} from 'app/(admin)/utils/firebase'
import { handleError } from 'app/(admin)/utils/handleError'
import { getUserFromSessionCookie } from 'app/(admin)/utils/server'
import { getBoard } from 'Board/scenarios/Board/firebase'
import { firestore } from 'firebase-admin'
import { revalidatePath } from 'next/cache'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { redirect } from 'next/navigation'
import {
    BoardDB,
    BoardFontSizeDB,
    BoardFooterDB,
    BoardIdDB,
    BoardThemeDB,
    LocationDB,
    TransportPaletteDB,
} from 'types/db-types/boards'
import { FolderIdDB } from 'types/db-types/folders'

initializeAdminApp()

async function userHasAccessToEditBoard(bid: string) {
    const access = await userCanEditBoard(bid)
    if (!access) return redirect('/')
}

export async function saveSettings(data: FormData) {
    const title = data.get('title') as string
    const bid = data.get('bid') as BoardIdDB
    const viewType = data.get('viewType') as string
    const theme = data.get('theme') as BoardThemeDB
    const font = data.get('font') as BoardFontSizeDB
    const transportPalette = data.get('transportPalette') as TransportPaletteDB

    const newFolder = data.get('newOid') as FolderIdDB | undefined
    const oldFolder = data.get('oldOid') as FolderIdDB | undefined

    const hideClock = data.get('clock') === null
    const hideLogo = data.get('logo') === null

    let location: LocationDB | undefined | string = data.get(
        'newLocation',
    ) as string

    if (location) {
        location = JSON.parse(location) as LocationDB
    } else {
        location = undefined
    }

    const footer = data.get('footer') as string

    const board = await getBoard(bid)
    const errors = {} as Record<InputType, TFormFeedback>

    if (!board) {
        errors['general'] = getFormFeedbackForError('board/not-found')
        return errors
    }

    const boardTitle = title ?? board.meta.title //Ugly hack, should re-evaluate the whole structure

    try {
        if (isEmptyOrSpaces(boardTitle))
            errors['name'] = getFormFeedbackForError('board/tiles-name-missing')

        if (Object.keys(errors).length !== 0) {
            return errors
        }

        await saveTitle(bid, boardTitle)
        await moveBoard(bid, newFolder, oldFolder)
        await saveLocation(board, location)
        await saveFont(bid, font)
        await setTheme(bid, theme)
        await setViewType(board, viewType)
        await setFooter(bid, { footer })
        await setTransportPalette(bid, transportPalette)
        await setElements(bid, hideClock, hideLogo)

        revalidatePath(`/tavler/${bid}/rediger`)
    } catch (error) {
        if (isRedirectError(error)) {
            redirect('/')
        }

        errors['general'] = handleError(error)
        return errors
    }
}

async function setFooter(bid: BoardIdDB, { footer }: BoardFooterDB) {
    userHasAccessToEditBoard(bid)

    let newFooter = {}

    const footerContainsText =
        footer && !isOnlyWhiteSpace(footer) && footer.trim() !== ''

    if (footerContainsText) {
        newFooter = { footer: footer }
    } else {
        newFooter = firestore.FieldValue.delete()
    }

    try {
        await firestore().collection('boards').doc(bid).update({
            footer: newFooter,
            'meta.dateModified': Date.now(),
        })
        revalidatePath(`tavler/${bid}/rediger`)
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

async function setTheme(bid: BoardIdDB, theme?: BoardThemeDB) {
    userHasAccessToEditBoard(bid)

    try {
        await firestore()
            .collection('boards')
            .doc(bid)
            .update({
                theme: theme ?? 'dark',
                'meta.dateModified': Date.now(),
            })

        revalidatePath(`/tavler/${bid}/rediger`)
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

async function setViewType(board: BoardDB, viewType: string) {
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

        revalidatePath(`/tavler/${board.id}/rediger`)
    } catch (e) {
        handleError(e)
    }
}

async function saveTitle(bid: BoardIdDB, title: string) {
    userHasAccessToEditBoard(bid)

    try {
        await firestore()
            .collection('boards')
            .doc(bid)
            .update({
                'meta.title': title.substring(0, 50),
                'meta.dateModified': Date.now(),
            })
        revalidatePath(`/tavler/${bid}/rediger`)
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

async function saveFont(bid: BoardIdDB, font: BoardFontSizeDB) {
    userHasAccessToEditBoard(bid)

    try {
        await firestore()
            .collection('boards')
            .doc(bid)
            .update({ 'meta.fontSize': font, 'meta.dateModified': Date.now() })
        revalidatePath(`/tavler/${bid}/rediger`)
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

async function saveLocation(board: BoardDB, location?: LocationDB) {
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
        revalidatePath(`/tavler/${board.id}/rediger`)
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

async function getTilesWithDistance(board: BoardDB, location?: LocationDB) {
    return await Promise.all(
        board.tiles.map(async (tile) => {
            return await getWalkingDistanceTile(tile, location)
        }),
    )
}

export async function moveBoard(
    bid: BoardIdDB,
    toFolder?: FolderIdDB,
    fromFolder?: FolderIdDB,
) {
    const user = await getUserFromSessionCookie()
    if (!user) return redirect('/')

    userHasAccessToEditBoard(bid)

    if (fromFolder) {
        const canEdit = await userCanEditFolder(fromFolder)
        if (!canEdit) return redirect('/')
    }

    if (toFolder) {
        const canEdit = await userCanEditFolder(toFolder)
        if (!canEdit) return redirect('/')
    }

    try {
        if (fromFolder)
            await firestore()
                .collection('folders')
                .doc(fromFolder)
                .update({ boards: firestore.FieldValue.arrayRemove(bid) })
        else
            await firestore()
                .collection('users')
                .doc(user.uid)
                .update({ owner: firestore.FieldValue.arrayRemove(bid) })

        if (toFolder)
            await firestore()
                .collection('folders')
                .doc(toFolder)
                .update({ boards: firestore.FieldValue.arrayUnion(bid) })
        else
            await firestore()
                .collection('users')
                .doc(user.uid)
                .update({ owner: firestore.FieldValue.arrayUnion(bid) })
    } catch (error) {
        Sentry.captureException(error, {
            extra: {
                message: 'Error while moving board to new folder',
                boardID: bid,
                newFolder: toFolder,
                oldFolder: fromFolder,
            },
        })
        throw error
    }
}

async function setTransportPalette(
    bid: BoardIdDB,
    transportPalette?: TransportPaletteDB,
) {
    userHasAccessToEditBoard(bid)

    try {
        await firestore()
            .collection('boards')
            .doc(bid)
            .update({
                transportPalette: transportPalette ?? 'default',
                'meta.dateModified': Date.now(),
            })

        revalidatePath(`/tavler/${bid}/rediger`)
    } catch (error) {
        Sentry.captureException(error, {
            extra: {
                message: 'Error while updating transport palette',
                boardID: bid,
                newTransportPalette: transportPalette,
            },
        })
        return handleError(error)
    }
}

async function setElements(
    bid: BoardIdDB,
    hideClock: boolean,
    hideLogo: boolean,
) {
    userHasAccessToEditBoard(bid)

    try {
        await firestore().collection('boards').doc(bid).update({
            hideClock: hideClock,
            hideLogo: hideLogo,
            'meta.dateModified': Date.now(),
        })

        revalidatePath(`/tavler/${bid}/rediger`)
    } catch (error) {
        Sentry.captureException(error, {
            extra: {
                message: 'Error while updating visible elements',
                boardID: bid,
                hideClock: hideClock,
                hideLogo: hideLogo,
            },
        })
        return handleError(error)
    }
}
