/* eslint-disable func-style */
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Theme } from 'src/types'
import { TTile } from './types/tile'
import { TSettings } from './types/settings'
import { getFirebaseSettings, setFirebaseSettings } from './utils/firebase'
import { TilesSettings } from './components/TilesSettings'
import { ThemeSettings } from './components/ThemeSettings'
import { addUUID } from './utils'
import { AddTile } from './components/NewTileSettings'

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
    const [settings, setSettings] = useState<TSettings>({
        ...initialSettings,
        tiles: initialSettings.tiles.map(addUUID),
    })

    const setTiles = (tiles: TTile[]) =>
        setSettings({
            ...settings,
            tiles,
        })

    const setTheme = (theme: Theme) => {
        setSettings({
            ...settings,
            theme,
        })
    }

    const addTile = (tile: TTile) => {
        setSettings({
            ...settings,
            tiles: [...settings.tiles, addUUID(tile, settings.tiles.length)],
        })
    }

    return (
        <div>
            <ThemeSettings theme={settings.theme} setTheme={setTheme} />
            <TilesSettings tiles={settings.tiles} setTiles={setTiles} />
            <hr />
            <AddTile addTile={addTile} />
            <hr />
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

export { LiteSettingsLoader as LiteSettings }
