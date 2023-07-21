import { TSettings } from 'types/settings'
import { TTile } from 'types/tile'
import { StopPlaceTile } from '../StopPlaceTile'
import { QuayTile } from '../QuayTile'
import classes from './styles.module.css'
import { Tile } from 'components/Tile'

function BoardTile({ tileSpec }: { tileSpec: TTile }) {
    switch (tileSpec.type) {
        case 'stop_place':
            return <StopPlaceTile {...tileSpec} />
        case 'quay':
            return <QuayTile {...tileSpec} />
    }
}

function Board({ settings }: { settings: TSettings }) {
    if (!settings.tiles.length)
        return (
            <Tile className={classes.emptyTile}>
                <p>Du har ikke lagt til noen holdeplasser enda.</p>
            </Tile>
        )

    const fontScale = 1 / Math.ceil(Math.sqrt(settings.tiles.length))

    return (
        <div
            className={classes.board}
            style={{
                fontSize: 100 * fontScale + '%',
            }}
        >
            {settings.tiles.map((tile, index) => {
                return <BoardTile key={index} tileSpec={tile} />
            })}
        </div>
    )
}

export { Board }
