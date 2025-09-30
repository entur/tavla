import { Board } from 'Board/scenarios/Board'
import { getBoard, getFolderForBoard } from 'Board/scenarios/Board/firebase'
import { Header } from 'components/Header'
import { InfoMessage } from 'components/InfoMessage'
import { useHeartbeat } from 'hooks/useHeartbeat'
import { useRefresh } from 'hooks/useRefresh'
import Head from 'next/head'
import { useEffect } from 'react'
import { TBoard, TFolder } from 'types/settings'
import { getBackendUrl } from 'utils/index'

export async function getServerSideProps({
    params,
}: {
    params: { id: string }
}) {
    const { id } = params

    const board: TBoard | undefined = await getBoard(id)

    if (!board) {
        return {
            notFound: true,
        }
    }

    const folder = await getFolderForBoard(id)

    return {
        props: {
            board,
            folder,
            backend_url: getBackendUrl(),
            backend_api_key: process.env.BACKEND_API_KEY || '',
        },
    }
}

function BoardPage({
    board,
    folder,
    backend_url,
    backend_api_key,
}: {
    board: TBoard
    folder: TFolder | null
    backend_url: string
    backend_api_key: string
}) {
    const updatedBoard = useRefresh(board, backend_url)

    useHeartbeat(board, backend_api_key)

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
                    <meta
                        name="theme-color"
                        content={
                            updatedBoard.theme === 'dark'
                                ? '#000000'
                                : '#ffffff'
                        }
                    />
                </Head>
                <div className="rootContainer">
                    <Header
                        theme={updatedBoard.theme}
                        folderLogo={folder?.logo}
                    />
                    <Board board={updatedBoard} />
                    <InfoMessage
                        board={updatedBoard}
                        logo={folder?.logo !== undefined}
                    />
                </div>
            </div>
        </div>
    )
}

export default BoardPage
