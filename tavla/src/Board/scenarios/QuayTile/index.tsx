import {
    DataFetchingFailed,
    FetchErrorTypes,
} from 'Board/components/DataFetchingFailed'
import { TileLoader } from 'Board/components/TileLoader'
import { Tile } from 'components/Tile'
import { GetQuayQuery, TSituationFragment } from 'graphql/index'
import { useQuery } from 'hooks/useQuery'
import { TQuayTile } from 'types/tile'
import { isNotNullOrUndefined } from 'utils/typeguards'
import { combineIdenticalSituations } from '../Board/utils'
import { Table } from '../Table'
import { StopPlaceQuayDeviation } from '../Table/components/StopPlaceDeviation'
import { TableHeader } from '../Table/components/TableHeader'

export function QuayTile({
    placeId,
    whitelistedLines,
    whitelistedTransportModes,
    columns,
    walkingDistance,
    offset,
    displayName,
}: TQuayTile) {
    const { data, isLoading, error } = useQuery(
        GetQuayQuery,
        {
            quayId: placeId,
            whitelistedLines,
            whitelistedTransportModes,
        },
        { poll: true, offset: offset ?? 0 },
    )

    const situations: TSituationFragment[] = combineIdenticalSituations([
        ...(data?.quay?.stopPlace.situations ?? []),
        ...(data?.quay?.situations ?? []),
    ])

    if (isLoading && !data) {
        return (
            <Tile>
                <TileLoader />
            </Tile>
        )
    }

    if (error || !data || !data.quay) {
        return (
            <Tile>
                <DataFetchingFailed
                    timeout={error?.message === FetchErrorTypes.TIMEOUT}
                />
            </Tile>
        )
    }

    const heading: string = [data.quay.name, data.quay.publicCode]
        .filter(isNotNullOrUndefined)
        .join(' ')

    return (
        <Tile className="flex flex-col max-sm:min-h-[30vh]">
            <TableHeader
                heading={displayName ?? heading}
                walkingDistance={walkingDistance}
            />
            <StopPlaceQuayDeviation situations={situations} />
            <Table
                columns={columns}
                departures={data.quay.estimatedCalls}
                situations={situations}
            />
        </Tile>
    )
}
