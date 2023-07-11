import { TQuayTile } from 'types/tile'
import { Table } from '../../scenarios/Table'
import classes from './styles.module.css'
import { useQuery } from 'graphql/utils'
import { GetQuayQuery } from 'graphql/index'
import { Tile } from 'components/Tile'
import { TableHeader } from '../Table/components/TableHeader'
import { isNotNullOrUndefined } from 'utils/typeguards'

export function QuayTile({
    placeId,
    whitelistedLines,
    whitelistedTransportModes,
    columns,
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
    const transportModes = Array.from(
        new Set(data.quay.lines.map((line) => line.transportMode)),
    )

    const heading: string = [
        data.quay.name,
        data.quay.publicCode,
        data.quay.description,
    ]
        .filter(isNotNullOrUndefined)
        .join(' ')

    return (
        <Tile className={classes.quayTile}>
            <TableHeader heading={heading} transportModes={transportModes} />
            <Table columns={columns} departures={data.quay.estimatedCalls} />
        </Tile>
    )
}
