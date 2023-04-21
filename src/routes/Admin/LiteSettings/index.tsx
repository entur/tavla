import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Theme } from 'src/types'
import {
    arrayMove,
    horizontalListSortingStrategy,
    SortableContext,
    useSortable,
} from '@dnd-kit/sortable'
import { DndContext, type DragEndEvent } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { cloneDeep, set } from 'lodash'
import { TColumn, TStopPlaceTile, TTile } from './types/tile'
import { TSettings } from './types/settings'
import { getFirebaseSettings, setFirebaseSettings } from './utils/firebase'

function LiteSettingsLoader() {
    const { documentId } = useParams<{ documentId: string }>()
    const [settings, setSettings] = useState<TSettings | undefined | null>(null)

    useEffect(() => {
        if (!documentId) return

        getFirebaseSettings(documentId).then(setSettings)
    }, [documentId])

    if (!documentId)
        return <div>Noe har gått galt, hvordan kom du deg hit?</div>

    if (settings === null) return <div>Loading</div>

    if (settings === undefined)
        return (
            <div>
                Vi fant ikke denne Lite-Tavla. Vil du opprette den?
                <br />
                <button
                    onClick={() => {
                        const defaultSettings: TSettings = { tiles: [] }
                        setSettings(defaultSettings)
                        setFirebaseSettings(documentId, defaultSettings)
                    }}
                >
                    Opprett lite-tavle
                </button>
            </div>
        )

    return <LiteSettings initialSettings={settings} documentId={documentId} />
}

function LiteSettings({
    initialSettings,
    documentId,
}: {
    initialSettings: TSettings
    documentId: string
}) {
    const [settings, setSettings] = useState(initialSettings)

    const setTile = (tileIndex: number, newTile: TTile) => {
        let newSettings = cloneDeep(settings)
        setSettings(set(newSettings, `tiles[${tileIndex}]`, newTile))
    }

    return (
        <div>
            <ThemeSettings
                initialSettings={initialSettings}
                documentId={documentId}
            />
            <LiteTilesManager tiles={initialSettings.tiles} setTile={setTile} />
            <button
                onClick={() => {
                    setFirebaseSettings(documentId, settings)
                }}
            >
                Save
            </button>
        </div>
    )
}

function LiteTilesManager({
    tiles,
    setTile,
}: {
    tiles: TTile[]
    setTile: (tileIndex: number, newTile: TTile) => void
}) {
    const tilesWithId = tiles.map((tile: TTile, index: number) => ({
        id: index,
        tile,
    }))
    return (
        <DndContext>
            {tilesWithId.map((tile, index) => {
                const setIndexedTile = useCallback(
                    (tile: TTile) => {
                        setTile(index, tile)
                    },
                    [index],
                )
                //
                switch (tile.tile.type) {
                    case 'stop_place':
                        return (
                            <LiteStopPlaceTile
                                key={tile.id}
                                tile={tile.tile}
                                setTile={setIndexedTile}
                            />
                        )
                    case 'quay':
                        return null
                    case 'map':
                        return null
                }
            })}
        </DndContext>
    )
}

function LiteStopPlaceTile({
    tile,
    setTile,
}: {
    tile: TStopPlaceTile
    setTile: (newTile: TStopPlaceTile) => void
}): JSX.Element {
    const [columns, setColumns] = useState(tile.columns ?? [])

    useEffect(() => {
        setTile({ ...tile, columns })
    }, [columns, setTile])

    const handleColumnSwap = (event: DragEndEvent) => {
        const { active, over } = event

        if (active && over && active.id !== over.id) {
            setColumns((newColumns) => {
                const oldIndex = newColumns.indexOf(active.id as TColumn)
                const newIndex = newColumns.indexOf(over.id as TColumn)
                return arrayMove(newColumns, oldIndex, newIndex)
            })
        }
    }

    return (
        <DndContext onDragEnd={handleColumnSwap}>
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    backgroundColor: 'white',
                    color: 'black',
                }}
            >
                {tile.placeId}
                <div style={{ display: 'flex', height: '500px', gap: '10px' }}>
                    <SortableContext
                        items={columns}
                        strategy={horizontalListSortingStrategy}
                    >
                        {columns.map((column: string) => (
                            <LiteTileColumn key={column} column={column} />
                        ))}
                    </SortableContext>
                </div>
            </div>
        </DndContext>
    )
}

function LiteTileColumn({ column }: { column: string }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: column })

    const positionStyle = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div
            ref={setNodeRef}
            style={{
                color: 'white',
                backgroundColor: '#292b6a',
                flex: 1,
                padding: '1rem',
                borderRadius: '0.5rem',
                ...positionStyle,
            }}
            {...attributes}
            {...listeners}
        >
            {column}
        </div>
    )
}

const themes: Record<Theme, string> = {
    default: 'Entur',
    dark: 'Mørk',
    light: 'Lyst',
    grey: 'Grå',
}

function ThemeSettings({
    initialSettings,
    documentId,
}: {
    initialSettings: TSettings
    documentId: string
}) {
    const [data, setData] = useState<TSettings>(initialSettings)
    return (
        <div>
            {JSON.stringify(data)}
            <br />
            <select
                value={data?.theme}
                onChange={(e) =>
                    setData((old) => ({
                        ...old,
                        theme: e.target.value as Theme,
                    }))
                }
            >
                {Object.entries(themes).map(([key, value]) => (
                    <option key={key} value={key}>
                        {value}
                    </option>
                ))}
            </select>
            <br />
        </div>
    )
}

export { LiteSettingsLoader as LiteSettings }
