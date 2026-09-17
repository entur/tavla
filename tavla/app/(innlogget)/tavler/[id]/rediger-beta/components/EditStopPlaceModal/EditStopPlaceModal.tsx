'use client'
import { SmallAlertBox } from '@entur/alert'
import { Button } from '@entur/button'
import { Modal } from '@entur/modal'
import { Heading3 } from '@entur/typography'
import { isOnlyWhiteSpace } from 'app/(innlogget)/tavler/[id]/utils'
import {
    getFormFeedbackForError,
    type TFormFeedback,
} from 'app/(innlogget)/utils/forms'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { startTransition, useActionState, useEffect, useState } from 'react'
import type { BoardDB, BoardTileDB } from 'src/types/db-types/boards'
import { useLines } from '../utils/useLines'
import { saveTile } from './actions'
import { SetColumns } from './components/SetColumns'
import { SetOffsetDepartureTime } from './components/SetOffsetDepartureTime'
import { SetStopPlaceName } from './components/SetStopPlaceName'
import { SetVisibleLines } from './components/SetVisibleLines'
import { TileContext } from './context'
import { countSelectableQuayLineKeys, parseTileFormData } from './utils'

function EditStopPlaceModal({
    isOpen,
    setIsOpen,
    board,
    tile,
}: {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    board: BoardDB
    tile: BoardTileDB
}) {
    const { capture } = usePosthogTracking()

    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [changedFields, setChangedFields] = useState<Set<string>>(new Set())

    const onFieldChanged = (field: string) => {
        setChangedFields((prev) => new Set(prev).add(field))
        setHasUnsavedChanges(true)
    }

    // HUSK Å FJERNE DENNE!
    useEffect(() => {
        console.log('sett med changedFields:', changedFields)
    }, [changedFields])

    const reset = () => {
        setHasUnsavedChanges(false)
        setChangedFields(new Set())
        setIsOpen(false)
    }

    const quays = useLines(tile, board.isArrivals ?? false)
    const quaysWithFilteredLines =
        quays?.filter((q) => q.lines.length > 0) ?? []

    const handleSave = async (
        _prevState: TFormFeedback | undefined,
        data: FormData,
    ) => {
        const {
            columns: parsedColumns,
            offset,
            displayName,
            quayLineKeys,
            linesWithDirection: selectedLinesWithDirection,
        } = parseTileFormData(data)
        const columns = board.isCombinedTiles ? tile.columns : parsedColumns

        if (isOnlyWhiteSpace(displayName)) {
            return getFormFeedbackForError('board/tiles-name-missing') //TODO: endre til å ikke bruke den lange delte listen
        }

        const totalSelectableKeys = countSelectableQuayLineKeys(
            quaysWithFilteredLines,
        )

        if (quayLineKeys.length === 0 && totalSelectableKeys > 0) {
            return getFormFeedbackForError('board/tiles-no-lines-selected') //TODO: endre til å ikke bruke den lange delte listen
        }

        const allSelected = quayLineKeys.length === totalSelectableKeys

        const newQuays = allSelected
            ? []
            : quaysWithFilteredLines
                  .map((q) => ({
                      id: q.id,
                      whitelistedLines: q.lines
                          .filter((l) =>
                              quayLineKeys.some(
                                  (key) =>
                                      key === `${q.id}||${l.id}` ||
                                      key.startsWith(`${q.id}||${l.id}||`),
                              ),
                          )
                          .map((l) => l.id),
                  }))
                  .filter((q) => q.whitelistedLines.length > 0)

        const linesWithDirection = allSelected ? [] : selectedLinesWithDirection

        const hasWalkingDistance =
            board.meta.location && tile.walkingDistance?.distance !== undefined
        const hasDrivingDistance =
            board.meta.location && tile.drivingDistance?.distance !== undefined

        const newTile: BoardTileDB = {
            ...tile,
            columns,
            quays: newQuays,
            linesWithDirection,
            ...(hasWalkingDistance && {
                walkingDistance: {
                    distance: tile.walkingDistance?.distance,
                },
            }),
            ...(hasDrivingDistance && {
                drivingDistance: {
                    distance: tile.drivingDistance?.distance,
                },
            }),
            offset: Number(offset) || undefined,
            displayName: displayName.substring(0, 50) || undefined,
        }

        try {
            await saveTile(board.id, newTile)
            reset()
        } catch {
            return getFormFeedbackForError('board/tiles-save-failed')
        }
    }

    const [state, action] = useActionState(handleSave, undefined)

    // const generalError =
    //     state?.form_type === 'general' ? state.feedback : undefined

    //TODO: sjekke om tracklocation skal endres til noe mer spesifikt (endre i events.ts)

    return (
        <Modal
            open={isOpen}
            onDismiss={() => {
                setIsOpen(false)
                reset()
            }}
            size="large"
            data-transport-palette={board.transportPalette}
        >
            <TileContext.Provider value={tile}>
                <Heading3 as="h1">
                    Rediger {tile.displayName ?? tile.name}
                </Heading3>

                {!quays ? (
                    <div>Laster...</div>
                ) : (
                    <form
                        id={tile.uuid}
                        // la til id som skal brukes i modal hvis mang går ut når endringer er gjort
                        onSubmit={(e) => {
                            e.preventDefault()
                            const fd = new FormData(e.currentTarget)
                            startTransition(() => action(fd))
                        }}
                        onInput={() => setHasUnsavedChanges(true)}
                    >
                        <SetVisibleLines
                            quays={quaysWithFilteredLines}
                            trackingLocation="board_page"
                            onFieldChanged={onFieldChanged}
                        />
                        <SetColumns
                            isCombined={board.isCombinedTiles}
                            isArrivals={board.isArrivals ?? false}
                            trackingLocation="board_page"
                            onFieldChanged={onFieldChanged}
                        />

                        <SetStopPlaceName
                            state={state}
                            trackingLocation="board_page"
                            onFieldChanged={onFieldChanged}
                        />

                        <SetOffsetDepartureTime
                            address={board.meta.location}
                            isArrivals={board.isArrivals ?? false}
                            trackingLocation="board_page"
                            onFieldChanged={onFieldChanged}
                        />

                        {/* {generalError && (
                            <SmallAlertBox
                                variant="warning"
                                className="mt-4 w-fit"
                            >
                                {generalError}
                            </SmallAlertBox>
                        )} */}

                        {/* SETTE INN TILSVARENDE SaveCancelDeleteButtonGroup her, passe på at men får popup når man har gjort endringer og prøver å gå ut. */}

                        <div className="mt-8 flex flex-row gap-4">
                            <Button
                                className="w-full"
                                type="button"
                                variant="secondary"
                                onClick={() => setIsOpen(false)}
                            >
                                Avbryt
                            </Button>
                            <Button
                                className="w-full"
                                type="submit"
                                variant="primary"
                                onClick={() => {
                                    capture('stop_place_edit_saved', {
                                        location: 'board_page',
                                        name: changedFields.has('name'),
                                        offset: changedFields.has('offset'),
                                        offset_walking_dist: changedFields.has(
                                            'offset_walking_dist',
                                        ),
                                        columns: changedFields.has('columns'),
                                        lines: changedFields.has('lines'),
                                        transport_mode_filter:
                                            changedFields.has(
                                                'transport_mode_filter',
                                            ),
                                    })
                                }}
                            >
                                Bekreft valg
                            </Button>
                        </div>
                    </form>
                )}
            </TileContext.Provider>
        </Modal>
    )
}

export { EditStopPlaceModal }
