import { TBoard } from 'types/settings'
import { Tile } from 'components/Tile'
import { TravelTag } from 'components/TravelTag'
import { GetQuayQuery, StopPlaceQuery } from 'graphql/index'
import { useQuery } from 'hooks/useQuery'
import { TQuayTile, TStopPlaceTile, TTile } from 'types/tile'
import { TileLoader } from 'Board/components/TileLoader'
import {
    DataFetchingFailed,
    FetchErrorTypes,
} from 'Board/components/DataFetchingFailed'
import { FormattedTime } from '../Table/components/Time/components/FormattedTime'
import { getAirPublicCode } from 'utils/publicCode'
import { isNotNullOrUndefined } from 'utils/typeguards'
import { defaultFontSize, getFontScale } from '../Board/utils'
import { Situation } from '../Table/components/Situation'

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

    console.log(data)

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

    const departure = data.stopPlace.estimatedCalls[0]
    const journey = departure?.serviceJourney

    const destinationText =
        (departure?.destinationDisplay?.via
            ?.filter(isNotNullOrUndefined)
            .join(', ') ?? '')
            ? `${departure?.destinationDisplay?.frontText} via ${departure?.destinationDisplay?.via}`
            : departure?.destinationDisplay?.frontText

    return (
        <div className="flex flex-row gap-10 justify-between text-white align-center">
            <div className="flex flex-col gap-6">
                <TravelTag
                    transportMode={journey?.transportMode ?? 'unknown'}
                    transportSubmode={journey?.transportSubmode ?? undefined}
                    publicCode={
                        (departure?.serviceJourney.transportMode === 'air'
                            ? getAirPublicCode(journey?.id ?? '')
                            : (journey?.line.publicCode ?? '')) ?? ''
                    }
                />
                <p className="text-9xl text-ellipsis">{destinationText}</p>

                <Situation situation={departure?.situations[0]} />
            </div>
            <FormattedTime time={departure?.expectedDepartureTime ?? ''} />
        </div>
    )
}

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

    const departure = data.quay.estimatedCalls[0]
    const journey = departure?.serviceJourney

    const destinationText =
        (departure?.destinationDisplay?.via
            ?.filter(isNotNullOrUndefined)
            .join(', ') ?? '')
            ? `${departure?.destinationDisplay?.frontText} via ${departure?.destinationDisplay?.via}`
            : departure?.destinationDisplay?.frontText

    return (
        <div className="flex flex-row gap-10 justify-between text-white align-center">
            <div className="flex flex-col gap-6">
                <div className="flex gap-2 justify-start items-center pr-2">
                    <TravelTag
                        transportMode={journey?.transportMode ?? 'unknown'}
                        transportSubmode={
                            journey?.transportSubmode ?? undefined
                        }
                        publicCode={
                            (journey?.transportMode === 'air'
                                ? getAirPublicCode(journey?.id ?? '')
                                : (journey?.line.publicCode ?? '')) ?? ''
                        }
                    />
                </div>
                <p className="text-9xl text-ellipsis">{destinationText}</p>

                <Situation situation={departure?.situations[0]}></Situation>
            </div>
            <FormattedTime time={departure?.expectedDepartureTime ?? ''} />
        </div>
    )
}

function SingleTile({ tile }: { tile: TTile }) {
    switch (tile.type) {
        case 'stop_place':
            return <SingleStopPlaceTile tile={tile} />
        case 'quay':
            return <SingleQuayTile tile={tile} />
    }
}

function SingleDepartureView({ board }: { board: TBoard }) {
    const tile = board.tiles[0]

    if (!board.tiles || !board.tiles.length || !tile)
        return (
            <Tile className="flex items-center justify-center">
                <p>Du har ikke lagt til noen stoppesteder ennå.</p>
            </Tile>
        )
    return (
        <div
            className={`max-sm:overflow-y-scroll h-full ${getFontScale(
                board.meta?.fontSize || defaultFontSize(board),
            )} `}
        >
            <SingleTile tile={tile} />
        </div>
    )
}

export { SingleDepartureView }
