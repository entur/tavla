/* eslint-disable func-style */
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Theme } from 'src/types'
import { TTile } from 'lite/types/tile'
import { TSettings } from 'lite/types/settings'
import { getFirebaseSettings, setFirebaseSettings } from 'lite/utils/firebase'
import { TilesSettings } from 'lite/components/TilesSettings'
import { ThemeSettings } from 'lite/components/ThemeSettings'
import { AddTile } from 'lite/components/NewTileSettings'
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
    const [settings, setSettings] = useState<TSettings>(initialSettings)

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
            tiles: [...settings.tiles, tile],
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
