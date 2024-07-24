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
    return {
        props: {
            board,
            organization: await getOrganizationWithBoard(id),
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

    return (
        <div className="root" data-theme={updatedBoard.theme ?? 'dark'}>
            <Head>
                <title>
                    {`${updatedBoard.meta?.title} | Entur tavla ` ??
                        'Entur Tavla'}
                </title>
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
    )
}

export default BoardPage
