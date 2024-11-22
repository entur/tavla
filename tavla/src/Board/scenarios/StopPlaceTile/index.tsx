import { TStopPlaceTile } from 'types/tile'
import { Table } from '../Table'
import { StopPlaceQuery, TStopPlaceQuery } from 'graphql/index'
import { Tile } from 'components/Tile'
import { TableHeader } from '../Table/components/TableHeader'
import { TileLoader } from 'Board/components/TileLoader'
import { useQuery } from 'hooks/useQuery'
import { addMinutesToDate, formatDateToISO } from 'utils/time'
import {
    DataFetchingFailed,
    FetchErrorTypes,
} from 'Board/components/DataFetchingFailed'
import { TTheme } from 'types/settings'

export function StopPlaceTile({
    placeId,
    whitelistedLines,
    whitelistedTransportModes,
    columns,
    walkingDistance,
    offset,
    displayName,
    data: initialData,
    theme,
}: TStopPlaceTile & { data?: TStopPlaceQuery; theme?: TTheme }) {
    const { data, isLoading, error } = useQuery(
        StopPlaceQuery,
        {
            stopPlaceId: placeId,
            whitelistedTransportModes,
            whitelistedLines,
        },
        { poll: true, offset: offset, fallbackData: initialData },
    )


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
        <Tile className="flex flex-col">
            <TableHeader
                heading={displayName ?? data.stopPlace.name}
                walkingDistance={walkingDistance}
            />
            <Table
                departures={data.stopPlace.estimatedCalls}
                situations={data.stopPlace.situations}
                columns={columns}
                theme={theme}
            />
        </Tile>
    )
}
