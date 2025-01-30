import React from 'react'
import { TCombinedTile } from 'types/tile'
import { GetQuayQuery, StopPlaceQuery, TSituationFragment } from 'graphql/index'
import { Tile } from 'components/Tile'
import { TableHeader } from '../Table/components/TableHeader'
import { TileLoader } from 'Board/components/TileLoader'
import {
    DataFetchingFailed,
    FetchErrorTypes,
} from 'Board/components/DataFetchingFailed'
import { Table } from '../Table'
import { useQueries } from 'hooks/useQuery'

export function CombinedTile({
    placeId,
    whitelistedLines,
    whitelistedTransportModes,
    columns,
    walkingDistance,
    offset,
    displayName,
}: TCombinedTile) {
    const quayQueries = placeId
        .filter(({ type }) => type === 'quay')
        .map(({ id }) => ({
            query: GetQuayQuery,
            variables: {
                quayId: id,
                whitelistedTransportModes,
                whitelistedLines,
            },
            options: { offset, poll: true },
        }))

    const stopPlaceQueries = placeId
        .filter(({ type }) => type === 'stop_place')
        .map(({ id }) => ({
            query: StopPlaceQuery,
            variables: {
                stopPlaceId: id,
                whitelistedTransportModes,
                whitelistedLines,
            },
            options: { offset, poll: true },
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
        ...(quayData?.flatMap(
            (data) =>
                data?.quay?.estimatedCalls.map((call) => ({
                    ...call,
                    name: data.quay?.name,
                })) ?? [],
        ) ?? []),
        ...(stopPlaceData?.flatMap(
            (data) =>
                data?.stopPlace?.estimatedCalls.map((call) => ({
                    ...call,
                    name: data.stopPlace?.name,
                })) ?? [],
        ) ?? []),
    ]
    const situations: TSituationFragment[] = [
        ...(quayData?.flatMap((data) => data?.quay?.situations ?? []) ?? []),
        ...(stopPlaceData?.flatMap(
            (data) => data?.stopPlace?.situations ?? [],
        ) ?? []),
    ]
    const sortedEstimatedCalls = estimatedCalls.sort((a, b) => {
        const timeA = new Date(a.expectedDepartureTime).getTime()
        const timeB = new Date(b.expectedDepartureTime).getTime()

        if (isNaN(timeA)) return 1
        if (isNaN(timeB)) return -1

        return timeA - timeB
    })

    return (
        <Tile className="flex flex-col max-sm:min-h-[30vh]">
            <TableHeader
                heading={displayName ?? 'Kombinerte stoppesteder'}
                walkingDistance={walkingDistance}
            />
            <Table
                departures={sortedEstimatedCalls}
                situations={situations}
                columns={columns}
            />
        </Tile>
    )
}
