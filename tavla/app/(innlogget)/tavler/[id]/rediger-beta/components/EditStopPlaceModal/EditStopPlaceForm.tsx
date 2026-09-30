'use client'
import { SmallAlertBox } from '@entur/alert'
import { Button } from '@entur/button'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { startTransition, useActionState, useState } from 'react'
import type {
    BoardDB,
    BoardTileDB,
    TileColumnDB,
} from 'src/types/db-types/boards'
import type { QuayWithFrontText } from '../utils/types'
import { type EditStopPlaceModalFormState, saveTile } from './actions'
import { SetColumns } from './components/SetColumns'
import { SetOffsetDepartureTime } from './components/SetOffsetDepartureTime'
import { SetStopPlaceName } from './components/SetStopPlaceName'
import { SetVisibleLines } from './components/SetVisibleLines'
import {
    countSelectableQuayLineKeys,
    deriveLinesWithDirection,
    getInitialCheckedLineIds,
} from './utils'

type SavePayload = {
    tile: BoardTileDB
    selectedLinesCount: number
}

type Props = {
    board: BoardDB
    tile: BoardTileDB
    quays: QuayWithFrontText[]
    changedFields: Set<string>
    onFieldChanged: (field: string) => void
    onSaved: () => void
    onCancel: () => void
}

function EditStopPlaceForm({
    board,
    tile,
    quays,
    changedFields,
    onFieldChanged,
    onSaved,
    onCancel,
}: Props) {
    const { capture } = usePosthogTracking()

    const [displayName, setDisplayName] = useState(tile.displayName ?? '')
    const [offset, setOffset] = useState<number | string>(tile.offset ?? '')
    const [columns, setColumns] = useState<TileColumnDB[]>(tile.columns ?? [])
    const [checkedLineIds, setCheckedLineIds] = useState<Set<string>>(() =>
        getInitialCheckedLineIds(tile, quays),
    )

    const totalSelectableKeys = countSelectableQuayLineKeys(quays)

    const handleSave = async (
        _prevState: EditStopPlaceModalFormState,
        { tile: newTile, selectedLinesCount: selectedCount }: SavePayload,
    ): Promise<EditStopPlaceModalFormState> => {
        if (selectedCount === 0 && totalSelectableKeys > 0) {
            return {
                status: 'error',
                message: 'Du må velge en eller flere linjer for å lagre',
                field: 'lines',
            }
        }

        const result = await saveTile(board.id, newTile)

        if (result?.status === 'success') {
            capture('stop_place_edit_saved', {
                location: 'board_page',
                name: changedFields.has('name'),
                offset: changedFields.has('offset'),
                offset_walking_dist: changedFields.has('offset_walking_dist'),
                columns: changedFields.has('columns'),
                lines: changedFields.has('lines'),
                transport_mode_filter: changedFields.has(
                    'transport_mode_filter',
                ),
            })
            onSaved()
        }

        return result
    }

    const [state, action, isPending] = useActionState(handleSave, null)

    function buildTile(): BoardTileDB {
        const selectedQuayLineKeys = Array.from(checkedLineIds)
        const allSelected = selectedQuayLineKeys.length === totalSelectableKeys

        const newQuays = allSelected
            ? []
            : quays
                  .map((q) => ({
                      id: q.id,
                      whitelistedLines: q.lines
                          .filter((l) =>
                              selectedQuayLineKeys.some(
                                  (key) =>
                                      key === `${q.id}||${l.id}` ||
                                      key.startsWith(`${q.id}||${l.id}||`),
                              ),
                          )
                          .map((l) => l.id),
                  }))
                  .filter((q) => q.whitelistedLines.length > 0)

        const linesWithDirection = allSelected
            ? []
            : deriveLinesWithDirection(quays, selectedQuayLineKeys)

        const hasWalkingDistance =
            board.meta.location && tile.walkingDistance?.distance !== undefined
        const hasDrivingDistance =
            board.meta.location && tile.drivingDistance?.distance !== undefined

        return {
            ...tile,
            columns: board.isCombinedTiles ? tile.columns : columns,
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
            offset: board.isArrivals ? undefined : Number(offset) || undefined,
            displayName: displayName.substring(0, 50) || undefined,
        }
    }

    const generalError =
        state?.status === 'error' && !state.field ? state.message : undefined

    const linesError =
        state?.status === 'error' && state.field === 'lines'
            ? state.message
            : undefined

    const errorMessage = generalError ?? linesError

    const handleConfirm = () => {
        const payload: SavePayload = {
            tile: buildTile(),
            selectedLinesCount: checkedLineIds.size,
        }
        startTransition(() => action(payload))
    }

    return (
        <div>
            <SetStopPlaceName
                displayName={displayName}
                onDisplayNameChange={setDisplayName}
                trackingLocation="board_page"
                onFieldChanged={onFieldChanged}
            />

            <SetOffsetDepartureTime
                offset={offset}
                onOffsetChange={setOffset}
                address={board.meta.location}
                isArrivals={board.isArrivals ?? false}
                trackingLocation="board_page"
                onFieldChanged={onFieldChanged}
            />
            <SetColumns
                columns={columns}
                onColumnsChange={setColumns}
                isCombined={board.isCombinedTiles}
                isArrivals={board.isArrivals ?? false}
                trackingLocation="board_page"
                onFieldChanged={onFieldChanged}
            />

            <SetVisibleLines
                quays={quays}
                checkedLineIds={checkedLineIds}
                onCheckedLineIdsChange={setCheckedLineIds}
                trackingLocation="board_page"
                onFieldChanged={onFieldChanged}
            />

            {errorMessage && (
                <SmallAlertBox
                    variant="error"
                    className="mt-4 w-fit"
                    role="alert"
                >
                    {errorMessage}
                </SmallAlertBox>
            )}

            <div className="mt-8 flex flex-row gap-4">
                <Button
                    className="w-full"
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={isPending}
                >
                    Avbryt
                </Button>
                <Button
                    className="w-full"
                    variant="primary"
                    onClick={handleConfirm}
                    loading={isPending}
                    disabled={isPending}
                >
                    Bekreft valg
                </Button>
            </div>
        </div>
    )
}

export { EditStopPlaceForm }
