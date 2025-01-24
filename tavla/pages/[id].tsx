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
import { GetServerSideProps } from 'next'
import { isUnsupportedBrowser } from 'utils/browserDetection'

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { params, req } = context
    const { id } = params as { id: string }

    const ua = req.headers['user-agent'] || ''
    if (isUnsupportedBrowser(ua)) {
        return {
            redirect: {
                destination: '/unsupported-browser',
                permanent: false,
            },
        }
    }

    const board: TBoard | undefined = await getBoard(id)

    if (!board) {
        return {
            notFound: true,
        }
    }

    const organization = await getOrganizationWithBoard(id)

    return {
        props: {
            board,
            organization,
            backend_url: getBackendUrl(),
        },
    }
}

function BoardPage({
    board,
    organization,
    backend_url,
}: {
    board: TBoard
    organization: TOrganization | null
    backend_url: string
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
        <div>
            <style jsx global>
                {`
                    body {
                        background-color: ${updatedBoard.theme === 'dark'
                            ? 'black'
                            : 'white'};
                    }
                `}
            </style>

            <div className="root" data-theme={updatedBoard.theme ?? 'dark'}>
                <Head>
                    <title>{title}</title>
                </Head>
                <div className="rootContainer">
                    <Header
                        theme={updatedBoard.theme}
                        organizationLogo={organization?.logo}
                    />
                    <Board board={updatedBoard} />
                    <Footer
                        board={updatedBoard}
                        logo={organization?.logo !== undefined}
                        orgFooter={organization?.footer}
                    />
                </div>
            </div>
        </div>
    )
}

export default BoardPage
