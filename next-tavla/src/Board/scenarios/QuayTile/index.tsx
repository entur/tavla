import { TQuayTile } from 'types/tile'
import { Table } from '../../scenarios/Table'
import classes from './styles.module.css'
import { GetQuayQuery } from 'graphql/index'
import { Tile } from 'components/Tile'
import { TableHeader } from '../Table/components/TableHeader'
import { isNotNullOrUndefined } from 'utils/typeguards'
import { TileLoader } from 'Board/components/TileLoader'
import { useQuery } from 'hooks/useQuery'
import { addMinutesToDate, formatDateToISO } from 'utils/time'

export function QuayTile({
    placeId,
    whitelistedLines,
    whitelistedTransportModes,
    columns,
    walkingDistance,
    offset,
}: TQuayTile) {
    const { data } = useQuery(
        GetQuayQuery,
        {
            quayId: placeId,
            whitelistedLines,
            whitelistedTransportModes,
            startTime: formatDateToISO(
                addMinutesToDate(new Date(), offset ?? 0),
            ),
        },
        { poll: true },
    )

    if (!data) {
        return (
            <Tile>
                <TileLoader />
            </Tile>
        )
    }

    if (!data.quay) {
        return <Tile>Data not found</Tile>
    }

    const heading: string = [data.quay.name, data.quay.publicCode]
        .filter(isNotNullOrUndefined)
        .join(' ')
    return (
        <Tile className={classes.quayTile}>
            <TableHeader heading={heading} walkingDistance={walkingDistance} />
            <Table
                columns={columns}
                departures={data.quay.estimatedCalls}
                situations={data.quay.situations}
            />
        </Tile>
    )
}
