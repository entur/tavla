'use server'
import * as Sentry from '@sentry/nextjs'
import { getWalkingDistanceTile } from 'app/(innlogget)/tavler/[id]/rediger/actions'
import {
    isEmptyOrSpaces,
    isOnlyWhiteSpace,
} from 'app/(innlogget)/tavler/[id]/utils'
import {
    initializeAdminApp,
    userCanEditBoard,
    userCanEditFolder,
} from 'app/(innlogget)/utils/firebase'
import {
    getFormFeedbackForError,
    type InputType,
    type TFormFeedback,
} from 'app/(innlogget)/utils/forms'
import { handleError } from 'app/(innlogget)/utils/handleError'
import { getUserFromSessionCookie } from 'app/(innlogget)/utils/server'
import { FieldValue } from 'firebase-admin/firestore'
import { revalidatePath } from 'next/cache'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { redirect } from 'next/navigation'
import {
    addBoardIdToFolder,
    addBoardIdToUser,
    getBoard,
    removeBoardIdFromFolder,
    removeBoardIdFromUser,
    updateBoard,
} from 'src/firebase'
import type {
    BoardDB,
    BoardFontSize,
    BoardFooter,
    BoardTheme,
    LocationDB,
    TransportPalette,
} from 'src/types/db-types/boards'
import type { FolderDB } from 'src/types/db-types/folders'
import { logToGcp } from 'src/utils/logging'

initializeAdminApp()

async function userHasAccessToEditBoard(bid: string) {
    const access = await userCanEditBoard(bid)
    if (!access) return redirect('/')
}

export async function saveSettings(data: FormData) {
    const title = data.get('title') as string
    const bid = data.get('bid') as BoardDB['id']
    const viewType = data.get('viewType') as string
    const theme = data.get('theme') as BoardTheme
    const font = data.get('font') as BoardFontSize
    const transportPalette = data.get('transportPalette') as TransportPalette

    const newFolder = data.get('newOid') as FolderDB['id'] | undefined
    const oldFolder = data.get('oldOid') as FolderDB['id'] | undefined

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

    const infoMessage = data.get('infoMessage') as string

    const board = await getBoard(bid)
    const errors = {} as Record<InputType, TFormFeedback>

    if (!board) {
        errors.general = getFormFeedbackForError('board/not-found')
        return errors
    }

    const boardTitle = title ?? board.meta.title //Ugly hack, should re-evaluate the whole structure

    try {
        if (isEmptyOrSpaces(boardTitle))
            errors.name = getFormFeedbackForError('board/tiles-name-missing')

        if (Object.keys(errors).length !== 0) {
            return errors
        }

        await userHasAccessToEditBoard(board.id ?? '')

        await saveTitle(bid, boardTitle)
        await moveBoard(bid, newFolder, oldFolder)
        await saveLocation(board, location)
        await saveFont(bid, font)
        await setTheme(bid, theme)
        await setViewType(board, viewType)
        await setFooter(bid, { footer: infoMessage })
        await setTransportPalette(bid, transportPalette)
        await setElements(bid, hideClock, hideLogo)

        revalidatePath(`/tavler/${bid}/rediger`)
    } catch (error) {
        if (isRedirectError(error)) {
            redirect('/')
        }

        await logToGcp(
            'error',
            `Failed to save settings for board ${bid}: ${error instanceof Error ? error.message : String(error)}`,
        )
        errors.general = handleError(error)
        return errors
    }
}

async function setFooter(bid: BoardDB['id'], { footer }: BoardFooter) {
    const footerContainsText =
        footer && !isOnlyWhiteSpace(footer) && footer.trim() !== ''

    const newFooter = footerContainsText
        ? { footer: footer }
        : FieldValue.delete()

    try {
        await updateBoard(bid, { footer: newFooter })
        revalidatePath(`tavler/${bid}/rediger`)
    } catch (error) {
        await logToGcp(
            'error',
            `Failed to set footer for board ${bid}: ${error instanceof Error ? error.message : String(error)}`,
        )
        Sentry.captureException(error, {
            extra: {
                message: 'Error while setting footer of board',
                boardID: bid,
            },
        })
        return handleError(error)
    }
}

