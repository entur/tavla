import { Heading3 } from '@entur/typography'
import { Table } from 'Board/scenarios/Table'
import { TDepartureFragment } from 'graphql/index'
import { TQuayTile, TStopPlaceTile } from 'types/tile'

function SwapColumn({
    tile,
    departures,
}: {
    tile: TStopPlaceTile | TQuayTile
    departures?: TDepartureFragment[]
}) {
    if (!departures)
        return <div>Forhåndsvisning av holdeplass kunne ikke lastes!</div>

    return (
        <>
            <Heading3>Forhåndsvisning av holdeplass</Heading3>
            <div
                data-theme="dark"
                style={{
                    backgroundColor: 'var(--main-background-color)',
                    borderRadius: '1em',
                    padding: '1em',
                    marginTop: '2em',
                }}
            >
                <Table departures={departures} columns={tile.columns} />
            </div>
        </>
    )
}

export { SwapColumn }
