import {
    DataFetchingFailed,
    FetchErrorTypes,
} from 'Board/components/DataFetchingFailed'
import { TileLoader } from 'Board/components/TileLoader'
import { Tile } from 'components/Tile'
import { StopPlaceQuery } from 'graphql/index'
import { useQuery } from 'hooks/useQuery'
import { TStopPlaceTile } from 'types/tile'
import { getUniqueSituationsFromDepartures } from '../Board/utils'
import { Table } from '../Table'
import { Situations } from '../Table/components/Situations'
import { StopPlaceQuayDeviation } from '../Table/components/StopPlaceDeviation'
import { TableHeader } from '../Table/components/TableHeader'
import { useCycler } from '../Table/useCycler'

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

    const uniqueSituations = getUniqueSituationsFromDepartures(
        data?.stopPlace?.estimatedCalls,
        data?.stopPlace?.situations,
    )
    const index = useCycler(uniqueSituations ?? [], 10000)

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
            <div className="overflow-hidden">
                <TableHeader
                    heading={displayName ?? data.stopPlace.name}
                    walkingDistance={walkingDistance}
                />
                <StopPlaceQuayDeviation
                    situations={data.stopPlace.situations}
                />
                <Table
                    departures={data.stopPlace.estimatedCalls}
                    filterSituations={data.stopPlace.situations}
                    columns={columns}
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
