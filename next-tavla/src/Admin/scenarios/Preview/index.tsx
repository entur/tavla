import { Heading3 } from '@entur/typography'
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
                <Heading3>Forhåndsvisning av holdeplass</Heading3>
                <div className={classes.preview}>
                    Forhåndsvisningen av holdeplassen kunne ikke lastes!
                </div>
            </div>
        )

    return (
        <div>
            <Heading3>Forhåndsvisning av holdeplass</Heading3>
            <div data-theme="default" className={classes.preview}>
                <Table departures={departures} columns={tile.columns} />
            </div>
        </div>
    )
}

export { Preview }
