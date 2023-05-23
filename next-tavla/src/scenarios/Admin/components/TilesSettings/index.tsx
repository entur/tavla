import { clone } from 'lodash'
import {
    DndContext,
    useSensors,
    type DragEndEvent,
    useSensor,
    PointerSensor,
    KeyboardSensor,
} from '@dnd-kit/core'
import { TQuayTile, TTile } from 'types/tile'
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
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
import { TGetQuay, TStopPlaceSettingsData } from 'types/graphql'
import { stopPlaceSettingsQuery } from 'graphql/queries/stopPlaceSettings'
import { quayQuery } from 'graphql/queries/quay'
import { TStopPlaceTile } from 'types/tile'
import { SortableColumns } from '../SortableColumns'
import { SortableHandle } from '../SortableHandle'
import { SelectLines } from '../SelectLines'

function TilesSettings({
    tiles,
    setTiles,
}: {
    tiles: TTile[]
    setTiles: (tiles: TTile[]) => void
}) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    )

    const handleTileSwap = (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            const oldIndex = tiles.findIndex((col) => col.uuid === active.id)
            const newIndex = tiles.findIndex((col) => col.uuid === over.id)

            setTiles(arrayMove(tiles, oldIndex, newIndex))
        }
    }

    const setTile = (tileIndex: number, newTile: TTile) => {
        const newTiles = clone(tiles)
        newTiles[tileIndex] = newTile
        setTiles(newTiles)
    }

    const removeTile = (tileToRemove: TTile) => {
        setTiles(tiles.filter((tile) => tile !== tileToRemove))
    }

    return (
        <DndContext
            onDragEnd={handleTileSwap}
            sensors={sensors}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        >
            <SortableContext items={tiles.map(({ uuid }) => uuid)}>
                <div className="flexColumn">
                    {tiles.map((tile, index) => {
                        const setIndexedTile = (newtile: TTile) => {
                            setTile(index, newtile)
                        }
                        const removeSelf = () => {
                            removeTile(tile)
                        }
                        switch (tile.type) {
                            case 'stop_place':
                                return (
                                    <StopPlaceSettings
                                        key={tile.uuid}
                                        tile={tile}
                                        setTile={setIndexedTile}
                                        removeSelf={removeSelf}
                                    />
                                )
                            case 'quay':
                                return (
                                    <QuaySettings
                                        key={tile.uuid}
                                        tile={tile}
                                        setTile={setIndexedTile}
                                        removeSelf={removeSelf}
                                    />
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

function StopPlaceSettings({
    tile,
    setTile,
    removeSelf,
}: {
    tile: TStopPlaceTile
    setTile: (newTile: TStopPlaceTile) => void
    removeSelf: () => void
}) {
    const [data, setData] = useState<TStopPlaceSettingsData | undefined>(
        undefined,
    )

    useEffect(() => {
        if (!tile.placeId) return
        stopPlaceSettingsQuery({ id: tile.placeId }).then(setData)
    }, [tile.placeId])

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
                        <button className="button" onClick={removeSelf}>
                            <DeleteIcon size={16} />
                        </button>
                        <SortableHandle id={tile.uuid} />
                    </div>
                </div>
                <SelectLines tile={tile} setTile={setTile} lines={lines} />
                <SortableColumns tile={tile} setTile={setTile} />
            </div>
        </SortableTileWrapper>
    )
}

function QuaySettings({
    tile,
    setTile,
    removeSelf,
}: {
    tile: TQuayTile
    setTile: (newTile: TQuayTile) => void
    removeSelf: () => void
}) {
    const [data, setData] = useState<TGetQuay | undefined>(undefined)

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
                        <button className="button" onClick={removeSelf}>
                            <DeleteIcon size={16} />
                        </button>
                        <SortableHandle id={tile.uuid} />
                    </div>
                </div>
                <SelectLines tile={tile} setTile={setTile} lines={lines} />
                <SortableColumns tile={tile} setTile={setTile} />
            </div>
        </SortableTileWrapper>
    )
}

export { TilesSettings }
