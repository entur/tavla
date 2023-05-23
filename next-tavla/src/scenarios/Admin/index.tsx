import { TSettings, TTheme } from 'types/settings'
import { ThemeSettings } from './components/ThemeSettings'
import { TilesSettings } from './components/TilesSettings'
import { useState } from 'react'
import { TTile } from 'types/tile'
import classes from './styles.module.css'
import { setBoardSettings } from 'utils/firebase'
import dynamic from 'next/dynamic'
import { AddTile } from './components/AddTile'

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

// No SSR for Admin to fix hydration issues
// caused by incompatible libraries (dnd-kit, @entur/dropdown)
// https://github.com/clauderic/dnd-kit/issues/801
const NonSSRAdmin = dynamic(() => Promise.resolve(Admin), { ssr: false })

export { NonSSRAdmin as Admin }
