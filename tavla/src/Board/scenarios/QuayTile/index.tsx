import { TQuayTile } from 'types/tile'
import { Table } from '../Table'
import { GetQuayQuery, TGetQuayQuery } from 'graphql/index'
import { Tile } from 'components/Tile'
import { TableHeader } from '../Table/components/TableHeader'
import { isNotNullOrUndefined } from 'utils/typeguards'
import { TileLoader } from 'Board/components/TileLoader'
import { useQuery } from 'hooks/useQuery'
import {
    DataFetchingFailed,
    FetchErrorTypes,
} from 'Board/components/DataFetchingFailed'
import { TTheme } from 'types/settings'
import * as Sentry from '@sentry/nextjs'

export function QuayTile({
    placeId,
    whitelistedLines,
    whitelistedTransportModes,
    columns,
    walkingDistance,
    offset,
    displayName,
    data: initialData,
    theme,
}: TQuayTile & { data?: TGetQuayQuery; theme: TTheme }) {
    const { data, isLoading, error } = useQuery(
        GetQuayQuery,
        {
            quayId: placeId,
            whitelistedLines,
            whitelistedTransportModes,
        },
        { poll: true, offset: offset ?? 0, fallbackData: initialData },
    )

    if (isLoading && !data) {
        return (
            <Tile>
                <TileLoader />
            </Tile>
        )
    }

    if (error || !data || !data.quay) {
        Sentry.captureException(
            new Error(
                error
                    ? 'Unknown error occurred while fetching quay departures'
                    : 'Departure fetch for quay returned no data',
            ),
            {
                extra: {
                    quayId: placeId,
                },
            },
        )
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
        <Tile className="flex flex-col">
            <TableHeader
                heading={displayName ?? heading}
                walkingDistance={walkingDistance}
            />
            <Table
                columns={columns}
                departures={data.quay.estimatedCalls}
                situations={data.quay.situations}
                theme={theme}
            />
        </Tile>
    )
}
