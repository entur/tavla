import { TStopPlaceTile } from 'types/tile'
import { Table } from '../Table'
import { StopPlaceQuery, TSituationFragment } from 'graphql/index'
import { Tile } from 'components/Tile'
import { TableHeader } from '../Table/components/TableHeader'
import { TileLoader } from 'Board/components/TileLoader'
import { useQuery } from 'hooks/useQuery'
import {
    DataFetchingFailed,
    FetchErrorTypes,
} from 'Board/components/DataFetchingFailed'
import { StopPlaceQuayDeviation } from '../Table/components/StopPlaceDeviation'
import { combineIdenticalSituations } from '../Board/utils'

export function StopPlaceTile({
    placeId,
    whitelistedLines,
    whitelistedTransportModes,
    columns,
    walkingDistance,
    offset,
    displayName,
}: TStopPlaceTile) {
    const { data, isLoading, error } = useQuery(
        StopPlaceQuery,
        {
            stopPlaceId: placeId,
            whitelistedTransportModes,
            whitelistedLines,
        },
        { poll: true, offset: offset },
    )

    const situations: TSituationFragment[] = combineIdenticalSituations([
        ...(data?.stopPlace?.situations ?? []),
        ...(data?.stopPlace?.quays?.flatMap((quay) => {
            const origin =
                quay.publicCode && quay.publicCode !== ''
                    ? quay.publicCode
                    : undefined
            const situations = quay.situations ?? []
            return situations.map((situation) => ({
                origin,
                ...situation,
            }))
        }) ?? []),
    ]).map((situation) => {
        if (
            situation.origin &&
            situation.origin.split(' ')[0] !== 'Plattform'
        ) {
            situation.origin = 'Plattform ' + situation.origin
        } else {
            situation.origin = 'På plattform'
        }
        return situation
    })

    if (isLoading && !data) {
        return (
            <Tile>
                <TileLoader />
            </Tile>
        )
    }

    if (error || !data || !data.stopPlace) {
        return (
            <Tile>
                <DataFetchingFailed
                    timeout={error?.message === FetchErrorTypes.TIMEOUT}
                />
            </Tile>
        )
    }

    return (
        <Tile className="flex flex-col max-sm:min-h-[30vh]">
            <TableHeader
                heading={displayName ?? data.stopPlace.name}
                walkingDistance={walkingDistance}
            />
            <StopPlaceQuayDeviation situations={situations} />
            <Table
                departures={data.stopPlace.estimatedCalls}
                situations={situations}
                columns={columns}
            />
        </Tile>
    )
}
