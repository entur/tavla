import {
    DndContext,
    useSensors,
    type DragEndEvent,
    useSensor,
    PointerSensor,
    KeyboardSensor,
} from '@dnd-kit/core'
import { TTile } from 'types/tile'
import { SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import {
    restrictToParentElement,
    restrictToVerticalAxis,
} from '@dnd-kit/modifiers'
import React from 'react'
import { useSettingsDispatch } from 'Admin/utils/contexts'
import { StopPlaceSettings } from './components/StopPlaceSettings'
import { QuaySettings } from './components/QuaySettings'

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
                <div className="flexColumn" data-cy="tiles">
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
                        }
                    })}
                </div>
            </SortableContext>
        </DndContext>
    )
}

export { TilesSettings }
