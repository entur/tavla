import {
    GetQuayQuery,
    StopPlaceQuery,
    TDepartureFragment,
    TSituationFragment,
} from 'graphql/index'
import { useQueries, useQuery } from 'hooks/useQuery'
import { BoardTileDB, QuayTileDB, StopPlaceTileDB } from 'types/db-types/boards'
import { isNotNullOrUndefined } from 'utils/typeguards'
import {
    combineSituations,
    getAccumulatedTileSituations,
    TileSituation,
} from '../scenarios/Board/utils'
import { useCycler } from '../scenarios/Table/useCycler'

export type TDepartureWithTileUuid = TDepartureFragment & { tileUuid?: string }

export type CustomName = {
    uuid: string
    customName: string
}

interface BaseTileData {
    displayName?: string
    estimatedCalls: TDepartureFragment[]
    situations: TSituationFragment[]
    uniqueSituations: TileSituation[]
    currentSituationIndex: number
    isLoading: boolean
    error?: Error
    hasData: boolean
}

interface CombinedTileData extends Omit<BaseTileData, 'estimatedCalls'> {
    estimatedCalls: TDepartureWithTileUuid[]
    customNames?: CustomName[]
}

export function useQuayTileData({
    placeId,
    whitelistedLines,
    whitelistedTransportModes,
    offset,
    displayName,
}: QuayTileDB): BaseTileData {
    const { data, isLoading, error } = useQuery(
        GetQuayQuery,
        {
            quayId: placeId,
            whitelistedLines,
            whitelistedTransportModes,
        },
        { poll: true, offset: offset ?? 0 },
    )

    const combinedStopPlaceQuaySituations: TSituationFragment[] =
        combineSituations([
            ...(data?.quay?.stopPlace.situations ?? []),
            ...(data?.quay?.situations ?? []),
        ])

    const uniqueSituations = getAccumulatedTileSituations(
        data?.quay?.estimatedCalls,
        combinedStopPlaceQuaySituations,
    )

    const currentSituationIndex = useCycler(uniqueSituations ?? [], 10000)

    const heading: string = [data?.quay?.name, data?.quay?.publicCode]
        .filter(isNotNullOrUndefined)
        .join(' ')

    return {
        displayName: displayName ?? heading,
        estimatedCalls: data?.quay?.estimatedCalls ?? [],
        situations: combinedStopPlaceQuaySituations,
        uniqueSituations: uniqueSituations ?? [],
        currentSituationIndex,
        isLoading,
        error,
        hasData: !!data?.quay,
    }
}

export function useStopPlaceTileData({
    placeId,
    whitelistedLines,
    whitelistedTransportModes,
    offset,
    displayName,
}: StopPlaceTileDB): BaseTileData {
    const { data, isLoading, error } = useQuery(
        StopPlaceQuery,
        {
            stopPlaceId: placeId,
            whitelistedTransportModes,
            whitelistedLines,
        },
        { poll: true, offset: offset ?? 0 },
    )

    const uniqueSituations = getAccumulatedTileSituations(
        data?.stopPlace?.estimatedCalls,
        data?.stopPlace?.situations,
    )

    const currentSituationIndex = useCycler(uniqueSituations ?? [], 10000)

    return {
        displayName: displayName ?? data?.stopPlace?.name ?? '',
        estimatedCalls: data?.stopPlace?.estimatedCalls ?? [],
        situations: data?.stopPlace?.situations ?? [],
        uniqueSituations: uniqueSituations ?? [],
        currentSituationIndex,
        isLoading,
        error,
        hasData: !!data?.stopPlace,
    }
}

export function useCombinedTileData(
    combinedTile: BoardTileDB[],
): CombinedTileData {
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

    const estimatedCalls = [
        ...(stopPlaceData?.flatMap((data, index) => {
            const tile = combinedTile.filter((t) => t.type === 'stop_place')[
                index
            ]
            return (data.stopPlace?.estimatedCalls ?? []).map((call) => ({
                ...call,
                tileUuid: tile?.uuid,
            }))
        }) ?? []),
        ...(quayData?.flatMap((data, index) => {
            const tile = combinedTile.filter((t) => t.type === 'quay')[index]
            return (data.quay?.estimatedCalls ?? []).map((call) => ({
                ...call,
                tileUuid: tile?.uuid,
            }))
        }) ?? []),
    ]

    const sortedEstimatedCalls = estimatedCalls.sort((a, b) => {
        const timeA = new Date(a.expectedDepartureTime).getTime()
        const timeB = new Date(b.expectedDepartureTime).getTime()
        return (
            (isNaN(timeA) ? Infinity : timeA) -
            (isNaN(timeB) ? Infinity : timeB)
        )
    })

    // Combine situations with origin information
    const situations: TSituationFragment[] = [
        ...(stopPlaceData?.flatMap((data) => {
            const origin = data?.stopPlace?.name ?? ''
            const situations = data?.stopPlace?.situations ?? []
            return situations.map((situation) => ({
                origin,
                ...situation,
            }))
        }) ?? []),
        ...(quayData?.flatMap((data) => {
            const origin = data.quay?.name ?? ''
            const situations = data?.quay?.stopPlace?.situations ?? []
            return situations.map((situation) => ({
                origin,
                ...situation,
            }))
        }) ?? []),
    ]

    const combinedSituations: TSituationFragment[] =
        combineSituations(situations)

    const uniqueSituations = getAccumulatedTileSituations(
        sortedEstimatedCalls,
        combinedSituations,
    )

    const currentSituationIndex = useCycler(uniqueSituations ?? [], 10000)

    const customNames: CustomName[] = combinedTile
        .map((tile) =>
            tile.displayName
                ? { uuid: tile.uuid, customName: tile.displayName }
                : null,
        )
        .filter(isNotNullOrUndefined)

    return {
        displayName: undefined,
        estimatedCalls: sortedEstimatedCalls,
        situations: combinedSituations,
        uniqueSituations: uniqueSituations ?? [],
        currentSituationIndex,
        isLoading: quayLoading || stopPlaceLoading,
        error: quayError || stopPlaceError,
        hasData: !!(quayData?.length || stopPlaceData?.length),
        customNames,
    }
}
