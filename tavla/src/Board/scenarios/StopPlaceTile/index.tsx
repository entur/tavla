import { TStopPlaceTile } from 'types/tile'
import { Table } from '../Table'
import { StopPlaceQuery } from 'graphql/index'
import { Tile } from 'components/Tile'
import { TableHeader } from '../Table/components/TableHeader'
import { TileLoader } from 'Board/components/TileLoader'
import { useQuery } from 'hooks/useQuery'
import {
    DataFetchingFailed,
    FetchErrorTypes,
} from 'Board/components/DataFetchingFailed'
import * as Sentry from '@sentry/nextjs'

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

    if (isLoading && !data) {
        return (
            <Tile>
                <TileLoader />
            </Tile>
        )
    }

    if (error || !data || !data.stopPlace) {
        if (!error) {
            Sentry.captureException(
                new Error('Departure fetch for stopPlace returned no data'),
                {
                    extra: {
                        stopPlaceId: placeId,
                    },
                },
            )
        }
        return (
            <Tile>
                <DataFetchingFailed
                    timeout={error?.message === FetchErrorTypes.TIMEOUT}
                />
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
