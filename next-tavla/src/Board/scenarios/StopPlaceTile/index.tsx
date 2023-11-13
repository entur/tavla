import { TStopPlaceTile } from 'types/tile'
import { Table } from '../../scenarios/Table'
import classes from './styles.module.css'
import { useQuery } from 'graphql/utils'
import { StopPlaceQuery } from 'graphql/index'
import { Tile } from 'components/Tile'
import { TableHeader } from '../Table/components/TableHeader'
import { boardStyles, previewStyles } from 'types/board'

export function StopPlaceTile({
    placeId,
    whitelistedLines,
    whitelistedTransportModes,
    columns,
    preview,
}: TStopPlaceTile & { preview?: boolean }) {
    const { data } = useQuery(
        StopPlaceQuery,
        { stopPlaceId: placeId, whitelistedTransportModes, whitelistedLines },
        { poll: true },
    )

    if (!data) {
        return <Tile>Loading data</Tile>
    }

    if (!data.stopPlace) {
        return <Tile>Data not found</Tile>
    }

    return (
        <Tile
            className={classes.stopPlaceTile}
            style={{
                backgroundColor: preview
                    ? previewStyles.background
                    : boardStyles.background,
            }}
        >
            <TableHeader heading={data.stopPlace.name} />
            <Table
                departures={data.stopPlace.estimatedCalls}
                columns={columns}
            />
        </Tile>
    )
}
