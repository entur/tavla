import { Table } from 'Board/scenarios/Table'
import { TDepartureFragment } from 'graphql/index'
import { TQuayTile, TStopPlaceTile } from 'types/tile'
import classes from './styles.module.css'

function Preview({
    tile,
    departures,
}: {
    tile: TStopPlaceTile | TQuayTile
    departures?: TDepartureFragment[]
}) {
    if (!departures)
        return (
            <div>
                <div className={classes.preview}>
                    Forhåndsvisningen av holdeplassen kunne ikke lastes!
                </div>
            </div>
        )

    return (
        <div>
            <div data-theme="default" className={classes.preview}>
                <Table departures={departures} columns={tile.columns} />
            </div>
        </div>
    )
}

export { Preview }
