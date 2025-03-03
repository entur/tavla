import {
    DataFetchingFailed,
    FetchErrorTypes,
} from 'Board/components/DataFetchingFailed'
import { TileLoader } from 'Board/components/TileLoader'
import { Tile } from 'components/Tile'
import { StopPlaceQuery } from 'graphql/index'
import { useQuery } from 'hooks/useQuery'
import { TStopPlaceTile } from 'types/tile'
import { TStopPlace } from 'types/graphql-schema'
import { SingleView } from './SingleView'

function SingleStopPlaceTile({ tile }: { tile: TStopPlaceTile }) {
    const { data, isLoading, error } = useQuery(
        StopPlaceQuery,
        {
            stopPlaceId: tile.placeId,
            whitelistedTransportModes: tile.whitelistedTransportModes,
            whitelistedLines: tile.whitelistedLines,
            numberOfDepartures: 1,
        },
        { poll: true, offset: tile.offset },
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

    return <SingleView data={data.stopPlace as TStopPlace} />
}

export { SingleStopPlaceTile }
