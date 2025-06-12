import { Header } from 'components/Header'
import { TBoard, TFolder } from 'types/settings'
import { Board } from 'Board/scenarios/Board'
import { getBoard, getFolderForBoard } from 'Board/scenarios/Board/firebase'
import { Footer } from 'components/Footer'
import { useRefresh } from 'hooks/useRefresh'
import { getBackendUrl } from 'utils/index'
import Head from 'next/head'
import { useEffect } from 'react'

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
        },
    }
}

function BoardPage({
    board,
    folder,
    backend_url,
}: {
    board: TBoard
    folder: TFolder | null
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
                    <Footer
                        board={updatedBoard}
                        logo={folder?.logo !== undefined}
                    />
                </div>
            </div>
        </div>
    )
}

export default BoardPage
