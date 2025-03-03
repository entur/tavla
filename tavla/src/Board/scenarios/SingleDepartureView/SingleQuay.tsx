import {
    DataFetchingFailed,
    FetchErrorTypes,
} from 'Board/components/DataFetchingFailed'
import { TileLoader } from 'Board/components/TileLoader'
import { Tile } from 'components/Tile'
import { GetQuayQuery } from 'graphql/index'
import { useQuery } from 'hooks/useQuery'
import { TQuayTile } from 'types/tile'
import { SingleView } from './SingleView'
import { TQuay } from 'types/graphql-schema'

function SingleQuayTile({ tile }: { tile: TQuayTile }) {
    const { data, isLoading, error } = useQuery(
        GetQuayQuery,
        {
            quayId: tile.placeId,
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

    if (error || !data || !data.quay) {
        return (
            <Tile>
                <DataFetchingFailed
                    timeout={error?.message === FetchErrorTypes.TIMEOUT}
                />
            </Tile>
        )
    }

    return <SingleView data={data.quay as TQuay} />
}

export { SingleQuayTile }
