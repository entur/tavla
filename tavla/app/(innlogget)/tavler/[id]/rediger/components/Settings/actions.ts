'use server'
import * as Sentry from '@sentry/nextjs'
import { getDefaultColumns } from 'app/_components/TileSelector/utils'
import { getWalkingDistanceTile } from 'app/(innlogget)/tavler/[id]/rediger/actions'
import {
    isEmptyOrSpaces,
    isOnlyWhiteSpace,
} from 'app/(innlogget)/tavler/[id]/utils'
import {
    initializeAdminApp,
    userCanEditBoard,
} from 'app/(innlogget)/utils/firebase'
import {
    getFormFeedbackForError,
    type InputType,
    type TFormFeedback,
} from 'app/(innlogget)/utils/forms'
import { handleError } from 'app/(innlogget)/utils/handleError'
import { FieldValue } from 'firebase-admin/firestore'
import { revalidatePath } from 'next/cache'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { redirect } from 'next/navigation'
import { getBoard, updateBoard } from 'src/firebase'
import type {
    BoardDB,
    BoardFontSize,
    BoardTheme,
    LocationDB,
    TileColumnDB,
    TileDB,
    TransportPalette,
} from 'src/types/db-types/boards'
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

    const hideClock = data.get('clock') === null
    const hideLogo = data.get('logo') === null

    const locationRaw = data.get('newLocation') as string
    const location: LocationDB | undefined = locationRaw
        ? (JSON.parse(locationRaw) as LocationDB)
        : undefined

    logToGcp('info', 'action:saveSettings invoked', { bid })

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

        const isCombinedTilesFromForm = viewType === 'combined'
        const viewTypeChanged =
            isCombinedTilesFromForm !== board.isCombinedTiles
        const columns = viewTypeChanged
            ? getDefaultColumns(isCombinedTilesFromForm)
            : undefined
        const locationChanged = !isSameLocation(location, board.meta.location)

        const tiles = await Promise.all(
            board.tiles.map((tile: TileDB) =>
                buildUpdatedTile(tile, location, locationChanged, columns),
            ),
        )

        const footerContainsText =
            infoMessage &&
            !isOnlyWhiteSpace(infoMessage) &&
            infoMessage.trim() !== ''

        await updateBoard(bid, {
            'meta.title': boardTitle.substring(0, 50),
            'meta.fontSize': font,
            'meta.location': location ?? FieldValue.delete(),
            theme: theme ?? 'dark',
            isCombinedTiles: isCombinedTilesFromForm,
            footer: footerContainsText
                ? { footer: infoMessage }
                : FieldValue.delete(),
            transportPalette: transportPalette ?? 'default',
            tiles,
            hideClock,
            hideLogo,
        })

        revalidatePath(`/tavler/${bid}/rediger`)
    } catch (error) {
        if (isRedirectError(error)) {
            redirect('/')
        }

        logToGcp(
            'error',
            `Failed to save settings for board: ${error instanceof Error ? error.message : String(error)}`,
            { bid },
        )
        Sentry.captureException(error, {
            extra: { message: 'Error while saving settings', boardID: bid },
        })
        errors.general = handleError(error)
        return errors
    }
}

async function buildUpdatedTile(
    tile: TileDB,
    location: LocationDB | undefined,
    locationUpdated: boolean,
    columns: TileColumnDB[] | undefined,
) {
    if (location === undefined) {
        const rest = { ...tile }
        delete rest.walkingDistance
        return columns ? { ...rest, columns } : rest
    }

    if (!locationUpdated) {
        return columns ? { ...tile, columns } : tile
    }
    const newLocationOnTile = await getWalkingDistanceTile(tile, location)
    return columns ? { ...newLocationOnTile, columns } : newLocationOnTile
}

function isSameLocation(a: LocationDB | undefined, b: LocationDB | undefined) {
    if (a === undefined && b === undefined) return true
    if (a === undefined || b === undefined) return false
    return (
        a.coordinate?.lat === b.coordinate?.lat &&
        a.coordinate?.lng === b.coordinate?.lng
    )
}
