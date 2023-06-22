import { TSettings } from 'types/settings'
import { TTile } from 'types/tile'
import { StopPlaceTile } from '../StopPlaceTile'
import { MapTile } from '../MapTile'
import { QuayTile } from '../QuayTile'
import classes from './styles.module.css'
import { FooterText } from '../FooterText'

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
        <div>
             <FooterText text={settings.footer}/>
            <div className={classes.board}>
                {settings.tiles.map((tile, index) => {
                    return <Tile key={index} tileSpec={tile} />
                })}
            </div>
        </div>
    )
}

export { Board }
