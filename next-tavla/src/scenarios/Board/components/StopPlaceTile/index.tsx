import { TStopPlaceTile } from 'types/tile'
import { Table } from 'scenarios/Table'
import classes from './styles.module.css'
import { useQuery } from 'graphql/utils'
import { StopPlaceQuery } from 'graphql/index'

export function StopPlaceTile({
    placeId,
    columns,
    whitelistedLines,
    whitelistedTransportModes,
}: TStopPlaceTile) {
    const { data } = useQuery(
        StopPlaceQuery,
        { stopPlaceId: placeId, whitelistedTransportModes, whitelistedLines },
        true,
    )

    if (!data) {
        return <div className="tile">Loading data</div>
    }

    if (!data.stopPlace) {
        return <div className="tile">Data not found</div>
    }

    return (
        <div className={classes.stopPlaceTile}>
            <h3>{data.stopPlace.name}</h3>
            <Table
                columns={columns}
                departures={data.stopPlace.estimatedCalls}
            />
        </div>
    )
}