async function setTheme(bid: BoardDB['id'], theme?: BoardTheme) {
    try {
        await updateBoard(bid, { theme: theme ?? 'dark' })
        revalidatePath(`/tavler/${bid}/rediger`)
    } catch (error) {
        await logToGcp(
            'error',
            `Failed to set theme for board ${bid}: ${error instanceof Error ? error.message : String(error)}`,
        )
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
    const isSeparateTiles = viewType === 'separate'

    try {
        await updateBoard(board.id ?? '', { isCombinedTiles: !isSeparateTiles })
        revalidatePath(`/tavler/${board.id}/rediger`)
    } catch (e) {
        await logToGcp(
            'error',
            `Failed to set view type for board ${board.id}: ${e instanceof Error ? e.message : String(e)}`,
        )
        handleError(e)
    }
}

async function saveTitle(bid: BoardDB['id'], title: string) {
    try {
        await updateBoard(bid, { 'meta.title': title.substring(0, 50) })
        revalidatePath(`/tavler/${bid}/rediger`)
    } catch (error) {
        await logToGcp(
            'error',
            `Failed to save title for board ${bid}: ${error instanceof Error ? error.message : String(error)}`,
        )
        Sentry.captureException(error, {
            extra: {
                message: 'Error while saving title of board tile',
                boardID: bid,
            },
        })
        return handleError(error)
    }
}

async function saveFont(bid: BoardDB['id'], font: BoardFontSize) {
    try {
        await updateBoard(bid, { 'meta.fontSize': font })
        revalidatePath(`/tavler/${bid}/rediger`)
    } catch (error) {
        await logToGcp(
            'error',
            `Failed to save font for board ${bid}: ${error instanceof Error ? error.message : String(error)}`,
        )
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
    try {
        await updateBoard(board.id ?? '', {
            tiles: await getTilesWithDistance(board, location),
            'meta.location': location ?? FieldValue.delete(),
        })
        revalidatePath(`/tavler/${board.id}/rediger`)
    } catch (error) {
        await logToGcp(
            'error',
            `Failed to save location for board ${board.id}: ${error instanceof Error ? error.message : String(error)}`,
        )
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
            if (location === undefined) {
                delete tile.walkingDistance
                return tile
            } else {
                return await getWalkingDistanceTile(tile, location)
            }
        }),
    )
}

export async function moveBoard(
    bid: BoardDB['id'],
    toFolder?: FolderDB['id'],
    fromFolder?: FolderDB['id'],
) {
    const user = await getUserFromSessionCookie()
    if (!user) return redirect('/')

    if (fromFolder) {
        const canEdit = await userCanEditFolder(fromFolder)
        if (!canEdit) return redirect('/')
    }

    if (toFolder) {
        const canEdit = await userCanEditFolder(toFolder)
        if (!canEdit) return redirect('/')
    }

    try {
        if (fromFolder) await removeBoardIdFromFolder(fromFolder, bid)
        else await removeBoardIdFromUser(user.uid, bid)

        if (toFolder) await addBoardIdToFolder(toFolder, bid)
        else await addBoardIdToUser(user.uid, bid)
    } catch (error) {
        await logToGcp(
            'error',
            `Failed to move board ${bid}: ${error instanceof Error ? error.message : String(error)}`,
        )
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
    bid: BoardDB['id'],
    transportPalette?: TransportPalette,
) {
    try {
        await updateBoard(bid, {
            transportPalette: transportPalette ?? 'default',
        })
        revalidatePath(`/tavler/${bid}/rediger`)
    } catch (error) {
        await logToGcp(
            'error',
            `Failed to set transport palette for board ${bid}: ${error instanceof Error ? error.message : String(error)}`,
        )
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
    bid: BoardDB['id'],
    hideClock: boolean,
    hideLogo: boolean,
) {
    try {
        await updateBoard(bid, { hideClock, hideLogo })
        revalidatePath(`/tavler/${bid}/rediger`)
    } catch (error) {
        await logToGcp(
            'error',
            `Failed to set elements for board ${bid}: ${error instanceof Error ? error.message : String(error)}`,
        )
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
