'use server'
import { getBoard, getFolderForBoard } from 'Board/scenarios/Board/firebase'
import { Board_Legacy } from 'src/components/legacy/Board_Legacy'
import {
    BoardDB,
    BoardTileDB,
    QuayTileDB,
    StopPlaceTileDB,
} from 'types/db-types/boards'
import { FolderDB } from 'types/db-types/folders'
import { getBackendUrl } from 'utils/index'
import '../../app/globals.css'

const STOP_PLACE_QUERY = `
query StopPlace($stopPlaceId: String!, $whitelistedTransportModes: [TransportMode], $whitelistedLines: [ID!], $numberOfDepartures: Int = 20, $startTime: DateTime) {
  stopPlace(
    id: $stopPlaceId
  ) {
    name
    transportMode
    estimatedCalls(
      numberOfDepartures: $numberOfDepartures,
      whiteListedModes: $whitelistedTransportModes,
      whiteListed: {
        lines: $whitelistedLines
      },
      includeCancelledTrips: true,
      startTime: $startTime
    ) {
      quay {
        publicCode
        name
      }
      destinationDisplay {
        frontText
        via
      }
      aimedDepartureTime
      expectedDepartureTime
      expectedArrivalTime
      serviceJourney {
        id
        transportMode
        transportSubmode
        line {
          id
          publicCode
          presentation {
            textColour
            colour
          }
        }
      }
      cancellation
      realtime
      situations {
        id
        description {
          value
          language
        }
        summary {
          value
          language
        }
      }
    }
    situations {
      id
      description {
        value
        language
      }
      summary {
        value
        language
      }
    }
  }
}
`

const QUAY_QUERY = `
query getQuay($quayId: String!, $whitelistedTransportModes: [TransportMode], $whitelistedLines: [ID!], $numberOfDepartures: Int = 20, $startTime: DateTime) {
  quay(
    id: $quayId
  ) {
    name
    description
    publicCode
    lines {
        id
        publicCode
        name
        transportMode
    }
    estimatedCalls(
      numberOfDepartures: $numberOfDepartures,
      whiteListedModes: $whitelistedTransportModes,
      whiteListed: {
        lines: $whitelistedLines
      },
      includeCancelledTrips: true,
      startTime: $startTime
    ) {
      quay {
        publicCode
        name
      }
      destinationDisplay {
        frontText
        via
      }
      aimedDepartureTime
      expectedDepartureTime
      expectedArrivalTime
      serviceJourney {
        id
        transportMode
        transportSubmode
        line {
          id
          publicCode
          presentation {
            textColour
            colour
          }
        }
      }
      cancellation
      realtime
      situations {
        id
        description {
          value
          language
        }
        summary {
          value
          language
        }
      }
    }
    situations {
      id
      description {
        value
        language
      }
      summary {
        value
        language
      }
    }
    stopPlace {
      situations {
        id
        description {
          value
          language
        }
        summary {
          value
          language
        }
      }
    }
  }
}
`

async function localFetcher(query: string, variables: any) {
    const url = 'https://api.entur.io/journey-planner/v3/graphql'
    console.log('Fetching from:', url)

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'ET-Client-Name': 'entur-tavla',
        },
        body: JSON.stringify({ query, variables }),
    })

    const text = await response.text()
    console.log('Response status:', response.status)

    if (!response.ok) {
        console.error('Response text (error):', text)
        throw new Error(
            `Fetch failed: ${response.status} ${response.statusText} - ${text}`,
        )
    }

    try {
        return JSON.parse(text)
    } catch (e) {
        console.error('Failed to parse JSON. Response text:', text)
        throw e
    }
}

export async function getServerSideProps({
    params,
}: {
    params: { id: string }
}) {
    const { id } = params

    const board: BoardDB | undefined = await getBoard(id)

    if (!board) {
        return {
            notFound: true,
        }
    }

    const folder = await getFolderForBoard(id)

    // Hent data for alle tiles
    const tilesDataArray = await Promise.all(
        board.tiles?.map(async (tile: BoardTileDB) => {
            if (tile.type === 'stop_place') {
                const stopPlaceTile = tile as StopPlaceTileDB
                try {
                    console.log(
                        'Fetching data for stop place:',
                        stopPlaceTile.placeId,
                    )
                    const res = await localFetcher(STOP_PLACE_QUERY, {
                        stopPlaceId: stopPlaceTile.placeId,
                        whitelistedTransportModes:
                            stopPlaceTile.whitelistedTransportModes,
                        whitelistedLines: stopPlaceTile.whitelistedLines,
                        numberOfDepartures: 20,
                        startTime: new Date().toISOString(),
                    })
                    return {
                        uuid: tile.uuid,
                        data: res.data,
                    }
                } catch (error) {
                    console.error('Failed to fetch tile data:', error)
                    return {
                        uuid: tile.uuid,
                        data: null,
                        error: true,
                    }
                }
            } else if (tile.type === 'quay') {
                const quayTile = tile as QuayTileDB
                try {
                    console.log('Fetching data for quay:', quayTile.placeId)
                    const res = await localFetcher(QUAY_QUERY, {
                        quayId: quayTile.placeId,
                        whitelistedTransportModes:
                            quayTile.whitelistedTransportModes,
                        whitelistedLines: quayTile.whitelistedLines,
                        numberOfDepartures: 20,
                        startTime: new Date().toISOString(),
                    })
                    return {
                        uuid: tile.uuid,
                        data: res.data,
                    }
                } catch (error) {
                    console.error('Failed to fetch tile data:', error)
                    return {
                        uuid: tile.uuid,
                        data: null,
                        error: true,
                    }
                }
            }
            return { uuid: (tile as any).uuid, data: null }
        }) ?? [],
    )

    const tilesData = tilesDataArray.reduce(
        (acc, curr) => {
            acc[curr.uuid] = curr.data
            return acc
        },
        {} as Record<string, any>,
    )

    return {
        props: {
            board,
            folder,
            backend_url: getBackendUrl(),
            tilesData,
        },
    }
}

export default function LegacyPage({
    board,
    folder,
    backend_url,
    tilesData,
}: {
    board: BoardDB
    folder: FolderDB | null
    backend_url: string
    tilesData: Record<string, any>
}) {
    return (
        <>
            <div>
                <h1 className="text-9xl">Legacy Board Page</h1>
                <p className="text-orange-300">
                    Board: {board.meta?.title ?? board.id}
                </p>
                <Board_Legacy board={board} tilesData={tilesData} />
            </div>
        </>
    )
}
