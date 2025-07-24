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
import {
    combineIdenticalSituationsByOrigin,
    useAnnikaFunction,
} from '../Board/utils'
import { Table } from '../Table'
import { NewSituations } from '../Table/components/Situations'
import { StopPlaceQuayDeviation } from '../Table/components/StopPlaceDeviation'
import { TableHeader } from '../Table/components/TableHeader'
import { useCycler } from '../Table/useCycler'

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

    const situations: TSituationFragment[] = combineIdenticalSituationsByOrigin(
        [
            ...(data?.quay?.stopPlace.situations ?? []),
            ...(data?.quay?.situations ?? []),
        ],
    )

    const uniqueSituations = useAnnikaFunction(
        data?.quay?.estimatedCalls,
        situations,
    )
    const index = useCycler(uniqueSituations ?? [], 10000)

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
        <Tile className="flex flex-col justify-between max-sm:min-h-[30vh]">
            <div className="overflow-hidden">
                <TableHeader
                    heading={displayName ?? heading}
                    walkingDistance={walkingDistance}
                />
                <StopPlaceQuayDeviation situations={situations} />
                <Table
                    columns={columns}
                    departures={data.quay.estimatedCalls}
                    situations={situations}
                    currentVisibleSituationId={
                        uniqueSituations?.[index]?.situation.id
                    }
                />
            </div>
            <NewSituations
                situation={uniqueSituations?.[index]?.situation}
                currentSituationNumber={index}
                numberOfSituations={uniqueSituations?.length}
                cancelledDeparture={
                    uniqueSituations?.[index]?.cancellation ?? false
                }
            />
        </Tile>
    )
}
