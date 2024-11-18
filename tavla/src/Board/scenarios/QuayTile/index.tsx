import { TQuayTile } from 'types/tile'
import { Table } from '../Table'
import { GetQuayQuery } from 'graphql/index'
import { Tile } from 'components/Tile'
import { TableHeader } from '../Table/components/TableHeader'
import { isNotNullOrUndefined } from 'utils/typeguards'
import { TileLoader } from 'Board/components/TileLoader'
import { useQuery } from 'hooks/useQuery'
import { addMinutesToDate, formatDateToISO } from 'utils/time'
import { DataFetchingFailed } from 'Board/components/DataFetchingFailed'

export function QuayTile({
    placeId,
    whitelistedLines,
    whitelistedTransportModes,
    columns,
    walkingDistance,
    offset,
    displayName,
}: TQuayTile) {
    const { data, isLoading } = useQuery(
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

    if (isLoading) {
        return (
            <Tile>
                <TileLoader />
            </Tile>
        )
    }

    if (!data || !data.quay) {
        return (
            <Tile>
                <DataFetchingFailed />
            </Tile>
        )
    }

    const heading: string = [data.quay.name, data.quay.publicCode]
        .filter(isNotNullOrUndefined)
        .join(' ')

    return (
        <Tile className="flex flex-col">
            <TableHeader
                heading={displayName ?? heading}
                walkingDistance={walkingDistance}
            />
            <Table
                columns={columns}
                departures={data.quay.estimatedCalls}
                situations={data.quay.situations}
            />
        </Tile>
    )
}
