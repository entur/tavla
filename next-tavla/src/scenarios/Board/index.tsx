import { Tile } from 'scenarios/Tile'
import { TSettings } from 'types/settings'
import classes from './styles.module.css'

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
