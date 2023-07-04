import { TStopPlaceTile } from 'types/tile'
import { Table } from '../../scenarios/Table'
import classes from './styles.module.css'
import { useQuery } from 'graphql/utils'
import { StopPlaceQuery } from 'graphql/index'
import { Tile } from 'components/Tile'

export function StopPlaceTile({
    placeId,
    whitelistedLines,
    whitelistedTransportModes,
}: TStopPlaceTile) {
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
        <Tile className={classes.stopPlaceTile}>
            <h3>{data.stopPlace.name}</h3>
            <Table departures={data.stopPlace.estimatedCalls} />
        </Tile>
    )
}
