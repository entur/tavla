import { Header } from 'components/Header'
import { TBoard, TOrganization } from 'types/settings'
import { Board } from 'Board/scenarios/Board'
import {
    getBoard,
    getOrganizationWithBoard,
} from 'Board/scenarios/Board/firebase'
import { Footer } from 'components/Footer'
import { useRefresh } from 'hooks/useRefresh'
import { getBackendUrl } from 'utils/index'
import Head from 'next/head'
import { useEffect } from 'react'
import { fetchQuery } from 'graphql/utils'
import { addMinutesToDate, formatDateToISO } from 'utils/time'
import {
    TGetQuayQuery,
    TGetQuayQueryVariables,
    TStopPlaceQuery,
    TStopPlaceQueryVariables,
    TypedDocumentString,
} from 'graphql/index'
import { isUnsupportedBrowser } from 'utils/browserDetection'
import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { params, req } = context
    const { id } = params as { id: string }
    const ua = req.headers['user-agent'] || ''
    const fetchBoardServerSide = isUnsupportedBrowser(ua)

    const board: TBoard | undefined = await getBoard(id)

    if (!board) {
        return {
            notFound: true,
        }
    }

    const organization = await getOrganizationWithBoard(id)

    let tileData = null
    if (fetchBoardServerSide) {
        tileData = await getTileData(board)
    }

    return {
        props: {
            board,
            organization,
            backend_url: getBackendUrl(),
            tileData,
        },
    }
}

function BoardPage({
    board,
    organization,
    backend_url,
    tileData,
}: {
    board: TBoard
    organization: TOrganization | null
    backend_url: string
    tileData?: (TStopPlaceQuery | TGetQuayQuery | null)[]
}) {
    const updatedBoard = useRefresh(board, backend_url)

    const title = updatedBoard.meta?.title
        ? updatedBoard.meta.title + ' | Entur tavla'
        : 'Entur Tavla'

    useEffect(() => {
        const refreshTimeout = setTimeout(
            () => {
                window.location.reload()
            },
            24 * 60 * 60 * 1000,
        )

        return () => clearTimeout(refreshTimeout)
    }, [])

    return (
        <div className="root" data-theme={updatedBoard.theme ?? 'dark'}>
            <Head>
                <title>{title}</title>
            </Head>
            <div className="rootContainer">
                <Header
                    theme={updatedBoard.theme}
                    organizationLogo={organization?.logo}
                />
                <Board board={board} data={tileData} />
                <Footer
                    board={updatedBoard}
                    logo={organization?.logo !== undefined}
                    orgFooter={organization?.footer}
                />
            </div>
        </div>
    )
}

export default BoardPage

// Fetch data for each tile on the board
const getTileData = async (board: TBoard) => {
    const tileData = await Promise.all(
        board.tiles.map(async (tile) => {
            if (tile.type === 'stop_place') {
                const variables = {
                    stopPlaceId: tile.placeId,
                    whitelistedTransportModes: tile.whitelistedTransportModes,
                    whitelistedLines: tile.whitelistedLines,
                    startTime: formatDateToISO(
                        addMinutesToDate(new Date(), tile.offset ?? 0),
                    ),
                }
                const data = await fetchQuery(StopPlaceQuery, variables)
                return data
            } else if (tile.type === 'quay') {
                const variables = {
                    quayId: tile.placeId,
                    whitelistedLines: tile.whitelistedLines,
                    whitelistedTransportModes: tile.whitelistedTransportModes,
                    startTime: formatDateToISO(
                        addMinutesToDate(new Date(), tile.offset ?? 0),
                    ),
                }
                const data = await fetchQuery(QuayQuery, variables)
                return data
            } else {
                return null
            }
        }),
    )
    return tileData
}

const StopPlaceQuery = `
        query StopPlace($stopPlaceId: String!, $whitelistedTransportModes: [TransportMode], $whitelistedLines: [ID!], $numberOfDepartures: Int = 20, $startTime: DateTime) {
      stopPlace(id: $stopPlaceId) {
        name
        transportMode
        estimatedCalls(
          numberOfDepartures: $numberOfDepartures
          whiteListedModes: $whitelistedTransportModes
          whiteListed: {lines: $whitelistedLines}
          includeCancelledTrips: true
          startTime: $startTime
        ) {
          ...departure
        }
        situations {
          ...situation
        }
      }
    }
        fragment departure on EstimatedCall {
      quay {
        publicCode
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
        ...situation
      }
    }
    fragment situation on PtSituationElement {
      id
      description {
        value
        language
      }
      summary {
        value
        language
      }
    }` as unknown as TypedDocumentString<
    TStopPlaceQuery,
    TStopPlaceQueryVariables
>

const QuayQuery = `
    query getQuay($quayId: String!, $whitelistedTransportModes: [TransportMode], $whitelistedLines: [ID!], $numberOfDepartures: Int = 20, $startTime: DateTime) {
  quay(id: $quayId) {
    name
    description
    publicCode
    ...lines
    estimatedCalls(
      numberOfDepartures: $numberOfDepartures
      whiteListedModes: $whitelistedTransportModes
      whiteListed: {lines: $whitelistedLines}
      includeCancelledTrips: true
      startTime: $startTime
    ) {
      ...departure
    }
    situations {
      ...situation
    }
  }
}
    fragment departure on EstimatedCall {
  quay {
    publicCode
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
    ...situation
  }
}
fragment lines on Quay {
  lines {
    id
    publicCode
    name
    transportMode
  }
}
fragment situation on PtSituationElement {
  id
  description {
    value
    language
  }
  summary {
    value
    language
  }
}` as unknown as TypedDocumentString<TGetQuayQuery, TGetQuayQueryVariables>
