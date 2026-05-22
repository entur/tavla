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

    const locationRaw = data.get('newLocation') as string
    const location: LocationDB | undefined = locationRaw
        ? (JSON.parse(locationRaw) as LocationDB)
        : undefined

    const infoMessage = data.get('infoMessage') as string

    const board = await getBoard(bid)
    const errors = {} as Record<InputType, TFormFeedback>

    if (!board) {
        errors.general = getFormFeedbackForError('board/not-found')
        return errors
    }

    const boardTitle = title ?? board.meta.title //Ugly hack, should re-evaluate the whole structure

    if (isEmptyOrSpaces(boardTitle)) {
        errors.name = getFormFeedbackForError('board/tiles-name-missing')
        return errors
    }

    try {
        await userHasAccessToEditBoard(board.id ?? '')

        const tiles = await getTilesWithDistance(board, location)

        const footerContainsText =
            infoMessage &&
            !isOnlyWhiteSpace(infoMessage) &&
            infoMessage.trim() !== ''

        await updateBoard(bid, {
            'meta.title': boardTitle.substring(0, 50),
            'meta.fontSize': font,
            'meta.location': location ?? FieldValue.delete(),
            theme: theme ?? 'dark',
            isCombinedTiles: viewType !== 'separate',
            footer: footerContainsText
                ? { footer: infoMessage }
                : FieldValue.delete(),
            transportPalette: transportPalette ?? 'default',
            tiles,
            hideClock,
            hideLogo,
        })

        if (newFolder !== oldFolder) {
            await moveBoard(bid, newFolder, oldFolder)
        }

        revalidatePath(`/tavler/${bid}/rediger`)
    } catch (error) {
        if (isRedirectError(error)) {
            redirect('/')
        }

        await logToGcp(
            'error',
            `Failed to save settings for board ${bid}: ${error instanceof Error ? error.message : String(error)}`,
        )
        Sentry.captureException(error, {
            extra: { message: 'Error while saving settings', boardID: bid },
        })
        errors.general = handleError(error)
        return errors
    }
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
                toFolder,
                fromFolder,
            },
        })
        throw error
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
