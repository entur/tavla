import {
    DndContext,
    useSensors,
    type DragEndEvent,
    useSensor,
    PointerSensor,
    KeyboardSensor,
} from '@dnd-kit/core'
import { TQuayTile, TTile } from 'types/tile'
import { SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import {
    restrictToParentElement,
    restrictToVerticalAxis,
} from '@dnd-kit/modifiers'
import React, { useEffect, useState } from 'react'
import { fieldsNotNull } from 'utils/typeguards'
import { DeleteIcon } from '@entur/icons'
import { Loader } from '@entur/loader'
import { SortableTileWrapper } from '../SortableTileWrapper'
import classes from './styles.module.css'
import { TGetQuay } from 'types/graphql'
import { quayQuery } from 'graphql/queries/quay'
import { TStopPlaceTile } from 'types/tile'
import { SortableColumns } from '../SortableColumns'
import { SortableHandle } from '../SortableHandle'
import { SelectLines } from '../SelectLines'
import { useSettingsDispatch } from 'scenarios/Admin/reducer'
import { useQuery } from 'graphql/utils'
import { StopPlaceSettingsQuery } from 'graphql/index'

function TilesSettings({ tiles }: { tiles: TTile[] }) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    )

    const dispatch = useSettingsDispatch()

    const handleTileSwap = (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            const oldIndex = tiles.findIndex((col) => col.uuid === active.id)
            const newIndex = tiles.findIndex((col) => col.uuid === over.id)

            dispatch({ type: 'swapTiles', oldIndex, newIndex })
        }
    }

    return (
        <DndContext
            onDragEnd={handleTileSwap}
            sensors={sensors}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        >
            <SortableContext items={tiles.map(({ uuid }) => uuid)}>
                <div className="flexColumn">
                    {tiles.map((tile) => {
                        switch (tile.type) {
                            case 'stop_place':
                                return (
                                    <StopPlaceSettings
                                        key={tile.uuid}
                                        tile={tile}
                                    />
                                )
                            case 'quay':
                                return (
                                    <QuaySettings key={tile.uuid} tile={tile} />
                                )
                            case 'map':
                                return null
                        }
                    })}
                </div>
            </SortableContext>
        </DndContext>
    )
}

function StopPlaceSettings({ tile }: { tile: TStopPlaceTile }) {
    const dispatch = useSettingsDispatch()

    const { data } = useQuery(StopPlaceSettingsQuery, { id: tile.placeId })

    const lines =
        data?.stopPlace?.quays
            ?.flatMap((q) => q?.lines)
            .filter(fieldsNotNull) || []

    return (
        <SortableTileWrapper id={tile.uuid}>
            <div className={classes.tableTile}>
                <div className={classes.tileHeader}>
                    {!data ? <Loader /> : data.stopPlace?.name ?? tile.placeId}
                    <div className="flexBetween">
                        <button
                            className="button"
                            onClick={() =>
                                dispatch({
                                    type: 'removeTile',
                                    tileId: tile.uuid,
                                })
                            }
                        >
                            <DeleteIcon size={16} />
                        </button>
                        <SortableHandle id={tile.uuid} />
                    </div>
                </div>
                <SelectLines tile={tile} lines={lines} />
                <SortableColumns tile={tile} />
            </div>
        </SortableTileWrapper>
    )
}

function QuaySettings({ tile }: { tile: TQuayTile }) {
    const [data, setData] = useState<TGetQuay | undefined>(undefined)

    const dispatch = useSettingsDispatch()

    useEffect(() => {
        if (!tile.placeId) return
        quayQuery({ quayId: tile.placeId }).then(setData)
    }, [tile.placeId])

    const lines = data?.quay?.lines.filter(fieldsNotNull) ?? []
    return (
        <SortableTileWrapper id={tile.uuid}>
            <div className={classes.tableTile}>
                <div className={classes.tileHeader}>
                    {!data ? (
                        <Loader />
                    ) : (
                        (data.quay?.name ?? tile.placeId) +
                        ' - ' +
                        (data.quay?.description ?? data.quay?.publicCode)
                    )}
                    <div className="flexBetween">
                        <button
                            className="button"
                            onClick={() =>
                                dispatch({
                                    type: 'removeTile',
                                    tileId: tile.uuid,
                                })
                            }
                        >
                            <DeleteIcon size={16} />
                        </button>
                        <SortableHandle id={tile.uuid} />
                    </div>
                </div>
                <SelectLines tile={tile} lines={lines} />
                <SortableColumns tile={tile} />
            </div>
        </SortableTileWrapper>
    )
}

export { TilesSettings }
