'use client'
import { useToast } from '@entur/alert'
import { Modal } from '@entur/modal'
import { Heading3 } from '@entur/typography'
import { deleteTile, saveTile } from 'app/_components/TileCard/actions'
import { SetColumns } from 'app/_components/TileCard/components/SetColumns'
import { SetVisibleLines } from 'app/_components/TileCard/components/SetVisibleLines'
import { TileArrows } from 'app/_components/TileCard/components/TileArrows'
import { TileContext } from 'app/_components/TileCard/context'
import { useLines } from 'app/_components/TileCard/useLines'
import { parseTileFormData } from 'app/_components/TileCard/utils'
import TransportIcon from 'app/_components/TransportIcon/TransportIcon'
import {
    getTransportModesFromLines,
    sortByTransportMode,
} from 'app/_components/TransportIcon/utils'
import { LOCAL_STORAGE_BOARD_ID } from 'app/_hooks/useSaveBoardInLocalStorage'
import { isOnlyWhiteSpace } from 'app/(innlogget)/tavler/[id]/utils'
import {
    getFormFeedbackForError,
    type TFormFeedback,
} from 'app/(innlogget)/utils/forms'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { uniqBy } from 'lodash'
import { startTransition, useActionState, useState } from 'react'
import type { BoardDB, BoardTileDB } from 'types/db-types/boards'
import { SaveCancelDeleteTileButtonGroup } from './components/SaveCancelDeleteTileButtonGroup'
import { SetOffsetDepartureTime } from './components/SetOffsetDepartureTime'
import { SetStopPlaceName } from './components/SetStopPlaceName'

