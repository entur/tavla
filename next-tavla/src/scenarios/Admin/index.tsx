import { TSettings } from 'types/settings'
import { AddTile } from './components/NewTileSettings'
import { ThemeSettings } from './components/ThemeSettings'
import { TilesSettings } from './components/TilesSettings'

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
        <div className={classes.settings}>
            <ThemeSettings theme={settings.theme} setTheme={setTheme} />
            <TilesSettings tiles={settings.tiles} setTiles={setTiles} />
            <AddTile addTile={addTile} />
            <button
                className="button"
                onClick={() => {
                    setFirebaseSettings(documentId, settings)
                }}
            >
                Lagre instillinger
            </button>
        </div>
    )
}

export { Admin }
