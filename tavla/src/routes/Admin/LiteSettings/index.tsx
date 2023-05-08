/* eslint-disable func-style */
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Theme } from 'src/types'
import { TTile } from 'ltypes/tile'
import { TSettings } from 'ltypes/settings'
import { getFirebaseSettings, setFirebaseSettings } from 'lutils/firebase'
import { TilesSettings } from 'lcomponents/TilesSettings'
import { ThemeSettings } from 'lcomponents/ThemeSettings'
import { addUUID } from 'lite/utils'
import { AddTile } from 'lcomponents/NewTileSettings'
import { Button } from '@entur/button'

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <ThemeSettings theme={settings.theme} setTheme={setTheme} />
            <TilesSettings tiles={settings.tiles} setTiles={setTiles} />
            <AddTile addTile={addTile} />
            <Button
                variant="primary"
                onClick={() => {
                    setFirebaseSettings(documentId, settings)
                }}
            >
                Lagre instillinger
            </Button>
        </div>
    )
}

export { LiteSettingsLoader as LiteSettings }
