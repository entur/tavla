import {
    DataFetchingFailed,
    FetchErrorTypes,
} from 'Board/components/DataFetchingFailed'
import { TileLoader } from 'Board/components/TileLoader'
import { Tile } from 'components/Tile'
import { GetQuayQuery, StopPlaceQuery, TSituationFragment } from 'graphql/index'
import { useQueries } from 'hooks/useQuery'
import { sortBy } from 'lodash'
import { DEFAULT_COMBINED_COLUMNS } from 'types/column'
import { TTile } from 'types/tile'
import {
    combineSituations,
    getUniqueSituationsFromDepartures,
} from '../Board/utils'
import { Table } from '../Table'
import { Situations } from '../Table/components/Situations'
import { CombinedTileDeviation } from '../Table/components/StopPlaceDeviation'
import { useCycler } from '../Table/useCycler'

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

    const estimatedCalls = [
        ...(stopPlaceData?.flatMap(
            (data) => data.stopPlace?.estimatedCalls ?? [],
        ) ?? []),
        ...(quayData?.flatMap((data) => data.quay?.estimatedCalls ?? []) ?? []),
    ]

    const sortedEstimatedCalls = sortBy(estimatedCalls, (call) => {
        const time = new Date(call.expectedDepartureTime).getTime()
        return isNaN(time) ? Infinity : time
    })

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

    const uniqueSituations = getUniqueSituationsFromDepartures(
        sortedEstimatedCalls,
        combinedSituations,
    )
    const index = useCycler(uniqueSituations ?? [], 10000)

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

    return (
        <Tile className="flex flex-col max-sm:min-h-[30vh]">
            <div className="overflow-hidden">
                <CombinedTileDeviation situations={combinedSituations} />
                <Table
                    departures={sortedEstimatedCalls}
                    stopPlaceSituations={combinedSituations}
                    columns={DEFAULT_COMBINED_COLUMNS}
                    currentVisibleSituationId={
                        uniqueSituations?.[index]?.situation.id
                    }
                    numberOfVisibleSituations={uniqueSituations?.length}
                />
            </div>
            <Situations
                situation={uniqueSituations?.[index]?.situation}
                currentSituationNumber={index}
                numberOfSituations={uniqueSituations?.length}
                cancelledDeparture={
                    uniqueSituations?.[index]?.cancellation ?? false
                }
                transportModeList={uniqueSituations?.[index]?.transportModeList}
                publicCodeList={uniqueSituations?.[index]?.publicCodeList}
            />
        </Tile>
    )
}
