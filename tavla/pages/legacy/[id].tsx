import { getBoard, getFolderForBoard } from 'Board/scenarios/Board/firebase'
import TravelTag from 'src/components/legacy/TravelTag_Legacy'
import { BoardDB, StopPlaceTileDB } from 'types/db-types/boards'
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
    const tilesData = await Promise.all(
        board.tiles?.map(async (tile) => {
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
                    console.log(
                        'Data received:',
                        JSON.stringify(res.data, null, 2),
                    )
                    return {
                        tile,
                        data: res.data,
                    }
                } catch (error) {
                    console.error('Failed to fetch tile data:', error)
                    return {
                        tile,
                        data: null,
                        error: true,
                    }
                }
            }
            return { tile, data: null }
        }) ?? [],
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
    tilesData: any[]
}) {
    return (
        <>
            <div>
                <h1 className="text-9xl">Legacy Board Page</h1>
                <p className="text-orange-300">
                    Board: {board.meta?.title ?? board.id}
                </p>
                <TravelTag publicCode="00" transportMode="bus" />
                <div>
                    {tilesData.map((tileData, index) => (
                        <div key={index} style={{ margin: '20px 0' }}>
                            <h2 style={{ fontSize: '24px' }}>
                                {tileData.tile.type === 'stop_place'
                                    ? (tileData.data?.stopPlace?.name ??
                                      'Unknown')
                                    : 'Other tile type'}
                            </h2>
                            <p style={{ fontSize: '12px', color: '#666' }}>
                                ID: {tileData.tile.placeId}
                            </p>
                            {tileData.error && (
                                <p style={{ color: 'red' }}>
                                    Failed to fetch data
                                </p>
                            )}
                            {/* Debug info */}
                            <pre
                                style={{
                                    fontSize: '10px',
                                    overflow: 'auto',
                                    maxHeight: '100px',
                                    background: '#f0f0f0',
                                }}
                            >
                                {JSON.stringify(tileData.data, null, 2)}
                            </pre>
                            {tileData.data?.stopPlace?.estimatedCalls && (
                                <ul>
                                    {tileData.data.stopPlace.estimatedCalls
                                        .slice(0, 5)
                                        .map((call: any, i: number) => (
                                            <li key={i}>
                                                {call.destinationDisplay
                                                    ?.frontText ??
                                                    'Unknown'}{' '}
                                                -{' '}
                                                {call.expectedDepartureTime ??
                                                    'N/A'}
                                            </li>
                                        ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
