import { TSettings } from 'types/settings'
import { TTile } from 'types/tile'
import { StopPlaceTile } from './scenarios/StopPlaceTile'
import { MapTile } from './scenarios/MapTile'
import { QuayTile } from './scenarios/QuayTile'
import classes from './styles.module.css'

function Tile({ tileSpec }: { tileSpec: TTile }) {
    switch (tileSpec.type) {
        case 'stop_place':
            return <StopPlaceTile {...tileSpec} />
        case 'quay':
            return <QuayTile {...tileSpec} />
        case 'map':
            return <MapTile {...tileSpec} />
    }
}

function Board({ settings }: { settings: TSettings }) {
    return (
        <div className={classes.board}>
            {settings.tiles.map((tile, index) => {
                return <Tile key={index} tileSpec={tile} />
            })}
        </div>
    )
}

export { Board }