export function TileCard({
    board,
    tile,
    index,
    moveItem,
    setTilesLocalStorageBoard,
}: {
    board: BoardDB
    tile: BoardTileDB
    index: number
    moveItem: (index: number, direction: string) => void
    setTilesLocalStorageBoard?: (tiles: BoardDB['tiles']) => void
}) {
    const { capture } = usePosthogTracking()

    const totalTiles = board.tiles.length

    const [isOpen, setIsOpen] = useState(false)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [changedFields, setChangedFields] = useState<Set<string>>(new Set())

    const isLocalStorageBoard = board.id === LOCAL_STORAGE_BOARD_ID
    const trackingLocation = isLocalStorageBoard
        ? 'board_without_user'
        : 'board_page'

    const onFieldChanged = (field: string) => {
        setChangedFields((prev) => new Set(prev).add(field))
        setHasUnsavedChanges(true)
    }
    const { addToast } = useToast()

    const submit = async (
        _prevState: TFormFeedback | undefined,
        data: FormData,
    ) => {
        const {
            columns: parsedColumns,
            count,
            offset,
            displayName,
            quayLineKeys,
        } = parseTileFormData(data)
        const columns = board.isCombinedTiles ? tile.columns : parsedColumns

        if (isOnlyWhiteSpace(displayName)) {
            return getFormFeedbackForError('board/tiles-name-missing')
        }

        if (quayLineKeys.length === 0 && count !== null && count > 0) {
            return getFormFeedbackForError('board/tiles-no-lines-selected')
        }

        const allSelected = quayLineKeys.length === count

        const newQuays = allSelected
            ? []
            : quaysWithFilteredLines
                  .map((q) => ({
                      id: q.id,
                      whitelistedLines: q.lines
                          .filter((l) =>
                              quayLineKeys.includes(`${q.id}||${l.id}`),
                          )
                          .map((l) => l.id),
                  }))
                  .filter((q) => q.whitelistedLines.length > 0)

        const newTile: BoardTileDB = {
            ...tile,
            columns,
            quays: newQuays,
            ...(board.meta.location && {
                walkingDistance: {
                    distance: tile.walkingDistance?.distance,
                },
            }),
            offset: Number(offset) || undefined,
            displayName: displayName.substring(0, 50) || undefined,
        }

        const updatedTiles = board.tiles.map((existingTile) =>
            existingTile.uuid === newTile.uuid ? newTile : existingTile,
        )

        try {
            if (isLocalStorageBoard) {
                setTilesLocalStorageBoard?.(updatedTiles)
            } else {
                await saveTile(board.id, newTile)
                // Keep the parent board (live preview) in sync after persisting.
                setTilesLocalStorageBoard?.(updatedTiles)
            }
            reset()
        } catch {
            return getFormFeedbackForError('board/tiles-save-failed')
        }
    }

    const [state, runAction] = useActionState(submit, undefined)

    const reset = () => {
        setConfirmOpen(false)
        setHasUnsavedChanges(false)
        setChangedFields(new Set())
        setIsOpen(false)
    }

    const quays = useLines(tile)

    if (!quays)
        return (
            <div className="flex items-center justify-between rounded p-4">
                Laster...
            </div>
        )

    const quaysWithFilteredLines = quays
        .map((q) => ({
            ...q,
        }))
        .filter((q) => q.lines.length > 0)

    // Flatten lines for other components if needed, or update components to use Quays
    const allLines = quaysWithFilteredLines.flatMap((q) =>
        q.lines.map((l) => ({
            ...l,
            quayName: q.name,
            quayPublicCode: q.publicCode,
        })),
    )

    const uniqLines = uniqBy(allLines, 'id')

    const transportModes =
        getTransportModesFromLines(uniqLines).sort(sortByTransportMode)

    const handleSetIsTileOpen = (open: boolean) => {
        setIsOpen(open)
    }

    const handleDeleteTile = () => {
        capture('stop_place_deleted', {
            location: trackingLocation,
        })

        const remainingTiles = board.tiles.filter((t) => t.uuid !== tile.uuid)

        if (isLocalStorageBoard) {
            setTilesLocalStorageBoard?.(remainingTiles)
            addToast(`${tile.name} fjernet!`)
        } else {
            deleteTile(board.id, tile).then(() => {
                addToast(`${tile.name} fjernet!`)
            })
            // Keep the parent board (live preview) in sync after persisting.
            setTilesLocalStorageBoard?.(remainingTiles)
        }
    }

    return (
        <div>
            <TileContext.Provider value={tile}>
                <div className="flex flex-row">
                    <button
                        type="button"
                        aria-label={`Rediger ${tile.displayName ?? tile.name}`}
                        onClick={() => {
                            capture('stop_place_edit_started', {
                                location: trackingLocation,
                            })
                            handleSetIsTileOpen(true)
                        }}
                        className="flex w-full items-center justify-between rounded bg-white px-6 py-4 text-left transition-colors hover:bg-tintLight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-main"
                    >
                        <div className="flex flex-row items-center gap-4">
                            <Heading3 margin="none">
                                {tile.displayName ?? tile.name}
                            </Heading3>
                            <section
                                className="hidden h-8 flex-row gap-2 sm:flex"
                                aria-label="Transportmidler fra dette stoppestedet: "
                            >
                                {transportModes.map((tm) => (
                                    <TransportIcon
                                        key={`${tm.transportMode}|${tm.transportSubmode ?? ''}`}
                                        transportMode={tm.transportMode}
                                        transportSubmode={tm.transportSubmode}
                                        background
                                        whiteIcon
                                        includeTooltip
                                    />
                                ))}
                            </section>
                        </div>
                    </button>
                    <TileArrows
                        index={index}
                        totalTiles={totalTiles}
                        moveItem={moveItem}
                    />
                </div>

                <Modal
                    size="medium"
                    open={isOpen}
                    title={tile.displayName ?? tile.name}
                    onDismiss={() => {
                        if (hasUnsavedChanges) return setConfirmOpen(true)
                        reset()
                    }}
                >
                    <form
                        id={tile.uuid}
                        onSubmit={(e) => {
                            e.preventDefault()
                            const fd = new FormData(e.currentTarget)
                            startTransition(() => {
                                runAction(fd)
                            })
                        }}
                        onInput={() => setHasUnsavedChanges(true)}
                    >
                        <SetStopPlaceName
                            state={state}
                            trackingLocation={trackingLocation}
                            onFieldChanged={onFieldChanged}
                        />
                        <SetOffsetDepartureTime
                            address={board.meta.location}
                            trackingLocation={trackingLocation}
                            onFieldChanged={onFieldChanged}
                        />
                        <SetColumns
                            isCombined={board.isCombinedTiles}
                            isArrivals={board.isArrivals ?? false}
                            trackingLocation={trackingLocation}
                            onFieldChanged={onFieldChanged}
                        />
                        <SetVisibleLines
                            quays={quaysWithFilteredLines}
                            trackingLocation={trackingLocation}
                            onFieldChanged={onFieldChanged}
                        />
                        <SaveCancelDeleteTileButtonGroup
                            confirmOpen={confirmOpen}
                            hasTileChanged={hasUnsavedChanges}
                            resetTile={reset}
                            setIsTileOpen={handleSetIsTileOpen}
                            setConfirmOpen={setConfirmOpen}
                            validation={state}
                            deleteTile={handleDeleteTile}
                            trackingLocation={trackingLocation}
                            fieldsChanged={{
                                name: changedFields.has('name'),
                                offset: changedFields.has('offset'),
                                offset_walking_dist: changedFields.has(
                                    'offset_walking_dist',
                                ),
                                columns: changedFields.has('columns'),
                                lines: changedFields.has('lines'),
                                transport_mode_filter: changedFields.has(
                                    'transport_mode_filter',
                                ),
                            }}
                        />
                    </form>
                </Modal>
            </TileContext.Provider>
        </div>
    )
}
