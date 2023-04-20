import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Theme } from 'src/types'
import { useSortable } from '@dnd-kit/sortable'
import { DndContext } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { TTile } from './types/tile'
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
    return (
        <div>
            <Settings
                initialSettings={initialSettings}
                documentId={documentId}
            />
            <LiteTilesManager tiles={initialSettings.tiles} />
        </div>
    )
}

function LiteTilesManager({ tiles }: { tiles: TTile[] }) {
    const tilesWithId = tiles.map((tile: TTile, index: number) => ({
        id: index,
        tile,
    }))
    return (
        <DndContext>
            {tilesWithId.map((tile) => (
                <LiteTile key={tile.id} tile={tile.tile} />
            ))}
        </DndContext>
    )
}

function LiteTile({ tile }: { tile: TTile }) {
    if (tile.type === 'map') return null
    return (
        <DndContext>
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
                    {tile?.columns?.map((column) => (
                        <LiteTileColumn key={column} column={column} />
                    ))}
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
                backgroundColor: '#aeb7e2',
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

function Settings({
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
            <button
                onClick={() => {
                    setFirebaseSettings(documentId, data)
                }}
            >
                Save
            </button>
        </div>
    )
}

export { LiteSettingsLoader as LiteSettings }
