import { TStopPlaceTile } from 'types/tile'
import { Table } from '../Table'
import { StopPlaceQuery } from 'graphql/index'
import { Tile } from 'components/Tile'
import { TableHeader } from '../Table/components/TableHeader'
import { TileLoader } from 'Board/components/TileLoader'
import { useQuery } from 'hooks/useQuery'
import { addMinutesToDate, formatDateToISO } from 'utils/time'
import { DataFetchingFailed } from 'Board/components/DataFetchingFailed'

export function StopPlaceTile({
    placeId,
    whitelistedLines,
    whitelistedTransportModes,
    columns,
    walkingDistance,
    offset,
    displayName,
}: TStopPlaceTile) {
    const { data, isLoading } = useQuery(
        StopPlaceQuery,
        {
            stopPlaceId: placeId,
            whitelistedTransportModes,
            whitelistedLines,
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

    if (!data || !data.stopPlace) {
        return (
            <Tile>
                <DataFetchingFailed />
            </Tile>
        )
    }

    return (
        <Tile className="flex flex-col">
            <TableHeader
                heading={displayName ?? data.stopPlace.name}
                walkingDistance={walkingDistance}
            />
            <Table
                departures={data.stopPlace.estimatedCalls}
                situations={data.stopPlace.situations}
                columns={columns}
            />
        </Tile>
    )
}
