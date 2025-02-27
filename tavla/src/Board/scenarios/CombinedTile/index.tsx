import React from 'react'
import { TTile } from 'types/tile'
import { GetQuayQuery, StopPlaceQuery, TSituationFragment } from 'graphql/index'
import { Tile } from 'components/Tile'
import { TileLoader } from 'Board/components/TileLoader'
import {
    DataFetchingFailed,
    FetchErrorTypes,
} from 'Board/components/DataFetchingFailed'
import { Table } from '../Table'
import { useQueries } from 'hooks/useQuery'
import { DEFAULT_COMBINED_COLUMNS } from 'types/column'
import { sortBy } from 'lodash'

export function CombinedTile({ combinedTile }: { combinedTile: TTile[] }) {
    const quayQueries = combinedTile
        .filter(({ type }) => type === 'quay')
        .map((tile) => ({
            query: GetQuayQuery,
            variables: {
                quayId: tile.placeId,
                whitelistedTransportModes: tile.whitelistedTransportModes,
                whitelistedLines: tile.whitelistedLines,
            },
            options: { offset: tile.offset, poll: true },
        }))

    const stopPlaceQueries = combinedTile
        .filter(({ type }) => type === 'stop_place')
        .map((tile) => ({
            query: StopPlaceQuery,
            variables: {
                stopPlaceId: tile.placeId,
                whitelistedTransportModes: tile.whitelistedTransportModes,
                whitelistedLines: tile.whitelistedLines,
            },
            options: { offset: tile.offset, poll: true },
        }))

    const {
        data: quayData,
        error: quayError,
        isLoading: quayLoading,
    } = useQueries(quayQueries)

    const {
        data: stopPlaceData,
        error: stopPlaceError,
        isLoading: stopPlaceLoading,
    } = useQueries(stopPlaceQueries)

    const loading = quayLoading || stopPlaceLoading
    const errors = quayError || stopPlaceError

    if (loading) {
        return (
            <Tile>
                <TileLoader />
            </Tile>
        )
    }
    if (errors) {
        return (
            <Tile>
                <DataFetchingFailed
                    timeout={errors?.message === FetchErrorTypes.TIMEOUT}
                />
            </Tile>
        )
    }

    const estimatedCalls = [
        ...(quayData?.flatMap((data) => data.quay?.estimatedCalls ?? []) ?? []),
        ...(stopPlaceData?.flatMap(
            (data) => data.stopPlace?.estimatedCalls ?? [],
        ) ?? []),
    ]

    const situations: TSituationFragment[] = [
        ...(quayData?.flatMap((data) => data?.quay?.situations ?? []) ?? []),
        ...(stopPlaceData?.flatMap(
            (data) => data?.stopPlace?.situations ?? [],
        ) ?? []),
    ]

    const sortedEstimatedCalls = sortBy(estimatedCalls, (call) => {
        const time = new Date(call.expectedDepartureTime).getTime()
        return isNaN(time) ? Infinity : time
    })

    return (
        <Tile className="flex flex-col max-sm:min-h-[30vh]">
            <Table
                departures={sortedEstimatedCalls}
                situations={situations}
                columns={DEFAULT_COMBINED_COLUMNS}
            />
        </Tile>
    )
}
