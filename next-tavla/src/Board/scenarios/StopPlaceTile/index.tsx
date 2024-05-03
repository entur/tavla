import { TStopPlaceTile } from 'types/tile'
import { Table } from '../../scenarios/Table'
import { StopPlaceQuery } from 'graphql/index'
import { Tile } from 'components/Tile'
import { TableHeader } from '../Table/components/TableHeader'
import { TileLoader } from 'Board/components/TileLoader'
import { useQuery } from 'hooks/useQuery'
import { addMinutesToDate, formatDateToISO } from 'utils/time'

export function StopPlaceTile({
    placeId,
    whitelistedLines,
    whitelistedTransportModes,
    columns,
    walkingDistance,
    offset,
}: TStopPlaceTile) {
    const { data } = useQuery(
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

    if (!data) {
        return (
            <Tile>
                <TileLoader />
            </Tile>
        )
    }

    if (!data.stopPlace) {
        return <Tile>Data not found</Tile>
    }

    return (
        <Tile className="flex flex-col">
            <TableHeader
                heading={data.stopPlace.name}
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
