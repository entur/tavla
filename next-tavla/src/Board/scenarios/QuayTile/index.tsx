import { TQuayTile } from 'types/tile'
import { Table } from '../../scenarios/Table'
import classes from './styles.module.css'
import { useQuery } from 'graphql/utils'
import { GetQuayQuery } from 'graphql/index'
import { Tile } from 'components/Tile'

export function QuayTile({
    placeId,
    whitelistedLines,
    whitelistedTransportModes,
}: TQuayTile) {
    const { data } = useQuery(
        GetQuayQuery,
        {
            quayId: placeId,
            whitelistedLines,
            whitelistedTransportModes,
        },
        { poll: true },
    )

    if (!data) {
        return <Tile>Loading data</Tile>
    }

    if (!data.quay) {
        return <Tile>Data not found</Tile>
    }

    return (
        <Tile className={classes.quayTile}>
            <div className={classes.heading}>
                <h3>{data.quay.name}</h3>
                <h4>
                    {data.quay.publicCode} {data.quay.description}
                </h4>
            </div>
            <Table departures={data.quay.estimatedCalls} />
        </Tile>
    )
}
