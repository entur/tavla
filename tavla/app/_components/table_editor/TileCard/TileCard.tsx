'use client'
import { useToast } from '@entur/alert'
import { BaseExpand } from '@entur/expand'
import { Heading3 } from '@entur/typography'
import TransportIcon from 'app/_components/TransportIcon/TransportIcon'
import {
    getTransportModesFromLines,
    sortByTransportMode,
} from 'app/_components/TransportIcon/utils'
import { DEFAULT_COLUMNS } from 'app/_components/table_editor/TileSelector/utils'
import { LOCAL_STORAGE_BOARD_ID } from 'app/_hooks/useSaveBoardInLocalStorage'
import { isOnlyWhiteSpace } from 'app/(innlogget)/tavler/[id]/utils'
import {
    getFormFeedbackForError,
    type TFormFeedback,
} from 'app/(innlogget)/utils/forms'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { uniqBy } from 'lodash'
import { startTransition, useActionState, useState } from 'react'
import type {
    BoardDB,
    BoardTileDB,
    LocationDB,
    TileColumnDB,
} from 'src/types/db-types/boards'
import { deleteTile, saveTile } from './actions'
import { EditRemoveTileButtonGroup } from './components/EditRemoveTileButtonGroup'
import { SaveCancelDeleteTileButtonGroup } from './components/SaveCancelDeleteTileButtonGroup'
import { SetColumns } from './components/SetColumns'
import { SetOffsetDepartureTime } from './components/SetOffsetDepartureTime'
import { SetStopPlaceName } from './components/SetStopPlaceName'
import { SetVisibleLines } from './components/SetVisibleLines'
import { TileArrows } from './components/TileArrows'
import { TileContext } from './context'
import { useLines } from './useLines'

function TileCard({
    bid,
    tile,
    index,
    address,
    localStorageBoard,
    totalTiles,
    isCombined,
    moveItem,
    setTilesLocalStorageBoard,
}: {
    bid: BoardDB['id']
    tile: BoardTileDB
    index: number
    address?: LocationDB
    localStorageBoard?: BoardDB
    totalTiles: number
    isCombined: boolean
    moveItem: (index: number, direction: string) => void
    setTilesLocalStorageBoard?: (tiles: BoardDB['tiles']) => void
}) {
    const posthog = usePosthogTracking()

    const [isOpen, setIsOpen] = useState(false)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [changedFields, setChangedFields] = useState<Set<string>>(new Set())

    const isLocalStorageBoard = bid === LOCAL_STORAGE_BOARD_ID
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
        let columns = data.getAll('columns') as TileColumnDB[]
        data.delete('columns')
        const count = data.get('count') as number | null
        data.delete('count')
        const offset = data.get('offset') as number | null
        data.delete('offset')
        const displayName = data.get('displayName') as string
        data.delete('displayName')

        if (isOnlyWhiteSpace(displayName)) {
            return getFormFeedbackForError('board/tiles-name-missing')
        }

        const quayLineKeys: string[] = []
        for (const value of data.values()) {
            quayLineKeys.push(value as string)
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

        if (isCombined) {
            columns = tile.columns ?? DEFAULT_COLUMNS
        }

        const newTile: BoardTileDB = {
            ...tile,
            columns,
            quays: newQuays,
            ...(address && {
                walkingDistance: {
                    distance: tile.walkingDistance?.distance,
                },
            }),
            offset: Number(offset) || undefined,
            displayName: displayName.substring(0, 50) || undefined,
        }

        try {
            if (isLocalStorageBoard) {
                saveTileToLocalStorageBoard(newTile)
            } else {
                await saveTile(bid, newTile)
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

    const saveTileToLocalStorageBoard = (newTile: BoardTileDB) => {
        if (!localStorageBoard) return null
        const oldTileIndex = localStorageBoard.tiles.findIndex(
            (tile) => tile.uuid === newTile.uuid,
        )
        if (oldTileIndex === -1) return null

        const updatedTiles = localStorageBoard.tiles.map((existingTile) =>
            existingTile.uuid === newTile.uuid ? newTile : existingTile,
        )

        if (setTilesLocalStorageBoard) setTilesLocalStorageBoard(updatedTiles)
    }

    const deleteTileLocalStorageBoard = () => {
        if (!localStorageBoard) return null

        const remainingTiles = localStorageBoard.tiles.filter(
            (t) => t.uuid !== tile.uuid,
        )
        if (setTilesLocalStorageBoard) setTilesLocalStorageBoard(remainingTiles)

        addToast(`${tile.name} fjernet!`)
    }

    const handleSetIsTileOpen = (open: boolean) => {
        setIsOpen(open)
    }

    const handleDeleteTile = () => {
        posthog.capture('stop_place_deleted', {
            location: trackingLocation,
        })

        if (isLocalStorageBoard) {
            deleteTileLocalStorageBoard()
        } else {
            deleteTile(bid, tile).then(() => {
                addToast(`${tile.name} fjernet!`)
            })
        }
    }

    return (
        <div>
            <TileContext.Provider value={tile}>
                <div className="flex flex-row">
                    <div
                        className={`flex w-full items-center justify-between bg-white px-6 py-4 ${
                            isOpen ? 'rounded-t' : 'rounded'
                        }`}
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
                        <EditRemoveTileButtonGroup
                            hasTileChanged={hasUnsavedChanges}
                            isTileOpen={isOpen}
                            setIsTileOpen={handleSetIsTileOpen}
                            setConfirmOpen={setConfirmOpen}
                            deleteTile={handleDeleteTile}
                            trackingLocation={trackingLocation}
                        />
                    </div>
                    <TileArrows
                        index={index}
                        totalTiles={totalTiles}
                        moveItem={moveItem}
                    />
                </div>

                <BaseExpand open={isOpen}>
                    <div
                        className={`mr-14 border-t-2 bg-white px-6 py-4 ${
                            totalTiles === 1 && 'w-full'
                        } rounded-b`}
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
                                address={address}
                                trackingLocation={trackingLocation}
                                onFieldChanged={onFieldChanged}
                            />
                            <SetColumns
                                isCombined={isCombined}
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
                    </div>
                </BaseExpand>
            </TileContext.Provider>
        </div>
    )
}

export { TileCard }
