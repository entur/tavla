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
import { TGetQuayQuery, TStopPlaceQuery } from 'graphql/index'
import { isUnsupportedBrowser } from 'utils/browserDetection'
import { GetServerSideProps } from 'next'
import { SSRQuayQuery, SSRStopPlaceQuery } from 'graphql/ssrQueries'
import * as Sentry from '@sentry/nextjs'

export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        const { params, req } = context
        if (!params || !req) {
            Sentry.captureMessage('Missing params or req in getServerSideProps')
            return {
                notFound: true,
            }
        }
        const { id } = params as { id: string }
        const ua = req.headers['user-agent'] || ''
        const fetchBoardServerSide = isUnsupportedBrowser(ua)

        if (!id) {
            Sentry.captureMessage('Missing board ID in getServerSideProps')
            return {
                notFound: true,
            }
        }

        const board: TBoard | undefined = await getBoard(id)

        if (!board) {
            Sentry.captureMessage('Missing board-object in getServerSideProps')
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
    } catch (error) {
        Sentry.captureMessage('Unknown error occurred in getServerSideProps')
        Sentry.captureException(error)
        return {
            notFound: true,
        }
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
                <Board board={updatedBoard} data={tileData} />
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
// Used for server side rendering on unsupported browsers
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
                const data = await fetchQuery(SSRStopPlaceQuery, variables)
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
                const data = await fetchQuery(SSRQuayQuery, variables)
                return data
            } else {
                return null
            }
        }),
    )
    return tileData
}
