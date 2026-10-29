'use client'
import { SmallAlertBox } from '@entur/alert'
import { Button } from '@entur/button'
import { startTransition, useActionState, useState } from 'react'
import type {
    BoardDB,
    BoardTileDB,
    QuaysFilterDB,
    TileColumnDB,
} from 'src/types/db-types/boards'
import type { QuayWithFrontText } from '../utils/types'
import { type EditStopPlaceModalFormState, saveTile } from './actions'
import { SetColumns } from './components/SetColumns'
import { SetFilter } from './components/SetFilter'
import { SetOffsetDepartureTime } from './components/SetOffsetDepartureTime'
import { SetStopPlaceName } from './components/SetStopPlaceName'
import { expandedQuaysFilterToCompact } from './utils'

type SavePayload = {
    tile: BoardTileDB
}

type Props = {
    board: BoardDB
    tile: BoardTileDB
    quays: QuayWithFrontText[]
    onFieldChanged: (field: string) => void
    onSaved: () => void
    onCancel: () => void
}

function EditStopPlaceForm({
    board,
    tile,
    quays,
    onFieldChanged,
    onSaved,
    onCancel,
}: Props) {
    const [displayName, setDisplayName] = useState(tile.displayName ?? '')

    const [filterType, setFilterType] = useState<
        'stopPlaceFilter' | 'quaysFilter'
    >('stopPlaceFilter')
    const [quaysFilter, setQuaysFilter] = useState<QuaysFilterDB>(() => ({
        type: 'quaysFilter',
        quays: quays.map((quay) => ({
            id: quay.id,
            whitelistedLines: quay.lines.map((line) => line.id),
        })),
    }))
    // TODO - add stopPlaceFilter state and initialization

    const [offset, setOffset] = useState<number | string>(tile.offset ?? '')
    const [columns, setColumns] = useState<TileColumnDB[]>(tile.columns ?? [])

    const handleSave = async (
        _prevState: EditStopPlaceModalFormState,
        { tile: newTile }: SavePayload,
    ): Promise<EditStopPlaceModalFormState> => {
        if (filterType === 'quaysFilter') {
            if (
                quaysFilter.quays.length === 0 ||
                quaysFilter.quays.every(
                    (quay) => quay.whitelistedLines.length === 0,
                )
            ) {
                return {
                    status: 'error',
                    message: 'Du må velge en eller flere linjer for å lagre',
                    field: 'lines',
                }
            }
        }

        const result = await saveTile(board.id, newTile)

        if (result?.status === 'success') {
            onSaved()
        }

        return result
    }

    const [state, action, isPending] = useActionState(handleSave, null)

    function buildTile(): BoardTileDB {
        const hasWalkingDistance =
            board.meta.location && tile.walkingDistance?.distance !== undefined
        const hasDrivingDistance =
            board.meta.location && tile.drivingDistance?.distance !== undefined

        return {
            ...tile,
            columns: board.isCombinedTiles ? tile.columns : columns,
            quays: expandedQuaysFilterToCompact(quaysFilter, quays).quays, // TODO - ta bort for å sikre at alle nye bare skrives til filteret
            filter:
                filterType === 'quaysFilter'
                    ? expandedQuaysFilterToCompact(quaysFilter, quays)
                    : {
                          type: 'stopPlaceFilter',
                          whitelistedModes: [],
                          whitelistedLines: [],
                      },
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
        }
        startTransition(() => action(payload))
    }

    return (
        <div className="flex flex-col gap-8">
            <SetStopPlaceName
                displayName={displayName}
                onDisplayNameChange={setDisplayName}
                trackingLocation="board_page"
                onFieldChanged={onFieldChanged}
            />

            <SetFilter
                quays={quays}
                filterMode={filterType}
                setFilterMode={setFilterType}
                quaysFilter={quaysFilter}
                setQuaysFilter={setQuaysFilter}
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

            {errorMessage && (
                <SmallAlertBox
                    variant="error"
                    className="mt-4 w-fit"
                    role="alert"
                >
                    {errorMessage}
                </SmallAlertBox>
            )}

            <div className="sticky bottom-0 bg-background flex flex-row gap-4 pb-12 pt-4 mt-8">
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
