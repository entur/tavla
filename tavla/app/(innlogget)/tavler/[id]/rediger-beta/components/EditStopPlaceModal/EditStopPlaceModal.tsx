'use client'
import { SmallAlertBox } from '@entur/alert'
import { Button } from '@entur/button'
import { Modal } from '@entur/modal'
import { Heading3 } from '@entur/typography'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { startTransition, useActionState, useState } from 'react'
import type { BoardDB, BoardTileDB } from 'src/types/db-types/boards'
import { useLines } from '../utils/useLines'
import { type EditStopPlaceModalFormState, saveTile } from './actions'
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

    const [changedFields, setChangedFields] = useState<Set<string>>(new Set())

    const onFieldChanged = (field: string) => {
        setChangedFields((prev) => new Set(prev).add(field))
    }

    const reset = () => {
        setChangedFields(new Set())
        setIsOpen(false)
    }

    const quays = useLines(tile, board.isArrivals ?? false)
    const quaysWithFilteredLines =
        quays?.filter((q) => q.lines.length > 0) ?? []

    const handleSave = async (
        _prevState: EditStopPlaceModalFormState,
        data: FormData,
    ): Promise<EditStopPlaceModalFormState> => {
        const {
            columns: parsedColumns,
            offset,
            displayName,
            quayLineKeys,
            linesWithDirection: selectedLinesWithDirection,
        } = parseTileFormData(data)
        const columns = board.isCombinedTiles ? tile.columns : parsedColumns

        const totalSelectableKeys = countSelectableQuayLineKeys(
            quaysWithFilteredLines,
        )

        if (quayLineKeys.length === 0 && totalSelectableKeys > 0) {
            return {
                status: 'error',
                message: 'Du må velge en eller flere linjer for å lagre',
                field: 'lines',
            }
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

        const result = await saveTile(board.id, newTile)
        if (result?.status === 'success') {
            //capture('', { location: 'edit_board_page' })
            reset()
        }

        return result
    }

    const [state, action] = useActionState(handleSave, null)

    const generalError =
        state?.status === 'error' && !state.field ? state.message : undefined

    const linesError =
        state?.status === 'error' && state.field === 'lines'
            ? state.message
            : undefined

    const errorMessage = generalError ?? linesError

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
                        onSubmit={(e) => {
                            e.preventDefault()
                            const fd = new FormData(e.currentTarget)
                            startTransition(() => action(fd))
                        }}
                    >
                        <SetStopPlaceName
                            trackingLocation="board_page"
                            onFieldChanged={onFieldChanged}
                        />

                        <SetOffsetDepartureTime
                            address={board.meta.location}
                            isArrivals={board.isArrivals ?? false}
                            trackingLocation="board_page"
                            onFieldChanged={onFieldChanged}
                        />
                        <SetColumns
                            isCombined={board.isCombinedTiles}
                            isArrivals={board.isArrivals ?? false}
                            trackingLocation="board_page"
                            onFieldChanged={onFieldChanged}
                        />

                        <SetVisibleLines
                            quays={quaysWithFilteredLines}
                            trackingLocation="board_page"
                            onFieldChanged={onFieldChanged}
                            error={linesError}
                        />

                        {errorMessage && (
                            <SmallAlertBox
                                variant="error"
                                className="mt-4 w-fit"
                            >
                                {errorMessage}
                            </SmallAlertBox>
                        )}

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
