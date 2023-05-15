import { TSettings, TTheme } from 'types/settings'
import { AddTile } from './components/AddTile'
import { ThemeSettings } from './components/ThemeSettings'
import { TilesSettings } from './components/TilesSettings'
import { useState } from 'react'
import { TTile } from 'types/tile'
import classes from './styles.module.css'
import { setBoardSettings } from 'utils/firebase'

function Admin({
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

    const setTheme = (theme: TTheme) => {
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
        <div className={classes.settings}>
            <ThemeSettings theme={settings.theme} setTheme={setTheme} />
            <TilesSettings tiles={settings.tiles} setTiles={setTiles} />
            <AddTile addTile={addTile} />
            <button
                className="button"
                onClick={() => {
                    setBoardSettings(documentId, settings)
                }}
            >
                Lagre instillinger
            </button>
        </div>
    )
}

export { Admin }
