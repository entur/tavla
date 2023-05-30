import { TQuayTile } from 'types/tile'
import { Table } from 'scenarios/Table'
import classes from './styles.module.css'
import { useQuery } from 'graphql/utils'
import { GetQuayQuery } from 'graphql/index'

export function QuayTile({
    placeId,
    columns,
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
        return <div className="tile">Loading data</div>
    }

    if (!data.quay) {
        return <div className="tile">Data not found</div>
    }

    return (
        <div className={classes.quayTile}>
            <div className={classes.heading}>
                <h3>{data.quay.name}</h3>
                <h4>
                    {data.quay.publicCode} {data.quay.description}
                </h4>
            </div>
            <Table columns={columns} departures={data.quay.estimatedCalls} />
        </div>
    )
}
