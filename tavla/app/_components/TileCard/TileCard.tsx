'use client'
import { useToast } from '@entur/alert'
import { Button, ButtonGroup, IconButton } from '@entur/button'
import { CloseIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { Heading3, Paragraph } from '@entur/typography'
import { SubmitButton } from 'app/_components/Form/SubmitButton'
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
import Goat from 'assets/illustrations/Goat.png'
import { uniqBy } from 'lodash'
import Image from 'next/image'
import { startTransition, useActionState, useState } from 'react'
import type { BoardDB, BoardTileDB } from 'types/db-types/boards'
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
import { parseTileFormData } from './utils'

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
            linesWithDirection: selectedLinesWithDirection,
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

        const linesWithDirection = allSelected ? [] : selectedLinesWithDirection

        const newTile: BoardTileDB = {
            ...tile,
            columns,
            quays: newQuays,
            linesWithDirection,
            ...(board.meta.location && {
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
                await saveTile(board.id, newTile)
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

    const quays = useLines(tile, board.isArrivals ?? false)

    const quaysWithFilteredLines = (quays ?? [])
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
        if (!isLocalStorageBoard) return null
        const oldTileIndex = board.tiles.findIndex(
            (tile) => tile.uuid === newTile.uuid,
        )
        if (oldTileIndex === -1) return null

        const updatedTiles = board.tiles.map((existingTile) =>
            existingTile.uuid === newTile.uuid ? newTile : existingTile,
        )

        if (setTilesLocalStorageBoard) setTilesLocalStorageBoard(updatedTiles)
    }

    const deleteTileLocalStorageBoard = () => {
        if (!isLocalStorageBoard) return null

        const remainingTiles = board.tiles.filter((t) => t.uuid !== tile.uuid)
        if (setTilesLocalStorageBoard) setTilesLocalStorageBoard(remainingTiles)

        addToast(`${tile.name} fjernet!`)
    }

    const handleSetIsTileOpen = (open: boolean) => {
        setIsOpen(open)
    }

    const handleDeleteTile = () => {
        capture('stop_place_deleted', {
            location: trackingLocation,
        })

        if (isLocalStorageBoard) {
            deleteTileLocalStorageBoard()
        } else {
            deleteTile(board.id, tile).then(() => {
                addToast(`${tile.name} fjernet!`)
            })
        }
    }

    const fieldsChanged = {
        name: changedFields.has('name'),
        offset: changedFields.has('offset'),
        offset_walking_dist: changedFields.has('offset_walking_dist'),
        columns: changedFields.has('columns'),
        lines: changedFields.has('lines'),
        transport_mode_filter: changedFields.has('transport_mode_filter'),
    }

    const handleDismiss = () => {
        capture('stop_place_edit_cancelled', {
            location: trackingLocation,
            unsavedChanges: hasUnsavedChanges,
        })

        if (hasUnsavedChanges) return setConfirmOpen(true)
        reset()
    }

    return (
        <div>
            <TileContext.Provider value={tile}>
                <div className="flex flex-row">
                    <div className="flex w-full items-center justify-between rounded bg-white px-6 py-4">
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
                            setIsTileOpen={handleSetIsTileOpen}
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

                <Modal
                    open={isOpen}
                    onDismiss={handleDismiss}
                    size="large"
                    closeLabel="Lukk redigering"
                    title={`Redigerer ${tile.displayName ?? tile.name}`}
                >
                    {!quays ? (
                        <div className="flex items-center justify-between p-4">
                            Laster...
                        </div>
                    ) : (
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
                                isArrivals={board.isArrivals ?? false}
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
                                hasTileChanged={hasUnsavedChanges}
                                setIsTileOpen={handleSetIsTileOpen}
                                setConfirmOpen={setConfirmOpen}
                                validation={state}
                                trackingLocation={trackingLocation}
                                fieldsChanged={fieldsChanged}
                            />
                        </form>
                    )}
                </Modal>

                <Modal
                    size="small"
                    open={confirmOpen}
                    onDismiss={() => setConfirmOpen(false)}
                    closeLabel="Avbryt endring"
                >
                    <IconButton
                        aria-label="Lukk"
                        onClick={() => setConfirmOpen(false)}
                        className="absolute right-4 top-4"
                    >
                        <CloseIcon />
                    </IconButton>
                    <div className="flex flex-col items-center">
                        <Image alt="" src={Goat} className="h-1/2 w-1/2" />
                        <Heading3 margin="bottom" as="h1">
                            Lagre endringer
                        </Heading3>
                        <Paragraph>
                            Du har endringer som ikke er lagret.
                        </Paragraph>

                        <ButtonGroup className="flex flex-row">
                            <SubmitButton
                                variant="primary"
                                width="fluid"
                                form={tile.uuid}
                                aria-label="Lagre endringer"
                                onClick={() => {
                                    capture('stop_place_edit_saved', {
                                        location: trackingLocation,
                                        ...fieldsChanged,
                                    })
                                }}
                            >
                                Lagre
                            </SubmitButton>
                            <Button
                                type="button"
                                variant="secondary"
                                width="fluid"
                                aria-label="Forkast endringer"
                                onClick={() => {
                                    capture('stop_place_edit_discard', {
                                        location: trackingLocation,
                                    })
                                    reset()
                                }}
                            >
                                Forkast
                            </Button>
                        </ButtonGroup>
                    </div>
                </Modal>
            </TileContext.Provider>
        </div>
    )
}
